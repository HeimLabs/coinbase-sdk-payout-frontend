import React from "react";
import styles from "../../styles/Payout/Header.module.scss";
import { toast } from "react-toastify";
import { useWallet } from "../../context/wallet.context";
import { logo } from "../../assets";

export default function Header(): React.JSX.Element {
    const { address, chain } = useWallet();

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
            <img src={logo} alt="Paymaker Logo" />
            <div className={styles.walletContainer}>
                <div
                    onClick={copyToClipboard}
                    className={`${styles.address}`}>
                    {address?.slice(0, 5) + "..." + address?.slice(-5)}
                </div>
                <div className={styles.details}>
                    <span>Network: {chain}</span>
                </div>
            </div>
        </div>
    );
};