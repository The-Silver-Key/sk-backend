const pool = require('../db')

exports.getBeneficiaries = async (req, res) => {
    //res.send("Working beneficiaries route")

    const result = await pool.query(`SELECT * FROM beneficiaries WHERE estate_id = $1`, [req.params.estateId])

}

exports.addBeneficiary = async (req, res) => {
    //res.send("Working add beneficiary route")

    //Since only one estate per user, get estate id and add beneficiary to that estate
    const estateResult = await pool.query(`SELECT * FROM estates WHERE user_id = $1 AND is_active = TRUE`, [req.user.id])
    const estate = estateResult.rows[0];

    const beneficiaryData = req.body;
    console.log("Beneficiaries details: ", beneficiaryData);
    

    const result = await pool.query(`INSERT INTO beneficiaries 
        (estate_id, name , email, wallet_address, relationship, allocation_percent, enable_notifications) 
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`, 
        [estate.id, beneficiaryData.name, beneficiaryData.email, beneficiaryData.walletAddress, beneficiaryData.relationship, beneficiaryData.allocation, beneficiaryData.notificationEnabled])

    const Beneficiary = {
        
    }
    
        res.status(201).json(result.rows[0])
}

exports.updateBeneficiary = async (req, res) => {
    res.send("Working update beneficiary route")
}

exports.deleteBeneficiary = async (req, res) => {
    res.send("Working delete beneficiary route")
}
