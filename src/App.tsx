import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useWriteContracts, useCallsStatus } from 'wagmi/experimental'

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
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
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
 

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
        <div>
      <button onClick={handleMint}>Mint</button>
      {callsStatus && <div> Status: {callsStatus.status}</div>}
    </div>
      </div>
    </>
  )
}

export default App
