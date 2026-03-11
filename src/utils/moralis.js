const Moralis = require('moralis').default

exports.initMoralis = async () => {
    console.log("Initting moralis");
    
    const moralisApiKey = process.env.MORALIS_API_KEY;
    await Moralis.start({
        apiKey: moralisApiKey,
    });
}

exports.startStream = async () => {

    const streamDetails = {
        chains: [0x1], //Eth mainnet
        tag: "The Silver Key Approval Stream",
        description: "Stream to listen for approval events on contract addresses",
        webhookUrl: "https://thesilverkey-backend.onrender.com/webhooks/moralis",
        includeContractLogs: true,
        abi: [
            {
                anonymous: false,
                inputs: [
                {indexed: true, name: "owner", type: "address"},
                {indexed: true, name: "spender", type: "address"},
                {indexed: false, name: "value", type: "uint256"}
                ],
                name: "Approval",
                type: "event"
                }
        ]
    }

    const stream = await Moralis.Streams.add(streamDetails);

    console.log("Stream Result: ", stream);
    
    
}