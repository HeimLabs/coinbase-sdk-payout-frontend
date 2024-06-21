import { useQuery } from "@tanstack/react-query";
import { tokens } from "../configs/tokens.config";
import { FormRow } from "../types";
import axios from "axios";

export const useGetWallet = () => useQuery({
    queryKey: ['walletData'],
    queryFn: async () => await axios.get(import.meta.env.VITE_APP_BACKEND_URL + '/wallet/').then((res) => res.data),
});

// const useBatchPayout = (data: FormRow[], selectedToken: typeof tokens[number]) => useQuery({
//     queryKey: ['batchPayout'],
//     quer
// })