const express = require('express')
const authController = require('./../controllers/authController')
const pool = require('../db')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)

module.exports = router;