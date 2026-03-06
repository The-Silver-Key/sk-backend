const pool = require('../db')

exports.getWallets = async (req, res) => {

}

exports.addWallet = async (req, res) => {
    try {
        const { id } = req.user;
        const chain = 'ethereum';
        
    
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