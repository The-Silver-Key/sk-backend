const pool = require('./../db');

exports.updateAllowance = async (req, res) => {
    console.log("Request body from moralis: ", req.body);

    //get new allowance and user's wallet address
    const allowance = 100 //req.body.newAllowance
    const userAddress = '0x0239323' //req.body.userAddress

    //Update the asset with current allowance
    const result = await pool.query(`UPDATE assets SET allowance = $1 WHERE wallet_address = $2 RETURNING *`, [allowance, userAddress])

    console.log("Updated Asset: ", result.rows);

    res.status(200).json({
        status: "Success"
    });
}