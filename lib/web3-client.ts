// lib/web3-client.ts
// ✅ UPDATED: Monad Testnet Only Configuration

import { createPublicClient, http, type PublicClient } from 'viem';
import { monadTestnet } from './chains/monad'; // Import custom chain
import type { Chain } from 'viem/chains';

// Get RPC URL from environment variable
const getMonadRpcUrl = (): string => {
  const rpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL || 
    'https://monad-testnet.g.alchemy.com/v2/prb3bBkj1v9clt6hCTvVqcOBOCCHgLc6';
  
  console.log('[Web3Client] Using Monad RPC:', rpcUrl.substring(0, 50) + '...');
  return rpcUrl;
};

// Type for chain-specific public client
type ChainPublicClient = PublicClient<ReturnType<typeof http>, Chain>;

// Store clients by chain ID
const clients: Record<number, ChainPublicClient | null> = {};

// Initialize Monad Testnet client
const monadRpc = getMonadRpcUrl();
try {
  const monadClient = createPublicClient({
    chain: monadTestnet,
    transport: http(monadRpc, {
      timeout: 30_000, // 30 seconds
      retryCount: 3,
      retryDelay: 1000,
    }),
  });
  
  clients[monadTestnet.id] = monadClient as ChainPublicClient;
  console.log('[Web3Client] ✅ Monad Testnet client initialized');
  console.log('[Web3Client] Chain ID:', monadTestnet.id); // Should be 10143
} catch (error) {
  console.error('[Web3Client] ❌ Failed to initialize Monad Testnet client:', error);
  clients[monadTestnet.id] = null;
}

/**
 * Get public client for a specific chain
 * @param chainId - The chain ID to get client for
 * @returns PublicClient or null if not configured
 */
export function getPublicClient(chainId: number): ChainPublicClient | null {
  const client = clients[chainId];
  
  if (!client) {
    console.error(`[Web3Client] ❌ No public client configured for chain ${chainId}`);
    console.error(`[Web3Client] Available chains:`, Object.keys(clients).filter(k => clients[Number(k)] !== null));
    return null;
  }
  
  return client;
}

/**
 * Get all configured chain IDs
 * @returns Array of chain IDs that have clients configured
 */
export function getSupportedChainIds(): number[] {
  return Object.keys(clients)
    .map(Number)
    .filter(chainId => clients[chainId] !== null);
}

/**
 * Check if a chain is supported
 * @param chainId - The chain ID to check
 * @returns true if the chain has a client configured
 */
export function isChainSupported(chainId: number): boolean {
  return clients[chainId] !== null;
}

/**
 * Test connection to a chain
 * @param chainId - The chain ID to test
 * @returns Promise<boolean> - true if connection works
 */
export async function testChainConnection(chainId: number): Promise<boolean> {
  const client = getPublicClient(chainId);
  if (!client) {
    return false;
  }
  
  try {
    const blockNumber = await client.getBlockNumber();
    console.log(`[Web3Client] ✅ Chain ${chainId} connection test successful. Latest block: ${blockNumber}`);
    return true;
  } catch (error) {
    console.error(`[Web3Client] ❌ Chain ${chainId} connection test failed:`, error);
    return false;
  }
}

// Log initialization status
console.log('\n[Web3Client] Initialization Summary:');
console.log('=====================================');
Object.entries(clients).forEach(([chainId, client]) => {
  const status = client ? '✅ Ready' : '❌ Failed';
  console.log(`Chain ${chainId} (Monad Testnet): ${status}`);
});
console.log('=====================================\n');

// Export clients for direct use if needed
export { clients };
export type { ChainPublicClient };