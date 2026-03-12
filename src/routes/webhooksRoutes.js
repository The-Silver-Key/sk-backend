const express = require('express');
const webhhokController = require('./../controllers/webhookController');

const router = express.Router();

router.route('/moralis').post(webhhokController.updateAllowance);

module.exports = router;