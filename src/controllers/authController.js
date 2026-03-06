const jwt = require('./../utils/jwt')
const pool = require('../db')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

exports.signup = async (req, res) => {

    try {
        const { email, password, name } = req.body
        if(!email || !password) {
            return res.status(400).send("Please enter email and password")
        }

        //hash password before storing in db (for security reasons)
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const result = await pool.query(`INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id`, [email, hashedPassword, name || null])
        console.log("result: ", result);

        const userId = result.rows[0].id;

        const token = jwt.generateToken(userId)

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

        const user = result.rows[0];
        console.log("user: ", user);
        
        
        try {
            if(result.rows.length === 0 || !await bcrypt.compare(password, user.password_hash)) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'Incorrect email or password'
                })
            }
        } catch (error) {
            console.log("password check error: ", error);
            return res.status(500).send("Internal server error")
        }

        //3.) generate token and return token to the user
        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '12h' })
        console.log("token: ", token);
        
        res.status(200).json({
            status: 'success',
            token: token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                created_at: user.created_at
            }
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

