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

    const resultBeneficiary = result.rows[0];

    const beneficiary = {
        id: resultBeneficiary.id,
        name: resultBeneficiary.name,
        email: resultBeneficiary.email,
        walletAddress: resultBeneficiary.wallet_address,
        relationship: resultBeneficiary.relationship,
        allocation: resultBeneficiary.allocation_percent,
        notificationEnabled: resultBeneficiary.enable_notifications,
        createdAt: resultBeneficiary.created_at
    }
    
        res.status(201).json({
            status: 'success',
            message: 'Beneficiary added successfully',
            data: {
                beneficiary
            }
        })
}

exports.updateBeneficiary = async (req, res) => {
        
    const { name, email, allocation, relationship} = req.body
    const id = req.params.id

    const result = await pool.query(`UPDATE beneficiaries 
        SET name = $1, email = $2, allocation_percent = $3, relationship = $4 
        WHERE id = $5 
        RETURNING *`, 
        [name, email, allocation, relationship, req.params.id])

    console.log("Updated beneficiary data: ", result.rows);

    const beneficiary = result.rows[0];

    res.status(200).json({
        status: 'success',
        message: 'Beneficiary updated successfully',
        data: {
            beneficiary
        }
    })

}

exports.deleteBeneficiary = async (req, res) => {

    const id = req.params.id;

    const result = await pool.query(`DELETE FROM beneficiaries WHERE id = $1 RETURNING *`, [id])

    console.log("Deleted beneficiary data: ", result.rows);

    if (!result.rows[0]) {
        return res.status(404).json({
            status: 'fail',
            message: 'Beneficiary not found'
        })
    }

    res.status(200).json({
        status: 'success',
        message: 'Beneficiary deleted successfully'
    });

}
