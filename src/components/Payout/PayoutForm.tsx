import React, { useEffect, useState } from "react";
import styles from "../../styles/Payout/PayoutForm.module.scss";
import { useBatchPayout, useTokenBalance } from "../../hooks/token.hooks";
import { addIcon, subtractIcon } from "../../assets";
import { toast } from "react-toastify";
import { FormRow } from "../../types";
import { useWaitForTransactionReceipt } from "wagmi";
import { useCallsStatus } from "wagmi/experimental";

export default function PayoutForm(): React.JSX.Element {
    const [step, setStep] = useState(1);
    const [rows, setRows] = useState<FormRow[]>([{ wallet: '', amount: '' }]);
    const [isLoading, setIsLoading] = useState(false);

    const { tokenBalance } = useTokenBalance();
    const { batchPayout, txHash, isPending, isSuccess } = useBatchPayout(rows);
    const { isFetched, isFetching } = useCallsStatus({ id: txHash as string });

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newRows = [...rows];
        newRows[index][name as keyof FormRow] = value;
        setRows(newRows);
    };

    const addRow = () => {
        if (rows.length <= 5)
            setRows([...rows, { wallet: '', amount: '' }]);
        else
            toast.error("Too many rows!");
    };

    const removeRow = () => {
        const newRows = [...rows];
        newRows.pop();
        setRows(newRows);
    }

    const handleSubmit = (e: React.FormEvent) => {
        try {
            e.preventDefault();

            if (step == 0) {
                setStep(1);
            }
            else if (step == 1) {
                batchPayout();
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
        console.log("isPending: ", isPending);
        console.log("isFetching: ", isFetching);
        if (isPending || (txHash && isFetching))
            setIsLoading(true);
        else
            setIsLoading(false);
    }, [isPending, isFetching]);

    useEffect(() => {
        console.log("isFetching: ", isFetching);
        console.log("isFetched: ", isFetched);
        console.log("isSuccess: ", isSuccess);
        if (!isFetching && isFetched && isSuccess) {
            toast.success("Payout successful!");
            setStep(2);
        }
    }, [isFetching, isFetched, isSuccess]);

    // useEffect(() => {
    //     console.log("rows: ", rows);
    // }, [rows])

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
                    <div className={styles.rowActions}>
                        {(step == 0 && rows.length <= 5) &&
                            <button type="button" className={`${styles.csvBttn} ${styles.addBttn}`} onClick={addRow}>
                                <img src={addIcon} alt="Add" />
                            </button>}
                        {(step == 0 && rows.length >= 2) &&
                            <button type="button" className={`${styles.csvBttn} ${styles.addBttn}`} onClick={removeRow}>
                                <img src={subtractIcon} alt="Subtract Icon" />
                            </button>}
                    </div>
                    {(step == 0 || step == 1) &&
                        <button type="submit" className={`${styles.primaryBttn} ${isLoading ? styles.shimmer : ""}`}>
                            {step == 0 && "Next"}
                            {step == 1 && "Confirm"}
                        </button>}
                    {(step == 1 || step == 2) &&
                        <button type="reset" className={styles.secondaryBttn}>
                            {step == 1 && "Cancel"}
                            {step == 2 && "Restart"}
                        </button>}
                </form>
            </div>
        </div>
    );
};