import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ReactNode } from "react";

export interface FormRow {
    wallet: string;
    amount: string;
}

export type TWalletContext = {
    isConnected: boolean,
    address: string | null,
    chain: string | null,
    isWalletLoading: boolean,
    walletError: Error | null,
    connect: ((options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>) | null
}

export type Props = {
    children?: JSX.Element | JSX.Element[] | ReactNode | ReactNode[];
}
