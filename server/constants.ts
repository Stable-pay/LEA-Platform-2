
export const SUSPICIOUS_PATTERNS = [
  { patternId: "SP-001", pattern: "Structuring (Smurfing)", riskLevel: "High", patternType: "Transaction" },
  { patternId: "SP-002", pattern: "High Velocity Wallet Activity", riskLevel: "High", patternType: "Behavioral" },
  { patternId: "SP-003", pattern: "Peeling Chains", riskLevel: "High", patternType: "Transaction" },
  { patternId: "SP-004", pattern: "Use of Mixers/Tumblers", riskLevel: "High", patternType: "Privacy" },
  { patternId: "SP-005", pattern: "Rapid In-Out Transactions", riskLevel: "Medium", patternType: "Transaction" },
  { patternId: "SP-006", pattern: "Interaction with High-Risk Entities", riskLevel: "High", patternType: "Entity" },
  { patternId: "SP-007", pattern: "Circular Transactions", riskLevel: "Medium", patternType: "Transaction" },
  { patternId: "SP-008", pattern: "Exchange-Hopping", riskLevel: "Medium", patternType: "Behavioral" },
  { patternId: "SP-009", pattern: "Dormant Address Awakening", riskLevel: "Medium", patternType: "Behavioral" },
  { patternId: "SP-010", pattern: "Use of Privacy Coins", riskLevel: "High", patternType: "Privacy" },
  { patternId: "SP-011", pattern: "Cross-Chain Swaps", riskLevel: "High", patternType: "Transaction" },
  { patternId: "SP-012", pattern: "Layering via NFTs", riskLevel: "Medium", patternType: "Asset" },
  { patternId: "SP-013", pattern: "Flash Loan Attacks", riskLevel: "High", patternType: "Attack" },
  { patternId: "SP-014", pattern: "Sub-KYC Thresholds", riskLevel: "Medium", patternType: "Evasion" },
  { patternId: "SP-015", pattern: "Failed Withdrawal Pattern", riskLevel: "Medium", patternType: "Behavioral" },
  { patternId: "SP-016", pattern: "High-Risk Jurisdiction", riskLevel: "High", patternType: "Geographical" },
  { patternId: "SP-017", pattern: "Compromised Wallet Usage", riskLevel: "High", patternType: "Security" },
  { patternId: "SP-018", pattern: "Funnel Account Activity", riskLevel: "High", patternType: "Transaction" },
  { patternId: "SP-019", pattern: "Time-Pattern Transactions", riskLevel: "Medium", patternType: "Temporal" },
  { patternId: "SP-020", pattern: "DEX Wash Trading", riskLevel: "High", patternType: "Market" }
];
