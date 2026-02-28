const express = require('express')
const authController = require('./../controllers/authController')
const pool = require('../db')

const router = express.Router()

router.ppst('/signup', async (req, res) => {
    res.send("Signup route")

    const result = await pool.query(`INSERT INTO users (email, password) VALUES ('rddfed', 'password')`)
    console.log("result: ", result);
})

router.post('/login', async (req, res) => {
    res.send("Login route")
})

module.exports = router;