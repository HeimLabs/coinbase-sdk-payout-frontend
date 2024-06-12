import { useAccount } from 'wagmi'
import { useWriteContracts, useCallsStatus } from 'wagmi/experimental'
import Connect from './components/Connect'
import Payout from './components/Payout'

const abi = [
    {
        stateMutability: 'nonpayable',
        type: 'function',
        inputs: [{ name: 'to', type: 'address' }],
        name: 'safeMint',
        outputs: [],
    }
] as const

function App() {
    const account = useAccount()
    const { data: id, writeContracts } = useWriteContracts()
    const { data: callsStatus } = useCallsStatus({
        id: id as string,
        query: {
            enabled: !!id,
            // Poll every second until the calls are confirmed
            refetchInterval: (data) =>
                data.state.data?.status === "CONFIRMED" ? false : 1000,
        },
    });

    const handleMint = () => {
        writeContracts({
            contracts: [
                {
                    address: "0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
                    abi,
                    functionName: "safeMint",
                    args: [account.address],
                },
                {
                    address: "0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
                    abi,
                    functionName: "safeMint",
                    args: [account.address],
                },
                {
                    address: "0x119Ea671030FBf79AB93b436D2E20af6ea469a19",
                    abi,
                    functionName: "safeMint",
                    args: [account.address],
                }
            ],
        })
    }

    if (!account.isConnected)
        return (<Connect />)
    else
        return (<Payout />)
}

export default App
