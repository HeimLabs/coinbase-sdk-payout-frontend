import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { ReactNode } from "react";

export interface FormRow {
    wallet: string;
    amount: string;
}

export type TWalletContext = {
    isConnected: boolean,
    address: string | undefined,
    chain: string | undefined,
    isWalletLoading: boolean,
    walletError: Error | null,
    connect: ((options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>) | undefined
}

export type Props = {
    children?: JSX.Element | JSX.Element[] | ReactNode | ReactNode[];
}
