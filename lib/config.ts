// lib/config.ts - Monad Testnet Only Configuration

interface TokenConfig {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
}

interface ChainConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  blockExplorer: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  tokens: {
    [symbol: string]: TokenConfig;
  };
}

// Treasury address (update if needed for testnet)
export const treasuryAddress = "0x8895691124df317aBa77549843f257F61a7C911a";

// ✅ VERIFIED: USDC and USDT token addresses on Monad Testnet
// Source: Monad Testnet Explorer (explorer.testnet.monad.xyz)
const MONAD_TESTNET_USDC = "0xf817257fed379853cDe0fa4F97AB987181B1E5Ea"; // ✅ VERIFIED
const MONAD_TESTNET_USDT = "0x88b8E2161DEDC77EF4ab7585569D2415a1C1055D"; // ✅ VERIFIED

// Get RPC URL from environment
const monadRpcUrl = process.env.NEXT_PUBLIC_MONAD_RPC_URL || 
  'https://monad-testnet.g.alchemy.com/v2/prb3bBkj1v9clt6hCTvVqcOBOCCHgLc6';

console.log('🔧 [Config] Using Monad Testnet RPC:', monadRpcUrl.substring(0, 50) + '...');

// MONAD TESTNET CONFIGURATION
export const chainConfig: { [key: number]: ChainConfig } = {
  // Monad Testnet
  10143: { // ✅ VERIFIED from Monad Testnet explorer
    name: "Monad Testnet",
    chainId: 10143,
    rpcUrl: monadRpcUrl,
    blockExplorer: "https://testnet.monadvision.com", // ✅ VERIFIED - MonadVision Explorer
    nativeCurrency: {
      name: "Monad",
      symbol: "MON", // ✅ VERIFIED
      decimals: 18,
    },
    tokens: {
      USDC: {
        address: MONAD_TESTNET_USDC, // ✅ VERIFIED: 0xf817...E5Ea
        decimals: 6, // ✅ VERIFIED from contract
        symbol: "USDC",
        name: "USD Coin",
      },
      USDT: {
        address: MONAD_TESTNET_USDT, // ✅ VERIFIED: 0x88b8...055D
        decimals: 6, // ✅ VERIFIED from contract
        symbol: "USDT",
        name: "Tether USD",
      },
    },
  },
};

// Helper function to get supported tokens for a chain
export function getSupportedTokens(chainId: number): string[] {
  const chain = chainConfig[chainId];
  return chain ? Object.keys(chain.tokens) : [];
}

// Helper function to validate chain and token
export function validateChainAndToken(
  chainId: number,
  token: string
): boolean {
  const chain = chainConfig[chainId];
  if (!chain) return false;
  return token in chain.tokens;
}

// Get chain name by ID
export function getChainName(chainId: number): string {
  return chainConfig[chainId]?.name || "Unknown Chain";
}

// Export list of supported chain IDs
export const SUPPORTED_CHAINS = Object.keys(chainConfig).map(Number);

// Validate configuration at module load time
function validateConfiguration(): void {
  const errors: string[] = [];
  
  // Validate treasury address format
  if (!/^0x[a-fA-F0-9]{40}$/i.test(treasuryAddress)) {
    errors.push(`Invalid treasury address format: ${treasuryAddress}`);
  }
  
  // Check that we have at least one chain configured
  if (SUPPORTED_CHAINS.length === 0) {
    errors.push("No chains configured");
  }
  
  // Validate each chain configuration
  SUPPORTED_CHAINS.forEach((chainId) => {
    const chain = chainConfig[chainId];
    
    if (!chain.rpcUrl.startsWith('http')) {
      errors.push(`Invalid RPC URL for chain ${chainId}`);
    }
    
    if (Object.keys(chain.tokens).length === 0) {
      errors.push(`No tokens configured for chain ${chainId}`);
    }
    
    // Validate token addresses
    Object.entries(chain.tokens).forEach(([symbol, token]) => {
      if (!/^0x[a-fA-F0-9]{40}$/i.test(token.address)) {
        errors.push(`Invalid token address for ${symbol} on chain ${chainId}`);
      }
    });
  });
  
  if (errors.length > 0) {
    console.error('❌ Configuration validation failed:');
    errors.forEach(e => console.error(`   - ${e}`));
  } else {
    console.log(`✅ Config validated: ${SUPPORTED_CHAINS.length} chain(s), treasury: ${treasuryAddress}`);
  }
}

// Run validation on module load
validateConfiguration();