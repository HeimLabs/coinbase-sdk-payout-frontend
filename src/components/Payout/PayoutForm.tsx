import React, { useEffect, useState } from "react";
import styles from "../../styles/Payout/PayoutForm.module.scss";
import { useTokenBalance } from "../../hooks/token.hooks";
import { addIcon } from "../../assets";
import { toast } from "react-toastify";

interface FormRow {
    wallet: string;
    amount: string;
}

export default function PayoutForm(): React.JSX.Element {
    const { tokenBalance } = useTokenBalance();

    const [step, setStep] = useState(1);
    const [rows, setRows] = useState<FormRow[]>([{ wallet: '', amount: '' }]);
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newRows = [...rows];
        newRows[index][name as keyof FormRow] = value;
        setRows(newRows);
    };

    const addRow = () => {
        setRows([...rows, { wallet: '', amount: '' }]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        try {
            e.preventDefault();

            if (step == 0) {
                setStep(1);
            }

        } catch (err) {
            toast.error("Something went wrong!")
        }
    }

    const handleCancel = (e: React.FormEvent) => {
        try {
            e.preventDefault();
            setStep(0);
        } catch (err) {
            toast.error("Something went wrong!")
        }
    }

    useEffect(() => {
        console.log("rows: ", rows);
    }, [rows])

    return (
        <div className={styles.main}>
            <div className={styles.balanceContainer}>
                <div className={styles.balance}>
                    <h2>Your Wallet Balance:</h2>
                    <span>TestToken: {tokenBalance.toLocaleString()} $TT</span>
                </div>
            </div>
            <div className={styles.formContainer}>
                {/* STEP - 0 */}
                {step == 0 &&
                    <div className={styles.header}>
                        <span>Enter Recipients & Amounts</span>
                        <button className={styles.csvBttn}>Or upload CSV file</button>
                    </div>}
                {/* STEP - 1 */}
                {step == 1 &&
                    <div className={styles.header}>
                        <span>Review & Confirm Payout Amounts</span>
                    </div>}
                {/* STEP - 2 */}
                {step == 2 &&
                    <div className={styles.header}>
                        <span>Payouts Confirmed</span>
                    </div>}
                <form className={styles.formRows} onSubmit={handleSubmit} onReset={handleCancel}>
                    {rows.map((row, index) => (
                        <div className={styles.row} key={index}>
                            <div className={styles.inputContainer}>
                                <span>Wallet Address:</span>
                                <input
                                    type="text"
                                    name="wallet"
                                    placeholder="0xsOmEAdDrEsS"
                                    value={row.wallet}
                                    required
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                            </div>
                            <div className={styles.inputContainer}>
                                <span>$TT:</span>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Amount"
                                    value={row.amount}
                                    required
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                            </div>
                        </div>
                    ))}
                    {step == 0 && <button type="button" className={`${styles.csvBttn} ${styles.addBttn}`} onClick={addRow}>
                        <img src={addIcon} alt="Add" />
                    </button>}
                    <button type="submit" className={styles.primaryBttn}>
                        {step == 0 && "Next"}
                        {step == 1 && "Confirm"}
                    </button>
                    {step == 1 && <button type="reset" className={styles.secondaryBttn}>
                        Cancel
                    </button>}
                </form>
            </div>
        </div>
    );
};