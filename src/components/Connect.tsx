import React from "react";
import styles from "../styles/Connect.module.scss";
import { logo } from "../assets";
import { useWallet } from "../context/wallet.context";
import { newToken } from '../configs/tokens.config';

export default function Connect(): React.JSX.Element {
    const { connect, isWalletLoading } = useWallet();

    const connectNewTokenWallet = () => {
        // logic to connect newToken wallet
    };

    return (
        <div className={styles.main}>
            <div className={styles.header}>
                <img src={logo} alt="Paymaker Logo" />
                <div className={styles.taglines}>
                    Send USDC to many people. <br />
                    Fast. Easy. Secure. <br />
                    100% Free.
                </div>
            </div>
            <div className={styles.steps}>
                <div className={styles.step}>
                    <h1>1</h1>
                    <span className={styles.title}>
                        Create a free <br />
                        Coinbase Smart Wallet <br />
                        (or Login with yours)
                    </span>
                    <span className={styles.subtitle}>
                        Only takes a few seconds
                    </span>
                </div>
                <div>
                    <button
                        className={`${styles.connectBttn} ${isWalletLoading ? styles.shimmer : ""}`}
                        onClick={() => connect ? connect() : null}
                        type="button"
                    >
                        Create or Connect Wallet
                    </button>
                    <button onClick={connectNewTokenWallet}>Connect NewToken Wallet</button>
                </div>
            </div>
        </div>
    );
};