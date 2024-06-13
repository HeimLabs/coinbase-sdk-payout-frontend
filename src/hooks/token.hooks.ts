import { useAccount, useReadContract } from "wagmi";
import { erc20Abi } from "viem";
import { useWriteContracts } from "wagmi/experimental";
import { FormRow } from "../types";
import { contracts } from "../configs/contracts.config";
import { useState } from "react";
import { toast } from "react-toastify";

const useTokenBalance = () => {
    const { address } = useAccount();
    const { data, ...readData } = useReadContract({
        abi: erc20Abi,
        address: contracts.token as `0x${string}`,
        functionName: "balanceOf",
        args: [address as `0x${string}`]
    });

    const returnedData = data as bigint;
    return {
        tokenBalance: returnedData ? (returnedData / BigInt(10 ** 18)) : 0,
        ...readData
    };
};

const useBatchPayout = (data: FormRow[]) => {
    const { writeContractsAsync, ...writeData } = useWriteContracts();
    const [txHash, setTxHash] = useState<string>();

    const batchPayout = async () => {
        try {
            const contractWrites = data.map((row) => {
                return {
                    address: contracts.token as `0x${string}`,
                    abi: erc20Abi,
                    functionName: "transfer",
                    args: [row.wallet, BigInt(row.amount) * BigInt(10 ** 18)],
                }
            });

            const tx = await writeContractsAsync({ contracts: contractWrites });
            setTxHash(tx);
        } catch (err) {
            console.error(err);
            toast.error("Payout failed!");
        }
    }

    return {
        batchPayout,
        txHash,
        ...writeData
    }
}

export {
    useTokenBalance,
    useBatchPayout
}