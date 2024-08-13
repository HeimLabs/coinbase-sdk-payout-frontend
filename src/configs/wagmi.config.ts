import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';

export const config = createConfig({
    chains: [import.meta.env.VITE_APP_APP_ENV == "production" ? base : baseSepolia],
    // @ts-ignore
    transports: import.meta.env.VITE_APP_APP_ENV == "production"
        ? {
            [base.id]: http(),
        }
        : {
            [baseSepolia.id]: http(),
        },
});

declare module 'wagmi' {
    interface Register {
        config: typeof config;
    }
}
