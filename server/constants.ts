
export const SUSPICIOUS_PATTERNS = [
  { patternId: "SP-001", pattern: "Structuring (Smurfing)", riskLevel: "high", patternType: "Transaction" },
  { patternId: "SP-002", pattern: "High Velocity Wallet Activity", riskLevel: "high", patternType: "Behavioral" },
  { patternId: "SP-003", pattern: "Peeling Chains", riskLevel: "high", patternType: "Transaction" },
  { patternId: "SP-004", pattern: "Use of Mixers/Tumblers", riskLevel: "high", patternType: "Privacy" },
  { patternId: "SP-005", pattern: "Rapid In-Out Transactions", riskLevel: "medium", patternType: "Transaction" },
  { patternId: "SP-006", pattern: "Interaction with High-Risk Entities", riskLevel: "high", patternType: "Entity" },
  { patternId: "SP-007", pattern: "Circular Transactions", riskLevel: "medium", patternType: "Transaction" },
  { patternId: "SP-008", pattern: "Exchange-Hopping", riskLevel: "medium", patternType: "Behavioral" },
  { patternId: "SP-009", pattern: "Dormant Address Awakening", riskLevel: "medium", patternType: "Behavioral" },
  { patternId: "SP-010", pattern: "Use of Privacy Coins", riskLevel: "high", patternType: "Privacy" },
  { patternId: "SP-011", pattern: "Cross-Chain Swaps to Obfuscate Trails", riskLevel: "high", patternType: "Transaction" },
  { patternId: "SP-012", pattern: "Layering via NFTs or Low-Liquidity Tokens", riskLevel: "medium", patternType: "Asset" },
  { patternId: "SP-013", pattern: "Flash Loan Attacks or Manipulations", riskLevel: "high", patternType: "Attack" },
  { patternId: "SP-014", pattern: "Transactions Just Below KYC Thresholds", riskLevel: "medium", patternType: "Evasion" },
  { patternId: "SP-015", pattern: "Repeated Failed Withdrawal Attempts", riskLevel: "medium", patternType: "Behavioral" },
  { patternId: "SP-016", pattern: "High-Risk Jurisdiction Exposure", riskLevel: "high", patternType: "Geographical" },
  { patternId: "SP-017", pattern: "Reuse of Compromised Wallets", riskLevel: "high", patternType: "Security" },
  { patternId: "SP-018", pattern: "Funnel Accounts (Multiple Inputs, Single Output)", riskLevel: "high", patternType: "Transaction" },
  { patternId: "SP-019", pattern: "Time-Patterned Transactions", riskLevel: "medium", patternType: "Temporal" },
  { patternId: "SP-020", pattern: "Wash Trading or Self-Trading on DEXs", riskLevel: "high", patternType: "Market" }
];
