const jwt = require('jsonwebtoken')

const jwtSecret = process.env.JWT_SECRET

exports.generateToken = (userId) => {

    const token = jwt.sign({ userId }, jwtSecret, { expiresIn: '12h' })

    return token;

}

exports.verifyToken = token => {
    return jwt.verify(token, jwtSecret)
}