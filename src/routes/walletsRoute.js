const express = require('express')
const pool = require('../db')
const { authenticate } = require('../middlewares/authenthicate')
const walletsController = require('./../controllers/walletsController')

const router = express.Router()

router.route('/')
    .get(authenticate, walletsController.getWallets)
    .post(authenticate, walletsController.addWallet)

router.post('/add', async (req, res) => {
    res.send("Wallet route")

    const userId = 'user id here';

    const result = await pool.query(`INSERT INTO user_wallets ()`)
})

router.post('/delete', async (req, res) => {
    res.send("Wallet delete route")
})

module.exports = router;