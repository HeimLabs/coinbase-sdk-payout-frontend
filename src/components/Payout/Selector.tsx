import React, { useEffect, useState } from "react";
import styles from "../../styles/Payout/Selector.module.scss";
import { moneyTransferIcon, sendMoneyIcon, loading } from "../../assets";
import { useAccount } from "wagmi";
import QRCode from 'qrcode.react';
import { useCreateOnrampLink } from "../../hooks/onramp.hooks";

type SelectorProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function Selector({ setStep }: SelectorProps): React.JSX.Element {
    const { address } = useAccount();
    const { createOnrampLink, onrampLink, isPending } = useCreateOnrampLink(address);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (onrampLink)
            window.open(onrampLink, '_blank');
    }, [onrampLink])

    return (
        <div className={styles.main}>
            <div className={styles.optionContainer}>
                <div className={`${styles.option} ${isPending ? styles.disabled : ""}`} onClick={() => createOnrampLink()}>
                    {!isPending
                        ? <img src={moneyTransferIcon} alt="On Ramp" />
                        : <img src={loading} alt="Loading" />
                    }
                    <span className={styles.title}>Buy USDC</span>
                    <span className={styles.subtitle}>$1USD=$1USDC</span>
                </div>
                <div className={styles.option} onClick={() => setIsModalOpen(true)}>
                    <QRCode size={80} value={`ethereum:${address}@8453?token=USDC`} />
                    <span className={styles.title}>Receive USDC</span>
                    <span className={styles.subtitle}>100% Free</span>
                </div>
            </div>
            <div className={styles.optionContainer}>
                <div className={styles.option} onClick={() => setStep(1)}>
                    <img src={sendMoneyIcon} alt="Send Payments" />
                    <span className={styles.title}>Make Payments</span>
                    <span className={styles.subtitle}>Upload CSV</span>
                </div>
            </div>
            {/* QR MODAL */}
            <div
                className={`${styles.qrModal} ${isModalOpen ? styles.isOpen : ""}`}
                onClick={() => setIsModalOpen(false)}>
                <div className={styles.innerModal}>
                    <QRCode preserveAspectRatio="1" className={styles.qr} value={`ethereum:${address}@8453?token=USDC`} />
                    Scan QR code if sending funds from another wallet
                </div>
            </div>
        </div >
    );
};