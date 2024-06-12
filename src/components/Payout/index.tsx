import React from "react";
import styles from "../../styles/Payout/Payout.module.scss";
import Header from "./Header";

export default function Payout(): React.JSX.Element {
    return (
        <div className={styles.main}>
            <div className={styles.inner}>
                <Header />
            </div>
        </div>
    );
};