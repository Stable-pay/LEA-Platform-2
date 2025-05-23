
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
export const CRYPTO_NEWS_FEED = [
  {
    id: "NEWS-001",
    title: "PMLA Amendment for Virtual Assets",
    category: "FIU",
    source: "FIU-IND",
    summary: "New guidelines under PMLA for virtual asset transactions and reporting requirements",
    relevantFor: ["FIU", "ED", "VASP"],
    date: new Date("2024-01-15"),
    priority: "high",
    impact: "Mandatory compliance for all VASPs by Q2 2024",
    lawReference: "PMLA Act, 2002 - Section 12AA"
  },
  {
    id: "NEWS-002",
    title: "Cross-Border Crypto Investigation Framework",
    category: "ED",
    source: "Enforcement Directorate",
    summary: "New framework for investigating international crypto transactions under FEMA",
    relevantFor: ["ED", "FIU", "I4C"],
    date: new Date("2024-01-20"),
    priority: "high",
    impact: "Enhanced powers for cross-border asset tracking",
    lawReference: "FEMA Act, 1999 - Section 37A"
  },
  {
    id: "NEWS-003",
    title: "Cyber Forensics Protocol Update",
    category: "I4C",
    source: "MHA Cyber Division",
    summary: "Updated protocol for blockchain forensics and crypto wallet analysis",
    relevantFor: ["I4C", "ED", "FIU"],
    date: new Date("2024-01-25"),
    priority: "medium",
    lawReference: "IT Act, 2000 - Section 69"
  },
  {
    id: "NEWS-004",
    title: "Tax Treatment of Crypto Assets",
    category: "IT",
    source: "CBDT",
    summary: "Clarification on taxation of different types of crypto transactions",
    relevantFor: ["IT", "FIU", "VASP"],
    date: new Date("2024-01-28"),
    priority: "high",
    lawReference: "Income Tax Act, 1961 - Section 115BBH"
  },
  {
    id: "NEWS-002",
    title: "Major Cryptocurrency Mixer Sanctioned",
    category: "enforcement",
    source: "International Task Force",
    summary: "Global enforcement action against privacy-focused mixing service used in multiple fraud cases",
    relevantFor: ["ED", "I4C", "FIU"],
    date: new Date("2024-01-20"),
    priority: "high",
    impact: "Service shutdown affecting ₹200 Cr worth transactions"
  },
  {
    id: "NEWS-003",
    title: "New AI-Powered Transaction Monitoring Guidelines",
    category: "regulation",
    source: "Reserve Bank",
    summary: "Framework for using artificial intelligence in crypto transaction surveillance",
    relevantFor: ["BANK", "VASP", "FIU"],
    date: new Date("2024-01-25"),
    priority: "medium",
    impact: "Implementation deadline: June 2024"
  },
  {
    id: "NEWS-002",
    title: "Major Cryptocurrency Mixer Sanctioned",
    category: "Enforcement",
    source: "International Task Force",
    summary: "Global enforcement action against privacy-focused mixing service",
    relevantFor: ["ED", "I4C", "FIU"],
    date: new Date("2024-01-20")
  },
  {
    id: "NEWS-003",
    title: "Cross-Border Crypto Transaction Monitoring Framework",
    category: "Compliance",
    source: "Reserve Bank",
    summary: "New guidelines for monitoring international crypto flows",
    relevantFor: ["BANK", "VASP", "FIU"],
    date: new Date("2024-01-25")
  }
];

export const DEPARTMENT_DETAILS = {
  ED: {
    name: "Enforcement Directorate",
    role: "Financial Crime Investigation",
    accessLevel: "high",
    capabilities: ["Asset Seizure", "FEMA Violations", "Money Laundering Investigation"]
  },
  FIU: {
    name: "Financial Intelligence Unit",
    role: "Financial Intelligence",
    accessLevel: "high",
    capabilities: ["STR Analysis", "Pattern Detection", "Cross-Border Transactions"]
  },
  I4C: {
    name: "Indian Cybercrime Coordination Centre",
    role: "Cybercrime Coordination",
    accessLevel: "high",
    capabilities: ["Malware Analysis", "Digital Forensics", "Cyber Intelligence"]
  },
  IT: {
    name: "Income Tax Department",
    role: "Tax Evasion Investigation",
    accessLevel: "medium",
    capabilities: ["Tax Fraud Detection", "Asset Verification", "Financial Audits"]
  },
  VASP: {
    name: "Virtual Asset Service Provider",
    role: "Crypto Exchange Compliance",
    accessLevel: "medium",
    capabilities: ["KYC/AML Compliance", "Transaction Monitoring", "Regulatory Reporting"]
  },
  BANK: {
    name: "Banking Institution",
    role: "Financial Institution",
    accessLevel: "medium",
    capabilities: ["Suspicious Activity Reporting", "Account Monitoring", "Fraud Prevention"]
  }
};

export const BLOCKCHAIN_PATTERNS = [
  {
    id: "BP-001",
    name: "Tumblers and Mixers",
    description: "Use of cryptocurrency mixing services to obscure transaction trails",
    riskLevel: "critical",
    indicators: ["Multiple input-output ratios", "Known mixer addresses", "Time-delayed outputs"]
  },
  {
    id: "BP-002",
    name: "Cross-Chain Movement",
    description: "Assets moving across multiple blockchains to evade tracking",
    riskLevel: "high",
    indicators: ["Bridge usage", "Chain-hopping", "Privacy coin conversion"]
  }
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
        estimatedLoss: 150000000,
        walletPatterns: ["Multiple jurisdictions", "High velocity", "Mixer usage"],
        accessLevel: "restricted"
      },
      {
        caseId: "ED-2024-002",
        title: "VASP Compliance Investigation",
        description: "Audit of cryptocurrency exchange compliance with FEMA regulations",
        status: "pending",
        priority: "medium",
        estimatedLoss: 75000000,
        walletPatterns: ["Regulatory non-compliance", "KYC violations"],
        accessLevel: "department_only"
      },
      {
        caseId: "ED-2024-003",
        title: "International Crypto Fraud Network",
        description: "Investigation of organized crypto fraud targeting multiple countries",
        status: "active",
        priority: "critical",
        estimatedLoss: 280000000,
        walletPatterns: ["Network clustering", "Cross-border flows"],
        accessLevel: "joint_task_force"
      }
    ]
  },
  {
    department: "FIU",
    cases: [
      {
        caseId: "FIU-2024-001",
        title: "P2P Trading Pattern Analysis",
        description: "Analysis of peer-to-peer crypto trading patterns indicating potential tax evasion",
        status: "active",
        priority: "high",
        estimatedLoss: 95000000,
        walletPatterns: ["P2P clustering", "Tax evasion indicators"],
        accessLevel: "shared_with_it"
      },
      {
        caseId: "FIU-2024-002",
        title: "Dark Market Investigation",
        description: "Tracking cryptocurrency flows linked to illegal marketplace activities",
        status: "investigating",
        priority: "critical",
        estimatedLoss: 280000000,
        walletPatterns: ["Dark market exposure", "Privacy coin conversion"],
        accessLevel: "multi_agency"
      },
      {
        caseId: "FIU-2024-003",
        title: "Suspicious Exchange Patterns",
        description: "Analysis of unusual trading patterns across multiple exchanges",
        status: "active",
        priority: "medium",
        estimatedLoss: 120000000,
        walletPatterns: ["Exchange hopping", "Wash trading"],
        accessLevel: "restricted"
      }
    ]
  },
  {
    department: "I4C",
    cases: [
      {
        caseId: "I4C-2024-001",
        title: "Crypto Mining Malware",
        description: "Investigation into widespread cryptojacking malware affecting government systems",
        status: "active",
        priority: "critical",
        estimatedLoss: 120000000,
        walletPatterns: ["Mining pool connections", "Malware signatures"],
        accessLevel: "cyber_division"
      },
      {
        caseId: "I4C-2024-002",
        title: "Ransomware Payment Tracking",
        description: "Tracking cryptocurrency payments related to ransomware attacks",
        status: "investigating",
        priority: "high",
        estimatedLoss: 180000000,
        walletPatterns: ["Ransomware wallet clusters", "Conversion patterns"],
        accessLevel: "restricted"
      },
      {
        caseId: "I4C-2024-003",
        title: "DeFi Platform Exploit",
        description: "Investigation of smart contract exploitation in DeFi platforms",
        status: "active",
        priority: "high",
        estimatedLoss: 250000000,
        walletPatterns: ["Smart contract interaction", "Flash loan patterns"],
        accessLevel: "defi_taskforce"
      }
    ]
  },
  {
    department: "IT",
    cases: [
      {
        caseId: "IT-2024-001",
        title: "Undisclosed Crypto Assets",
        description: "Investigation into undeclared cryptocurrency holdings and trading profits",
        status: "active",
        priority: "medium",
        estimatedLoss: 45000000
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
