const axios = require('axios');
const pool = require('./../db');
const { v4: uuidv4 } = require('uuid')
const { ethers } = require('ethers')

exports.getAllTokens = async (userId, userWalletAddresses, chain) => {

    const moralisApiKey = process.env.MORALIS_API_KEY;

    // fetch tokens for all wallets in parallel
    const results = await Promise.all(
        userWalletAddresses.map(async (walletAddress) => {  //loops the userWalletAddresses array and makes an API call for each item
        const url = `${process.env.MORALIS_BASE_URL}/wallets/${walletAddress}/tokens?chain=eth&exclude_spam=true&exclude_unverified_contracts=true`;

        const result = await axios.get(url, {
            headers: { 'X-API-KEY': moralisApiKey }
        });

        const tokens = result.data.result; //array containing all users tokens

        console.log("Tokens: ", tokens);
        

        //loop tokens array and create object for each item with defined fields.
        return tokens.map(token => ({
            id: null,
            walletAddress, // uses the current wallet address in the loop
            symbol: token.symbol,
            name: token.name,
            tokenAddress: token.token_address,
            balance: ethers.utils.formatUnits(token.balance, token.decimals),
            allowance: 0,
            usdValue: token.usd_value,
            type: 'token',
            chain: "ethereum",
            lastUpdated: new Date().toISOString()
        }));
        })
    );

    // flatten since each wallet returns an array of tokens
    const Assets = results.flat();        

    //TODO: Get assets from database for the user and merge with moralis data to get allowance and other details.
    const assetResult = await pool.query(`SELECT a.* FROM assets a 
        JOIN user_wallets w ON w.id = a.user_wallet_id 
        WHERE w.user_id = $1`, [userId]);

    const databaseAssets = assetResult.rows;

    //check if assets are in asset table and merge them to Assets array wth their allowance and id
    const userAssets = Assets.map(asset => { 
        let dbAsset = databaseAssets.find(
            r => (r.token_address == asset.tokenAddress) && (r.chain == asset.chain)
        );

        //if dbAsset exists (asset has been granted allowance previously hence its in db; it adds allowance and ID)
        return {...asset, allowance: dbAsset?.allowance ?? 0, id: dbAsset?.id ?? uuidv4(), }
    })



    return userAssets;
};

// exports.getAllTokens = async (userWalletAddress, chain) => {

//     //get all tokens from moralis endpoint      

//     const moralisApiKey = process.env.MORALIS_API_KEY;
//     const url = `${process.env.MORALIS_BASE_URL}/wallets/${userWalletAddress}/tokens?chain=eth&exclude_spam=true&exclude_unverified_contracts=true`;

//     const result = await axios.get(url, {
//         headers: {
//             'X-API-KEY': moralisApiKey
//         }
//     })

//     //Get assets from database for the user and merge with moralis data to get allowance and other details.



    
//     console.log("Result tokens: ", result.data);

//     const tokens = result.data.result;

//     const Assets = tokens.map(token => ({
//         id: uuidv4(),
//         walletAddress: "0x",
//         symbol: token.symbol,
//         name: token.name,
//         balance: ethers.utils.formatUnits(token.balance, token.decimals),
//         allowance: 1000,
//         usdValue: token.usd_value,
//         type: 'token',
//         lastUpdated: new Date().toISOString()
//     })) 

//     //looad all the results from token (moralis api call) into Assets array
//     for (let index = 0; index < tokens.length; index++) {

//         const token = tokens[index];

//         const id = uuidv4(); //generate random IDs for tokens not in DB (0 allowance)
//         console.log("Random ID: ", id);

//         //format balance value to readable format
//         const balance = ethers.utils.formatUnits(token.balance, token.decimals);

//         let asset = {
//             id: id, 
//             walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
//             symbol: token.symbol,
//             name: token.name,
//             balance,
//             allowance: 1000,
//             usdValue: token.usd_value,
//             type: 'token',
//             lastUpdated: new Date().toISOString()
//         }

//         Assets.push(asset);
        
//     }
    
    
//     // const Assets = [
//     //     {
//     //         id: 1,
//     //         walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
//     //         symbol: "USDT",
//     //         name: "Tether",
//     //         balance: 1000,
//     //         allowance: 1000,
//     //         usdValue: 1000,
//     //         type: 'token',
//     //         lastUpdated: new Date().toISOString()
//     //     },
//     //     {
//     //         id: 2,
//     //         walletAddress: "0x2324567890abcdef1234567890abcdef12345678",
//     //         symbol: "MEME",
//     //         name: "Memecoin",
//     //         balance: 3200,
//     //         allowance: 1000,
//     //         usdValue: 3000,
//     //         type: 'token',
//     //         lastUpdated: new Date().toISOString()
//     //     }
//     // ]

//     const newAssets = Assets.map(el => ({...el, walletAddress: "9d9d9dd9"}))

//     //return result.data;
//     return Assets;

// }