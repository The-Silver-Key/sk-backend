const express = require('express')
const pool = require('../db')
const { authenticate } = require('../middlewares/authenthicate')
const walletsController = require('./../controllers/walletsController')

const router = express.Router()

router.route('/')
    .get(authenticate, walletsController.getWallets)
    .post(authenticate, walletsController.addWallet)

router.route('/:id')
    .delete(authenticate, walletsController.deleteWallet)

module.exports = router;