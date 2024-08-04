import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export const useCreateOnrampLink = (address: string | undefined) => {
    const [onrampLink, setOnrampLink] = useState<string | undefined>();
    const { mutate: createOnrampLink, isPending } = useMutation({
        mutationFn: async () =>
            await axios.post(import.meta.env.VITE_APP_BACKEND_URL + '/onramp/create-token', { address })
                .then((res) => {
                    const { token } = res.data;
                    const _onrampLink = `https://pay.coinbase.com/buy/select-asset?sessionToken=${token}`;
                    setOnrampLink(_onrampLink)
                }),
        onError: (error: AxiosError) => toast.error(error.response?.data as string)
    });

    return { createOnrampLink, isPending, onrampLink }
}