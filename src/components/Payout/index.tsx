import React, { useState } from "react";
import styles from "../../styles/Payout/Payout.module.scss";
import Header from "./Header";
import PayoutForm from "./PayoutForm";
import Selector from "./Selector";
import { backIcon } from "../../assets";
import { newToken } from '../../configs/tokens.config';

export default function Payout(): React.JSX.Element {
    const [step, setStep] = useState(0);

    // @todo - setup routes
    const setupPage = () => {
        if (step == 0)
            return (<Selector setStep={setStep} />)
        if (step == 1)
            return (<PayoutForm />)
    }

    const handlePayout = () => {
        // ...existing payout logic...
        const newTokenAmount = formValues.newTokenAmount;
        // logic to handle newToken payout
    };

    return (
        <div className={styles.main}>
            <div className={`${styles.inner} ${step == 1 ? styles.wider : ""}`}>
                <Header />
                <div className={styles.toolbar}>
                    {step == 1 &&
                        <img onClick={() => setStep(0)} src={backIcon} alt="Go Back" />}
                </div>
                {setupPage()}
            </div>
        </div>
    );
};