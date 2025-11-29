// lib/chains/monad.ts
// ✅ VERIFIED: Custom chain definition for Monad Testnet

import { defineChain } from 'viem';

// ✅ CONFIRMED: Values verified from Monad Testnet explorer
export const monadTestnet = defineChain({
  id: 10143, // ✅ CONFIRMED from Monad Testnet explorer
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Monad',
    symbol: 'MON', // ✅ CONFIRMED from explorer
  },
  rpcUrls: {
    default: {
      http: ['https://monad-testnet.g.alchemy.com/v2/prb3bBkj1v9clt6hCTvVqcOBOCCHgLc6'],
    },
    public: {
      http: ['https://monad-testnet.g.alchemy.com/v2/prb3bBkj1v9clt6hCTvVqcOBOCCHgLc6'],
    },
  },
  blockExplorers: {
    default: {
      name: 'MonadVision Explorer',
      url: 'https://testnet.monadvision.com', // ✅ Monad Testnet Explorer
    },
  },
  testnet: true,
});