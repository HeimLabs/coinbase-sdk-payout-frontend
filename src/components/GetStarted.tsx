import React from "react";
import styles from "../styles/GetStarted.module.scss";
import { logo } from "../assets";

type GetStartedProps = {
    setStep: React.Dispatch<React.SetStateAction<number>>
}

export default function GetStarted({ setStep }: GetStartedProps): React.JSX.Element {
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
                <div className={styles.step}>
                    <h1>2</h1>
                    <span className={styles.title}>
                        Buy USDC for free <br />
                        using your credit card <br />
                        (or transfer your own)
                    </span>
                    <span className={styles.subtitle}>
                        $1 USD = $1 USDC
                    </span>
                </div>
                <div className={styles.step}>
                    <h1>3</h1>
                    <span className={styles.title}>
                        Enter recipients <br />
                        and amounts to pay <br />
                        (or upload CSV)
                    </span>
                    <span className={styles.subtitle}>
                        One click to send
                    </span>
                </div>
            </div>
            <button onClick={() => setStep(1)} type="button" className={styles.startBttn}>
                Start Now
            </button>
        </div >
    );
};