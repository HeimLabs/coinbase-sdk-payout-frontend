import { useMutation, useQuery } from "@tanstack/react-query";
import { tokens } from "../configs/tokens.config";
import { FormRow } from "../types";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export const useGetWallet = () => useQuery({
    queryKey: ['walletData'],
    queryFn: async () =>
        await axios.get(import.meta.env.VITE_APP_BACKEND_URL + '/wallet/').then((res) => res.data),
});

export const useBatchPayout = (data: FormRow[], selectedToken: typeof tokens[number]) => useMutation({
    mutationFn: async () =>
        await axios.post(import.meta.env.VITE_APP_BACKEND_URL + '/wallet/transfer-assets',
            {
                token: selectedToken.address,
                data
            }
        ).then((res) => res.data),
    onError: (error: AxiosError) => toast.error(error.response?.data as string)
})