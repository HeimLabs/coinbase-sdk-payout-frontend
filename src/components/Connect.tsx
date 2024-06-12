import React from "react";
import styles from "../styles/Connect.module.scss";
import { useConnect } from "wagmi";

export default function Connect(): React.JSX.Element {
    const { connectors, connect, error, isPending } = useConnect();

    return (
        <div className={styles.main}>
            <h1>The Batch Payouts App</h1>
            <span className={styles.subtitle}>Powered by Crypto</span>
            <button
                key={connectors[0].uid}
                className={`${styles.connectBttn} ${isPending ? styles.shimmer : ""}`}
                onClick={() => connect({ connector: connectors[0] })}
                type="button"
            >
                {connectors[0].name}
            </button>
            {error && <span className={styles.errorMsg}>{error.message}</span>}
        </div>
    );
};