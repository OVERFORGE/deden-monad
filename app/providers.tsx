// app/providers.tsx
// ✅ UPDATED: Monad Testnet Only Configuration

"use client";

import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { monadTestnet } from "@/lib/chains/monad"; // Import custom Monad chain

// Get Monad RPC URL from environment
const monadRpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL || 
  'https://monad-testnet.g.alchemy.com/v2/prb3bBkj1v9clt6hCTvVqcOBOCCHgLc6';

const wcProjectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      retry: 2,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  // Validation
  if (!monadRpcUrl) {
    console.error("Missing Monad RPC URL");
    return (
      <div style={{ padding: "20px", fontFamily: "Arial", color: "red" }}>
        <strong>Configuration Error:</strong> Missing Monad RPC URL. Please check
        your environment variables.
      </div>
    );
  }

  if (!wcProjectId) {
    console.error("Missing WalletConnect Project ID");
    return (
      <div style={{ padding: "20px", fontFamily: "Arial", color: "red" }}>
        <strong>Configuration Error:</strong> Missing WalletConnect Project ID.
        Get one from cloud.walletconnect.com
      </div>
    );
  }

  // Get the app URL from environment or use defaults
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
  
  const appIcon = process.env.NEXT_PUBLIC_APP_ICON || 
    'https://res.cloudinary.com/dfa0ptxxk/image/upload/v1763107951/DenDen_no_bg_x6absy.png';

  // Create config only once - MONAD TESTNET ONLY
  const [config] = React.useState(() =>
    createConfig(
      getDefaultConfig({
        appName: "Decentralized Den",
        appDescription: "Secure crypto payments for coliving stays on Monad Testnet",
        appUrl: appUrl,
        appIcon: appIcon,

        // ✅ ONLY Monad Testnet
        chains: [monadTestnet],

        // RPC transport for Monad Testnet
        transports: {
          [monadTestnet.id]: http(monadRpcUrl),
        },

        walletConnectProjectId: wcProjectId,
      })
    )
  );

  return (
    <SessionProvider refetchInterval={5 * 60}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider
            mode="dark"
            options={{
              enforceSupportedChains: true,
              embedGoogleFonts: true,
            }}
          >
            {children}
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
}