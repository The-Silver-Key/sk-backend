const express = require('express');
const estateController = require('./../controllers/estateController')
const { authenticate } = require('../middlewares/authenthicate')
const authController = require('./../controllers/authController')

const router = express.Router();

router.route('/')
    .get(authenticate, estateController.getEstate)
    .post(authenticate, estateController.createEstate)

module.exports = router;