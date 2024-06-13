import { useAccount } from 'wagmi'
import Connect from './components/Connect'
import Payout from './components/Payout'

function App() {
    const account = useAccount()

    if (!account.isConnected)
        return (<Connect />)
    else
        return (<Payout />)
}

export default App
