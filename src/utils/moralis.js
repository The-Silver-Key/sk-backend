const Moralis = require('moralis').default

exports.initMoralis = async () => {
    console.log("Initting moralis");
    
    const moralisApiKey = process.env.MORALIS_API_KEY;
    await Moralis.start({
        apiKey: moralisApiKey,
    });
}

exports.createStream = async () => {

    try {
        const streamDetails = {
            chains: [0x1], //Eth mainnet
            tag: "The Silver Key Approval Stream",
            description: "Stream to listen for approval events on contract addresses",
            webhookUrl: "https://the-silver-key.onrender.com/webhooks/moralis",
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
            ],
            topic0: ['Approval(address,address,uint256)']
        }
    
        const stream = await Moralis.Streams.add(streamDetails);
    
        console.log("Stream Result: ", stream);
    } catch (error) {
        console.log("Error: ", error);
        
    }
    
    
}

exports.getAllStreams = async () => {

    try {
        const streams = await Moralis.Streams.getAll({
            limit: 100
        });
        console.log("All Streams: ", streams.jsonResponse.result);
        
    } catch (error) {

        console.log("Error getting streams: ", error);
        
    }
}

exports.deleteStream = async (id) => {

    try {
        const result = await Moralis.Streams.delete({
            id
        })
    } catch (error) {
        console.log("There was an error deleting the stream: ", error);
        
    }

}