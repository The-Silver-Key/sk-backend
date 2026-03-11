const express = require('express');

const router = express.Router();

router.route('/moralis').post(async (req, res) => {

    console.log("Request body from moralis: ", req.body);

    res.status(200).json({
        status: "Success"
    });
    
})

module.exports = router;