const express = require('express');
const userControler = require('./../controllers/userController')
const authController = require('./../controllers/authController')

const router = express.Router();

router.get('/', authController.protect, userControler.getUsers)

module.exports = router;