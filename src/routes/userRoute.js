const express = require('express');
const userControler = require('./../controllers/userController')
const { authenticate } = require('../middlewares/authenthicate')

const router = express.Router();

router.get('/', authenticate, userControler.getUsers)

module.exports = router;