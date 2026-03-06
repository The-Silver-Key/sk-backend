const express = require('express');
const estateController = require('./../controllers/estateController')
const authController = require('./../controllers/authController')

const router = express.Router();

router.route('/')
    .get(authController.protect, estateController.getEstate)
    .post(authController.protect, estateController.createEstate)

module.exports = router;