import React from "react";
import styles from "../styles/Connect.module.scss";
import { useWallet } from "../context/wallet.context";

export default function Connect(): React.JSX.Element {
    const { isWalletLoading, walletError, connect } = useWallet();

    return (
        <div className={styles.main}>
            <h1>The Batch Payouts App</h1>
            <span className={styles.subtitle}>Powered by Crypto</span>
            <button
                className={`${styles.connectBttn} ${isWalletLoading ? styles.shimmer : ""}`}
                onClick={() => connect ? connect() : null}
                type="button"
            >
                Connect Wallet
            </button>
            {walletError && <span className={styles.errorMsg}>{walletError.message}</span>}
        </div>
    );
};