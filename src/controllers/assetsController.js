const pool = require('../db')
const assetsService = require('../services/assetsService')

exports.getAssets = async (req, res) => {
    //NB: Turn to post request and get User wallets fron frontend?

    //Get user wallets from db
    const walletResult = await pool.query(`SELECT wallet_address FROM user_wallets 
        WHERE user_id = $1`, 
        [req.user.id]);

    const userWalletAddresses = walletResult.rows.map(wallet => wallet.wallet_address)
    console.log("Wallet addresses: ", userWalletAddresses);

    //First get all user tokens using Moralis API
    const result = await assetsService.getAllTokens(userWalletAddresses, 'eth')
    res.status(200).json(result)

}

exports.addAsset = async (req, res) => {
    res.send("Working add asset route")
}