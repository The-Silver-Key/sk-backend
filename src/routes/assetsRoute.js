const express = require('express');
const { authenticate } = require('../middlewares/authenthicate')
const assetsController = require('./../controllers/assetsController')

const router = express.Router();

router.route('/')
    .get(authenticate, assetsController.getAssets)
    .post(authenticate, assetsController.addAsset)

module.exports = router;