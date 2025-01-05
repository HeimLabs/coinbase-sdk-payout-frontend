import Connect from './components/Connect'
import Payout from './components/Payout'
import GetStarted from './components/GetStarted';
import { useState } from 'react';
import styles from "./styles/Layout.module.scss";
import { useWallet } from './context/wallet.context';
import { newToken } from './configs/tokens.config';

function App() {
    const { isConnected } = useWallet()
    const [step, setStep] = useState(0);

    const setupPage = () => {
        if (!isConnected) {
            if (step == 0)
                return (<GetStarted setStep={setStep} />)
            if (step == 1)
                return (<Connect />)
        }
        else
            return (<Payout />)
    }

    return (
        <div className={styles.main}>
            {setupPage()}
            <div>
                <h1>NewToken Integration</h1>
                <p>Address: {newToken.address}</p>
            </div>
        </div>
    )


}

export default App
