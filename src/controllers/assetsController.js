const pool = require('../db')
const assetsService = require('../services/assetsService')

exports.getAssets = async (req, res) => {

    //First get all user tokens using Moralis API
    const result = await assetsService.getAllTokens(req.user.wallet_address, 'eth')
    res.status(200).json(result.data)
    
}

exports.addAsset = async (req, res) => {
    res.send("Working add asset route")
}