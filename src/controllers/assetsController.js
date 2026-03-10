const pool = require('../db')
const assetsService = require('../services/assetsService')

exports.getAssets = async (req, res) => {

    const { walletAddress } = req.query;

    //First get all user tokens using Moralis API
    const result = await assetsService.getAllTokens(walletAddress, 'eth')
    res.status(200).json(result)

}

exports.addAsset = async (req, res) => {
    res.send("Working add asset route")
}