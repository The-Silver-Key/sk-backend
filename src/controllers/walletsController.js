const pool = require('../db');
const { connect } = require('../routes/authRoute');

exports.getWallets = async (req, res) => {

    try {

        const { id } = req.user;

        const result = await pool.query(`SELECT * FROM user_wallets WHERE user_id = $1`, [id])
        console.log("User wallets: ", result.rows);

        const wallets = result.rows.map(row => ({
            id: row.id,
            address: row.wallet_address,
            label: row.label,
            isPrimary: row.is_primary,
            connectedAt: row.updated_at
        }))

        res.status(200).json({
            status: 'success',
            message: 'Wallets fetched successfully',
            data: {
                wallets
            }
        })
        
    } catch (error) {

    }
}

exports.addWallet = async (req, res) => {
    try {
        const { id } = req.user;
        const chain = 'ethereum';

        console.log("req.body: ", req.body);
        
    
        const result = await pool.query(`INSERT into user_wallets (user_id, wallet_address, chain, is_primary, label) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *`, 
            [id, req.body.address, chain, req.body.isPrimary, req.body.label])
    
        res.status(201).json(result.rows[0])
    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({
            status: 'fail',
            message: 'An error occurred while adding the wallet'
        })
    }   

}