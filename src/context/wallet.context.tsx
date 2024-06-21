import { createContext, useContext, useEffect, useState } from "react";
import { useGetWallet } from "../hooks/wallet.hooks";
import { Props, TWalletContext } from "../types";

const initialState = {
    isConnected: false,
    address: null,
    chain: null,
    isWalletLoading: false,
    walletError: null,
    connect: null
}

const WalletContext = createContext<TWalletContext>(initialState);

const WalletProvider = ({ children }: Props): React.JSX.Element => {
    const { Provider } = WalletContext;
    const [isConnected, setIsConnected] = useState(false);
    const [address, setAddress] = useState<string | null>(null);
    const [chain, setChain] = useState<string | null>(null);

    const getWalletQuery = useGetWallet();

    useEffect(() => {
        const { data } = getWalletQuery;
        if (data) {
            setIsConnected(true);
            setAddress(data.address);
            setChain(data.chain);
        }
    }, [getWalletQuery]);

    return (
        <Provider value={{
            isConnected,
            address,
            chain,
            isWalletLoading: getWalletQuery.isLoading,
            walletError: getWalletQuery.error,
            connect: getWalletQuery.refetch
        }}>
            {children}
        </Provider>
    );
};

export default WalletProvider;

export const useWallet = () => useContext<TWalletContext>(WalletContext);