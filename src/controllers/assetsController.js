const pool = require('../db')
const assetsService = require('../services/assetsService')

exports.getAssets = async (req, res) => {
    //NB: Turn to post request and get User wallets fron frontend?

    const userID = req.user.id

    //Get user wallets from db
    const walletResult = await pool.query(`SELECT wallet_address FROM user_wallets 
        WHERE user_id = $1`, 
        [userID]);

    const userWalletAddresses = walletResult.rows.map(wallet => wallet.wallet_address)
    console.log("Wallet addresses: ", userWalletAddresses);

    //First get all user tokens using Moralis API
    const result = await assetsService.getAllTokens(userID, userWalletAddresses, 'eth')
    res.status(200).json(result)

}

exports.addAsset = async (req, res) => {
    try {
    const { asset, allowance } = req.body
    const { walletAddress, name, tokenAddress, chain, balance } = asset
    const userId = req.user.id

    // Get the wallet id, also verify the wallet belongs to the authenticated user
    const walletResult = await pool.query(
      `SELECT id FROM user_wallets 
       WHERE wallet_address = $1 
       AND user_id = $2`,
      [walletAddress, userId]
    )

    if (walletResult.rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Wallet not found'
      })
    }

    const walletId = walletResult.rows[0].id

    // Insert the asset
    // ON CONFLICT handles the case where the user re-approves an already existing token
    // instead of throwing an error, it just updates the allowance
    const result = await pool.query(
      `INSERT INTO assets (user_wallet_id, asset_name, token_address, chain, allowance, user_balance)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (user_wallet_id, token_address, chain)
       DO UPDATE SET 
         allowance = EXCLUDED.allowance,
         user_balance = EXCLUDED.user_balance,
         updated_at = NOW()
       RETURNING *`,
      [walletId, name, tokenAddress, chain, allowance, balance]
    )

    return res.status(201).json({
      status: 'success',
      message: 'Asset added successfully',
      data: { asset: result.rows[0] }
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ status: 'error', message: 'Internal server error' })
  }
}