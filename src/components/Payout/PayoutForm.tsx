import React, { useEffect, useRef, useState } from "react";
import styles from "../../styles/Payout/PayoutForm.module.scss";
import { useTokenBalance } from "../../hooks/token.hooks";
import { addIcon, basescanIcon, coinbaseLoading, crossIcon, subtractIcon } from "../../assets";
import { toast } from "react-toastify";
import { FormRow } from "../../types";
import Papa from "papaparse";
import { tokens as _tokens, newToken } from "../../configs/tokens.config";
import { useBatchPayout } from "../../hooks/wallet.hooks";
import { useEnsLookup } from "../../hooks/ens.hooks";
import { isAddress } from "viem";

const maxRows = 5;

const tokens = _tokens[import.meta.env.VITE_APP_APP_ENV == "production" ? "mainnet" : "testnet"];

export default function PayoutForm(): React.JSX.Element {
    const [step, setStep] = useState(0);
    const [rows, setRows] = useState<FormRow[]>([{ wallet: '', amount: '' }]);
    const [total, setTotal] = useState(0);
    const [file, setFile] = useState<File>();
    const [selectedToken, setSelectedToken] = useState(tokens[0]);
    const [newTokenAmount, setNewTokenAmount] = useState<number>(0);

    const uploadCsvRef = useRef<HTMLInputElement>(null);

    const { addressedRows, isError: isEnsError } = useEnsLookup(rows);

    const { tokenBalance } = useTokenBalance(selectedToken);
    const { mutate: batchPayout, data: batchPayoutData, isPending, isSuccess, reset } = useBatchPayout(addressedRows, selectedToken);


    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newRows = [...rows];
        newRows[index][name as keyof FormRow] = value;
        setRows(newRows);
    };

    const handleNewTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTokenAmount(Number(e.target.value));
    };

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
            if (step == 1) {
                setStep(0);
            }
            else if (step == 2) {
                setStep(0);
                reset();
                setRows([{ wallet: '', amount: '' }]);
            }
        } catch (err) {
            toast.error("Something went wrong!")
        }
    }

    const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
            setFile(e.target.files[0]);
    }

    const handleCsvDownload = () => {
        try {
            const csvString = Papa.unparse(rows, {
                header: true,
            });
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'data.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            console.error("Failed to download: ", err);
            toast.error("Failed to download CSV!");
        }
    }

    const handleTokenSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedToken(tokens[Number(e.target.value)]);
    }

    const addRow = () => {
        if (rows.length <= maxRows)
            setRows([...rows, { wallet: '', amount: '' }]);
        else
            toast.error("Too many rows!");
    };

    const removeRow = () => {
        const newRows = [...rows];
        newRows.pop();
        setRows(newRows);
    }

    // Parse and set CSV
    useEffect(() => {
        if (file)
            Papa.parse(file, {
                header: false,
                skipEmptyLines: true,
                complete: (results) => {
                    const parsedRows = results.data.map((row: any) => ({
                        wallet: row[0],
                        amount: row[1],
                    })).slice(0, maxRows);
                    setRows(parsedRows);
                },
            });
    }, [file])

    // Calculate total amount when row is updated
    useEffect(() => {
        const _total = rows.reduce((sum, row) => sum + parseFloat(row.amount || '0'), 0);
        setTotal(_total);
    }, [rows])

    // Track payout transaction
    useEffect(() => {
        console.log("data: ", batchPayoutData);
        if (!isPending && isSuccess) {
            toast.success("Payout successful!");
            setStep(2);
        }
    }, [isPending, isSuccess]);

    return (
        <div className={styles.main}>
            <div className={styles.balanceContainer}>
                <div className={styles.balance}>
                    <h2>Your Wallet Balance:</h2>
                    <span>
                        <select name="token" id="token" onChange={handleTokenSelection} disabled={step != 0}>
                            {tokens.map((token, index) => (
                                <option value={index}>{token.name}</option>
                            ))}
                        </select>
                        : {tokenBalance.toLocaleString()} {selectedToken.symbol}
                    </span>
                </div>
            </div>
            <div className={styles.formContainer}>
                {/* STEP - 0 */}
                {step == 0 &&
                    <div className={styles.header}>
                        <span>Enter Recipients & Amounts</span>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleCsvUpload}
                            className={styles.csvBttn}
                            style={{ display: 'none' }}
                            ref={uploadCsvRef}
                        />
                        <button className={styles.csvBttn} onClick={() => {
                            uploadCsvRef.current?.click();
                        }}>
                            {file ? file.name : "Or upload CSV file"}
                        </button>
                    </div>}
                {/* STEP - 1 */}
                {step == 1 &&
                    <div className={styles.header}>
                        <h2>Review & Confirm Payout Amounts</h2>
                    </div>}
                {/* STEP - 2 */}
                {step == 2 &&
                    <div className={styles.header}>
                        <h2>Payouts Confirmed</h2>
                    </div>}
                <form className={styles.formRows} onSubmit={handleSubmit} onReset={handleCancel}>
                    {rows.map((row, index) => (
                        <div className={styles.row} key={index}>
                            {/* WALLET ADDRESS */}
                            {step == 0 && <div className={styles.inputContainer}>
                                <span className={styles.rowHeader}>Wallet Address <span>(ENS/0xAddress)</span> :</span>
                                <input
                                    type="text"
                                    name="wallet"
                                    placeholder="0xsOmEAdDrEsS"
                                    value={row.wallet}
                                    required
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                            </div>}
                            {(step == 1 || step == 2) &&
                                <div
                                    className={styles.inputContainer + " " + styles.explorer}
                                    style={batchPayoutData?.transferStatus[index] === "failed" ? { "color": "red" } : {}}
                                >
                                    {step === 2 && batchPayoutData?.transferStatus
                                        ? (batchPayoutData.transferStatus[index] === "failed"
                                            ? (<img src={crossIcon} alt="failed" />)
                                            : (<a href={batchPayoutData.transferStatus[index]} target="_blank" rel="noopener noreferrer">
                                                <img src={basescanIcon} alt="basescan" />
                                            </a>))
                                        : null}
                                    {(step == 1 || step == 2) &&
                                        <div className={`${styles.inputContainer} ${!isAddress(addressedRows[index].wallet) ? styles.errorMsg : ""}`}>
                                            {isAddress(addressedRows[index].wallet)
                                                ? addressedRows[index].wallet?.slice(0, 7) + "..." + addressedRows[index].wallet?.slice(-7)
                                                : addressedRows[index].wallet?.slice(0, 7) + "... | Invalid ENS/Address"}
                                        </div>}
                                </div>}
                            {/* AMOUNT */}
                            {step == 0 && <div className={styles.inputContainer}>
                                <span className={styles.rowHeader}>{selectedToken.symbol}:</span>
                                <input
                                    type="number"
                                    name="amount"
                                    placeholder="Amount"
                                    value={row.amount}
                                    required
                                    onChange={(e) => handleInputChange(index, e)}
                                />
                            </div>}
                            {(step == 1 || step == 2) && <div className={styles.inputContainer}>
                                <span
                                    className={`${styles.amounts} ${step == 1 ? styles.confirmed : styles.success}`}
                                    style={batchPayoutData?.transferStatus[index] === "failed" ? { "color": "red" } : {}}
                                >
                                    {row.amount} {selectedToken.symbol}
                                </span>
                            </div>}
                        </div>
                    ))}
                    {(step == 1 || step == 2) &&
                        <div className={styles.row}>
                            <div className={styles.inputContainer}>
                                <h2>Total Payments</h2>
                            </div>
                            <div className={styles.inputContainer}>
                                <h2 className={`${styles.amounts} ${step == 1 ? styles.confirmed : styles.success}`}>{total.toLocaleString()} {selectedToken.symbol}</h2>
                            </div>
                        </div>
                    }
                    <div className={styles.rowActions}>
                        {(step == 0 && rows.length < maxRows) &&
                            <button type="button" className={`${styles.csvBttn} ${styles.addBttn}`} onClick={addRow}>
                                <img src={addIcon} alt="Add" />
                            </button>}
                        {(step == 0 && rows.length >= 2) &&
                            <button type="button" className={`${styles.csvBttn} ${styles.addBttn}`} onClick={removeRow}>
                                <img src={subtractIcon} alt="Subtract Icon" />
                            </button>}
                    </div>
                    {(step == 0 || step == 1) &&
                        <button type="submit" disabled={isEnsError || isPending} className={`${styles.primaryBttn}`}>
                            {isPending && <img src={coinbaseLoading} alt="loading" />}
                            {(step == 0 && !isPending) && "Next"}
                            {(step == 1 && !isPending) && "Confirm"}
                        </button>}
                    {isEnsError && <span className={styles.errorMsg}>ENS Lookup Failed</span>}
                    {step == 2 &&
                        <button className={styles.csvBttn} onClick={handleCsvDownload}>
                            Download CSV
                        </button>}
                    {(step == 1 || step == 2) &&
                        <button type="reset" className={styles.secondaryBttn}>
                            {step == 1 && "Cancel"}
                            {step == 2 && "Restart"}
                        </button>}
                    <div className={styles.newTokenContainer}>
                        <label htmlFor="newTokenAmount">NewToken Amount</label>
                        <input
                            type="number"
                            id="newTokenAmount"
                            name="newTokenAmount"
                            value={newTokenAmount}
                            onChange={handleNewTokenChange}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};