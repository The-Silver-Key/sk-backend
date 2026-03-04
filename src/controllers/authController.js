const jwt = require('jsonwebtoken')
const pool = require('../db')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

exports.signup = async (req, res) => {

    try {
        const { email, password } = req.body
        if(!email || !password) {
            return res.status(400).send("Please enter email and password")
        }

        //hash password before storing in db (for security reasons)
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const result = await pool.query(`INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id`, [email, hashedPassword])
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

        //3.) generate token and return token to the user
        const token = jwt.sign({ userId: result.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({
            status: 'success',
            token: token
        })
    } catch (error) {
        
    }
}

exports.forgotPassword = async (req, res) => {
    //get user from db
    const userResult = await pool.query(`SELECT * FROM users WHERE email = $1`, [req.body.email])
    if(userResult.rows.length == 0) {
        res.status(404).json({
            status: "fail",
            message: "There is no user with this email"
        })
    }

    //generate random token
    const token = crypto.randomBytes(32).toString('hex');
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');

    //save the hashed token to db
    const result = await pool.query(`UPDATE users SET passwordResetToken = $1, passwordResetExpires = $2 WHERE email = $3 RETURNING *`, [passwordResetToken, new Date(Date.now() + 10 * 60 * 1000), req.body.email])
    console.log("resetResult: ", result);
    res.status(200).json({
        status: "success",
        message: "Password reset token generated and saved to db",
        token: token
    })

    //TODO: Implement sending token to email using nodemailer etc.
    
}

exports.protect = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    console.log("token: ", token);
    
 
    if (!token) {
        res.status(401).json({
            status: 'fail',
            message: 'Auth token required!'
        })
    }

    //verification of token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log(decoded);
    

    next();

    //check if user still exists in db (in case user is deleted after token is issued)
    const userResult = await pool.query(`SELECT * FROM users WHERE id = $1`, [decoded.userId])

    if(userResult.rows.length === 0) {
        return res.status(401).json({
            status: 'fail',
            message: 'User no longer exists'
        })
    }

    //check if user changed password
    //TODO!

    //TODO: add user info to req object and use it in the controllers
    //TODO: add token expiration handling
}