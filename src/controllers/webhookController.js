const pool = require('./../db');

exports.updateAllowance = async (req, res) => {
    console.log("Request body from moralis: ", req.body);

    //get new allowance and user's wallet address
    const allowance = 1200 //req.body.newAllowance
    const userAddress = '0xaA5aDc8b58F56aa4BB1Ad1343df80779e15D363' //req.body.userAddress
    const tokenAddress = '0x019292'

    //Update the asset with current allowance
    const result = await pool.query(`UPDATE assets a SET allowance = $1 
        FROM user_wallets w 
        WHERE a.user_wallet_id = w.id AND w.wallet_address = $2 AND a.token_address = $3 
        RETURNING a.*`, 
        [allowance, userAddress, tokenAddress]) //pass in chain too?

    console.log("Updated Asset: ", result.rows);

    res.status(200).json({
        status: "Success",
        data: result.rows
    });
}