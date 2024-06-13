import { useAccount, useBalance, useReadContract } from "wagmi";
import { erc20Abi } from "viem";
import { useSendCalls, useWriteContracts } from "wagmi/experimental";
import { FormRow } from "../types";
import { contracts } from "../configs/contracts.config";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { tokens } from "../configs/tokens.config";

const useTokenBalance = (selectedToken: typeof tokens[number]) => {
    const { address } = useAccount();
    const { data: nativeBalance, } = useBalance({ address });
    const { data, ...readData } = useReadContract({
        abi: erc20Abi,
        address: contracts.token as `0x${string}`,
        functionName: "balanceOf",
        args: [address as `0x${string}`]
    });

    const returnedData = data as bigint;

    useEffect(() => {
        console.log("nativeBalance: ", nativeBalance);
    }, [nativeBalance]);

    return {
        tokenBalance: (selectedToken.address == "0x0000000000000000000000000000")
            ? (nativeBalance ? (parseInt(nativeBalance.value.toString()) / (10 ** 18)) : 0)
            : (returnedData ? (parseInt(returnedData.toString()) / (10 ** 18)) : 0),
        ...readData
    };
};

const useBatchPayout = (data: FormRow[], selectedToken: typeof tokens[number]) => {
    const { writeContractsAsync, isPending: isWritePending, isSuccess: isWriteSuccess } = useWriteContracts();
    const { sendCallsAsync, isPending: isSendPending, isSuccess: isSendSuccess } = useSendCalls();
    const [txHash, setTxHash] = useState<string>();
    const [isPending, setIsPending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const batchPayout = async () => {
        try {
            var tx;

            // NATIVE
            if (selectedToken.address == "0x0000000000000000000000000000") {
                const calls = data.map((row) => {
                    return {
                        to: row.wallet as `0x${string}`,
                        value: BigInt(parseFloat(row.amount) * (10 ** 18)),
                    }
                });

                tx = await sendCallsAsync({ calls });
            }
            // ERC20
            else {
                const contractWrites = data.map((row) => {
                    return {
                        address: selectedToken.address as `0x${string}`,
                        abi: erc20Abi,
                        functionName: "transfer",
                        args: [row.wallet, BigInt(parseFloat(row.amount) * (10 ** 18))],
                    }
                });

                tx = await writeContractsAsync({ contracts: contractWrites });
            }
            console.log("Txn Hash: ", tx);
            setTxHash(tx);
        } catch (err) {
            console.error(err);
            toast.error("Payout failed!");
        }
    }

    useEffect(() => {
        setIsPending(isWritePending || isSendPending);
        setIsSuccess(isWriteSuccess || isSendSuccess);
    }, [isWritePending, isWriteSuccess, isSendPending, isSendSuccess]);

    return {
        batchPayout,
        txHash,
        isPending,
        isSuccess
    }
}

export {
    useTokenBalance,
    useBatchPayout
}