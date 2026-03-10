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

    console.log("Result tokens: ", result.data);
    
    
    const Assets = [
        {
            id: 1,
            walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
            symbol: "USDT",
            name: "Tether",
            balance: 1000,
            allowance: 1000,
            usdValue: 1000,
            type: 'token',
            lastUpdated: new Date().toISOString()
        },
        {
            id: 2,
            walletAddress: "0x2324567890abcdef1234567890abcdef12345678",
            symbol: "MEME",
            name: "Memecoin",
            balance: 3200,
            allowance: 1000,
            usdValue: 3000,
            type: 'token',
            lastUpdated: new Date().toISOString()
        }
    ]

    //return result.data;
    return Assets;

}