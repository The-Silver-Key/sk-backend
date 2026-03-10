const axios = require('axios');
const pool = require('./../db');

exports.getAllTokens = async (userWalletAddress, chain) => {

    //get all tokens from moralis endpoint      

    const moralisApiKey = process.env.MORALIS_API_KEY;
    const url = `${process.env.MORALIS_BASE_URL}/wallets/${userWalletAddress}/tokens?chain=eth&exclude_spam=true&exclude_unverified_contracts=true`;

    const result = await axios.get(url, {
        headers: {
            'X-API-KEY': moralisApiKey
        }
    })

    console.log("Result tokens: ", result);
    
    return result;
}