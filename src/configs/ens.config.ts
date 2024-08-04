import { http } from 'viem'
import { mainnet } from 'viem/chains'
import { createEnsPublicClient } from '@ensdomains/ensjs'

export const ensClient = createEnsPublicClient({
    chain: mainnet,
    transport: http(),
});