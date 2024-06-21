import Connect from './components/Connect'
import Payout from './components/Payout'
import { useWallet } from './context/wallet.context'

function App() {
    const { isConnected } = useWallet();

    if (!isConnected)
        return (<Connect />)
    else
        return (<Payout />)
}

export default App
