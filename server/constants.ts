
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
export const DEPARTMENT_CASE_EXAMPLES = [
  {
    department: "ED",
    cases: [
      {
        caseId: "ED-2024-001",
        title: "Cross-Border Crypto Money Laundering",
        description: "Investigation into large-scale cryptocurrency transactions between domestic and international exchanges",
        status: "active",
        priority: "high",
        estimatedLoss: 150000000
      },
      {
        caseId: "ED-2024-002",
        title: "VASP Compliance Investigation",
        description: "Audit of cryptocurrency exchange compliance with FEMA regulations",
        status: "pending",
        priority: "medium",
        estimatedLoss: 75000000
      }
    ]
  },
  {
    department: "FIU",
    cases: [
      {
        caseId: "FIU-2024-001",
        title: "Suspicious Pattern Detection in P2P Trading",
        description: "Analysis of peer-to-peer crypto trading patterns indicating potential tax evasion",
        status: "active",
        priority: "high",
        estimatedLoss: 95000000
      },
      {
        caseId: "FIU-2024-002",
        title: "Dark Web Marketplace Investigation",
        description: "Tracking cryptocurrency flows linked to illegal marketplace activities",
        status: "investigating",
        priority: "critical",
        estimatedLoss: 280000000
      }
    ]
  },
  {
    department: "I4C",
    cases: [
      {
        caseId: "I4C-2024-001",
        title: "Crypto Mining Malware Campaign",
        description: "Investigation into widespread cryptojacking malware affecting government systems",
        status: "active",
        priority: "critical",
        estimatedLoss: 120000000
      },
      {
        caseId: "I4C-2024-002",
        title: "Ransomware Payment Tracking",
        description: "Tracking cryptocurrency payments related to ransomware attacks",
        status: "investigating",
        priority: "high",
        estimatedLoss: 180000000
      }
    ]
  },
  {
    department: "IT",
    cases: [
      {
        caseId: "IT-2024-001",
        title: "Undisclosed Crypto Asset Investigation",
        description: "Investigation into undeclared cryptocurrency holdings and trading profits",
        status: "active",
        priority: "medium",
        estimatedLoss: 45000000
      },
      {
        caseId: "IT-2024-002",
        title: "Crypto Trading Tax Evasion",
        description: "Analysis of suspected tax evasion through cryptocurrency trading",
        status: "pending",
        priority: "high",
        estimatedLoss: 85000000
      }
    ]
  }
];

export const RISK_LEVELS = ["critical", "high", "medium", "low", "safe"];

export const INVESTIGATION_STATUSES = ["active", "investigating", "pending", "resolved"];

export const TRANSACTION_TYPES = ["transfer", "exchange", "mixer", "withdrawal", "deposit"];
