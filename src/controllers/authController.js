const jwt = require('jsonwebtoken')
const pool = require('../db')
const bcrypt = require('bcryptjs')

exports.signup = async (req, res) => {

    try {
        const { email, password } = req.body
        if(!email || !password) {
            return res.status(400).send("Please enter email and password")
        }

        //hash password before storing in db (for security reasons)
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const result = await pool.query(`INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id`, [email, hashedPassword])
        console.log("result: ", result);

        const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '12h' })

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

        //1.) check if username and password exists
        const { email, password } = req.body
        if(!email || !password) {
            return res.status(400).send("Please enter email and password")
        }

        //2.) check if email and password is correct from db
        const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email])
        console.log(result);
        

        if(result.rows.length === 0 || !await bcrypt.compare(password, result.rows[0].password)) {
            return res.status(401).send("Invalid email or password")
        }

        //3.) return token to the user
        const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '12h' })
        res.status(200).json({
            status: 'success',
            token: token
        })
    } catch (error) {
        
    }
}