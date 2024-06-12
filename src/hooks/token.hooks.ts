import { useAccount, useReadContract } from "wagmi";
import { erc20Abi } from "viem";

const useTokenBalance = () => {
    const { address } = useAccount();
    const { data, ...readData } = useReadContract({
        abi: erc20Abi,
        address: "0x5a18cdACC0275f0F4267515695540459a286E6F2",
        functionName: "balanceOf",
        args: [address as `0x${string}`]
    });

    const returnedData = data as bigint;
    return {
        tokenBalance: returnedData ? (returnedData / BigInt(10 ** 18)) : 0,
        ...readData
    };
};

export {
    useTokenBalance
}