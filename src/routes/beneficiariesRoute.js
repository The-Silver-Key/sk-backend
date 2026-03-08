const express = require('express')
const { authenticate } = require('../middlewares/authenthicate')
const beneficiariesController = require('./../controllers/beneficiariesController')

const router = express.Router()

router.route('/')
    .get(authenticate, beneficiariesController.getBeneficiaries)
    .post(authenticate, beneficiariesController.addBeneficiary)

module.exports = router;