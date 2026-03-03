const jwt = require('jsonwebtoken')
const pool = require('../db')

exports.signup = async (req, res) => {

    try {
        const result = await pool.query(`INSERT INTO users (email, password) VALUES ($1, $2)`, [req.body.email, req.body.password])
        console.log("result: ", result);

        const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.status(201).json({
            status: 'success',
            data: result,
            token: token
        })
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Internal server error");
    }
    
}

exports.login = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}