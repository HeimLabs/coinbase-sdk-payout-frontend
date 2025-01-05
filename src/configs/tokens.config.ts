export const tokens = {
    testnet: [
        {
            name: "USDC",
            symbol: "$USDC",
            address: "0x036CbD53842c5426634e7929541eC2318f3dCF7e"
        },
        {
            name: "Ethereum",
            symbol: "ETH",
            address: "0x0000000000000000000000000000000000000000"
        }
    ],
    mainnet: [
        {
            name: "USDC",
            symbol: "$USDC",
            address: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
        },
        {
            name: "Ethereum",
            symbol: "ETH",
            address: "0x0000000000000000000000000000000000000000"
        }
    ]
};

const newToken = {
    name: 'NewToken',
    symbol: 'NTK',
    decimals: 18,
    address: '0x1234567890abcdef1234567890abcdef12345678'
};

export default {
    tokens,
    newToken
};