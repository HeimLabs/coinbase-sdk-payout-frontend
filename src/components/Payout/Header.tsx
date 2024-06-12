import React from "react";
import styles from "../../styles/Payout/Header.module.scss";
import { useAccount, useDisconnect } from "wagmi";
import { toast } from "react-toastify";
import { logoutIcon } from "../../assets";

export default function Header(): React.JSX.Element {
    const { address, chain } = useAccount();
    const { disconnect, isPending } = useDisconnect();

    const copyToClipboard = () => {
        try {
            navigator.clipboard.writeText(address as string);
            toast.success("Copied to clipboard!")
        } catch (err) {
            toast.error("Failed to copy!")
        }
    }

    return (
        <div className={styles.main}>
            <h1>The Batch Payouts App</h1>
            <div className={styles.walletContainer}>
                <div
                    onClick={copyToClipboard}
                    className={`${styles.address} ${isPending ? styles.shimmer : ""}`}>
                    {address?.slice(0, 5) + "..." + address?.slice(-5)}
                </div>
                <div className={styles.details}>
                    <span>Network: {chain?.name}</span>
                    <button className={styles.logoutBttn} onClick={() => { disconnect(); }}>
                        <img src={logoutIcon} alt="Logout" />
                    </button>
                </div>
            </div>
        </div>
    );
};