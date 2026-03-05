const express = require('express');
const estateController = require('./../controllers/estateController')

const router = express.Router();

router.route('/')
    .get(estateController.getEstate)
    .post(estateController.createEstate)

module.exports = router;