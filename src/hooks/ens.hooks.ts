import { FormRow } from "../types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ensClient } from "../configs/ens.config";
import { getAddressRecord } from '@ensdomains/ensjs/public'

const useEnsLookup = (rows: FormRow[]) => {
    const [addressedRows, setAddressedRows] = useState<FormRow[]>([]);
    const [isError, setIsError] = useState(false);

    const lookupWallets = async () => {
        try {
            setIsError(false);
            const batches = rows.map((row) => getAddressRecord.batch({ name: row.wallet }));
            const lookupAddresses = await ensClient.ensBatch(...batches);
            const _addressedRows: FormRow[] = lookupAddresses.map((lookup, index) => ({
                wallet: lookup?.value ? lookup.value : rows[index].wallet,
                amount: rows[index].amount
            }));
            setAddressedRows(_addressedRows);
        } catch (err) {
            console.error("Failed to lookup: ", err);
            toast.error("Failed to lookup");
            setIsError(true);
        }
    }

    useEffect(() => {
        lookupWallets();
    }, [rows])

    return { addressedRows, isError };
}

export {
    useEnsLookup
}