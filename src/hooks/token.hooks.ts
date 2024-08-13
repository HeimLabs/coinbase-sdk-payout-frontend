import { useBalance, useChains, useReadContract, useSwitchChain } from "wagmi";
import { erc20Abi } from "viem";
import { useEffect } from "react";
import { tokens } from "../configs/tokens.config";
import { useWallet } from "../context/wallet.context";

const useTokenBalance = (selectedToken: typeof tokens['mainnet' | 'testnet'][number]) => {
    const [chain] = useChains();
    const { switchChain } = useSwitchChain();
    const { address } = useWallet();
    const { data: nativeBalance, } = useBalance({ address: address as `0x${string}` });
    const { data, ...readData } = useReadContract({
        abi: erc20Abi,
        address: selectedToken.address as `0x${string}`,
        functionName: "balanceOf",
        args: [address as `0x${string}`]
    });
    const { data: decimals } = useReadContract({
        abi: erc20Abi,
        address: selectedToken.address as `0x${string}`,
        functionName: "decimals",
    });
    const returnedData = data as bigint;

    // @fix - need to force wagmi to switch to configured chain
    useEffect(() => {
        switchChain({ chainId: chain.id });
    }, [chain]);

    useEffect(() => {
        console.log("returnedData: ", returnedData);
    }, [returnedData]);

    useEffect(() => {
        console.log("nativeBalance: ", nativeBalance);
    }, [nativeBalance]);

    return {
        tokenBalance: (selectedToken.address == "0x0000000000000000000000000000000000000000")
            ? (nativeBalance ? (parseInt(nativeBalance.value.toString()) / (10 ** 18)) : 0)
            : (returnedData ? (parseInt(returnedData.toString()) / (10 ** (decimals as number))) : 0),
        ...readData
    };
};

export {
    useTokenBalance
}