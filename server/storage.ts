import {
  users, type User, type InsertUser,
  cases, type Case, type InsertCase,
  wallets, type Wallet, type InsertWallet,
  transactions, type Transaction, type InsertTransaction,
  suspiciousPatterns, type SuspiciousPattern, type InsertSuspiciousPattern,
  strReports, type StrReport, type InsertStrReport,
  caseTimeline, type CaseTimeline, type InsertCaseTimeline,
  stateFraudStats, type StateFraudStat, type InsertStateFraudStat,
  blockchainNodes, type BlockchainNode, type InsertBlockchainNode,
  blockchainTransactions, type BlockchainTransaction, type InsertBlockchainTransaction,
  kycInformation, type KycInformation, type InsertKycInformation,
  courtExports, type CourtExport, type InsertCourtExport
} from "@shared/schema";

// Interface for storage operations

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Case operations
  getCase(id: number): Promise<Case | undefined>;
  getCaseByReferenceId(caseId: string): Promise<Case | undefined>;
  getCases(limit?: number, offset?: number): Promise<Case[]>;
  getCasesByStatus(status: string): Promise<Case[]>;
  getCasesByPriority(priority: string): Promise<Case[]>;
  createCase(caseData: InsertCase): Promise<Case>;
  updateCase(id: number, caseData: Partial<InsertCase>): Promise<Case | undefined>;
  
  // Wallet operations
  getWallet(id: number): Promise<Wallet | undefined>;
  getWalletByAddress(address: string): Promise<Wallet | undefined>;
  getWallets(limit?: number, offset?: number): Promise<Wallet[]>;
  getWalletsByRiskLevel(riskLevel: string): Promise<Wallet[]>;
  createWallet(wallet: InsertWallet): Promise<Wallet>;
  updateWallet(id: number, wallet: Partial<InsertWallet>): Promise<Wallet | undefined>;
  
  // Transaction operations
  getTransaction(id: number): Promise<Transaction | undefined>;
  getTransactionsByWallet(walletAddress: string): Promise<Transaction[]>;
  getTransactionsByCase(caseId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Suspicious Pattern operations
  getSuspiciousPattern(id: number): Promise<SuspiciousPattern | undefined>;
  getSuspiciousPatternByReferenceId(patternId: string): Promise<SuspiciousPattern | undefined>;
  getSuspiciousPatterns(limit?: number, offset?: number): Promise<SuspiciousPattern[]>;
  getSuspiciousPatternsByRiskLevel(riskLevel: string): Promise<SuspiciousPattern[]>;
  createSuspiciousPattern(pattern: InsertSuspiciousPattern): Promise<SuspiciousPattern>;
  
  // STR Report operations
  getStrReport(id: number): Promise<StrReport | undefined>;
  getStrReportByReferenceId(strId: string): Promise<StrReport | undefined>;
  getStrReports(limit?: number, offset?: number): Promise<StrReport[]>;
  getStrReportsByStatus(status: string): Promise<StrReport[]>;
  createStrReport(report: InsertStrReport): Promise<StrReport>;
  updateStrReport(id: number, report: Partial<InsertStrReport>): Promise<StrReport | undefined>;
  
  // Case Timeline operations
  getCaseTimelineEvents(caseId: number): Promise<CaseTimeline[]>;
  createCaseTimelineEvent(event: InsertCaseTimeline): Promise<CaseTimeline>;
  
  // State Fraud Stats operations
  getStateFraudStats(): Promise<StateFraudStat[]>;
  getStateFraudStatByState(state: string): Promise<StateFraudStat | undefined>;
  updateStateFraudStat(id: number, stat: Partial<InsertStateFraudStat>): Promise<StateFraudStat | undefined>;
  createStateFraudStat(stat: InsertStateFraudStat): Promise<StateFraudStat>;
  
  // Blockchain operations
  createBlockchainTransaction(transaction: InsertBlockchainTransaction): Promise<BlockchainTransaction>;
  getBlockchainTransactionsByEntity(entityType: string, entityId: string): Promise<BlockchainTransaction[]>;
  createBlockchainNode(node: InsertBlockchainNode): Promise<BlockchainNode>;
  getBlockchainNodesByType(type: string): Promise<BlockchainNode[]>;
  createKycInformation(kyc: InsertKycInformation): Promise<KycInformation>;
  createCourtExport(export_data: InsertCourtExport): Promise<CourtExport>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private cases: Map<number, Case>;
  private wallets: Map<number, Wallet>;
  private transactions: Map<number, Transaction>;
  private suspiciousPatterns: Map<number, SuspiciousPattern>;
  private strReports: Map<number, StrReport>;
  private caseTimelines: Map<number, CaseTimeline>;
  private stateFraudStats: Map<number, StateFraudStat>;
  private blockchainNodes: Map<number, BlockchainNode>;
  private blockchainTransactions: Map<string, BlockchainTransaction>;
  private kycInformation: Map<number, KycInformation>;
  private courtExports: Map<number, CourtExport>;
  
  // Track the current ID for each entity
  private userId = 1;
  private caseId = 1;
  private walletId = 1;
  private transactionId = 1;
  private suspiciousPatternId = 1;
  private strReportId = 1;
  private caseTimelineId = 1;
  private stateFraudStatId = 1;
  private blockchainNodeId = 1;
  private kycInformationId = 1;
  private courtExportId = 1;
  
  constructor() {
    this.users = new Map();
    this.cases = new Map();
    this.wallets = new Map();
    this.transactions = new Map();
    this.suspiciousPatterns = new Map();
    this.strReports = new Map();
    this.caseTimelines = new Map();
    this.stateFraudStats = new Map();
    this.blockchainNodes = new Map();
    this.blockchainTransactions = new Map();
    this.kycInformation = new Map();
    this.courtExports = new Map();
    
    // Initialize with some sample data for development
    this.initializeData();
  }
  
  private initializeData() {
    // Create a default admin user
    this.createUser({
      username: "admin",
      password: "admin", // In a real app, this would be hashed
      role: "law_enforcement",
      fullName: "John Doe",
      organization: "Delhi Police"
    });
    
    // Initialize state fraud stats for major Indian states
    const states = [
      { state: "Maharashtra", caseCount: 78, estimatedLoss: 48000000, riskLevel: "critical" },
      { state: "Karnataka", caseCount: 42, estimatedLoss: 32000000, riskLevel: "high" },
      { state: "Delhi", caseCount: 38, estimatedLoss: 29000000, riskLevel: "high" },
      { state: "Gujarat", caseCount: 25, estimatedLoss: 18000000, riskLevel: "medium" },
      { state: "Tamil Nadu", caseCount: 22, estimatedLoss: 15000000, riskLevel: "medium" }
    ];
    
    states.forEach(state => {
      this.createStateFraudStat({
        state: state.state,
        caseCount: state.caseCount,
        estimatedLoss: state.estimatedLoss,
        riskLevel: state.riskLevel,
        dateRecorded: new Date()
      });
    });
    
    // Initialize blockchain nodes for each stakeholder
    const nodes = [
      { nodeType: "LEA", nodeId: "LEA_NODE_001", name: "Delhi Police Node", organization: "Delhi Police", ipAddress: "10.0.1.1", port: 7051, status: "active" },
      { nodeType: "LEA", nodeId: "LEA_NODE_002", name: "Mumbai Police Node", organization: "Mumbai Police", ipAddress: "10.0.1.2", port: 7051, status: "active" },
      { nodeType: "FIU", nodeId: "FIU_NODE_001", name: "FIU Central Node", organization: "Financial Intelligence Unit", ipAddress: "10.0.2.1", port: 7052, status: "active" },
      { nodeType: "IND", nodeId: "IND_NODE_001", name: "Indian Nodal Department", organization: "Ministry of Finance", ipAddress: "10.0.3.1", port: 7053, status: "active" },
      { nodeType: "I4C", nodeId: "I4C_NODE_001", name: "Cyber Crime Coordination Centre", organization: "I4C", ipAddress: "10.0.4.1", port: 7054, status: "active" }
    ];
    
    nodes.forEach(node => {
      this.createBlockchainNode({
        nodeId: node.nodeId,
        nodeType: node.nodeType,
        name: node.name,
        organization: node.organization,
        ipAddress: node.ipAddress,
        port: node.port,
        status: node.status,
        lastSyncTimestamp: new Date()
      });
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id, createdAt: new Date() };
    this.users.set(id, user);
    return user;
  }
  
  // Case operations
  async getCase(id: number): Promise<Case | undefined> {
    return this.cases.get(id);
  }
  
  async getCaseByReferenceId(caseId: string): Promise<Case | undefined> {
    return Array.from(this.cases.values()).find(
      (c) => c.caseId === caseId
    );
  }
  
  async getCases(limit = 100, offset = 0): Promise<Case[]> {
    return Array.from(this.cases.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }
  
  async getCasesByStatus(status: string): Promise<Case[]> {
    return Array.from(this.cases.values()).filter(
      (c) => c.status === status
    );
  }
  
  async getCasesByPriority(priority: string): Promise<Case[]> {
    return Array.from(this.cases.values()).filter(
      (c) => c.priority === priority
    );
  }
  
  async createCase(caseData: InsertCase): Promise<Case> {
    const id = this.caseId++;
    const now = new Date();
    const newCase: Case = { 
      ...caseData, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.cases.set(id, newCase);
    return newCase;
  }
  
  async updateCase(id: number, caseData: Partial<InsertCase>): Promise<Case | undefined> {
    const existingCase = this.cases.get(id);
    if (!existingCase) return undefined;
    
    const updatedCase: Case = { 
      ...existingCase, 
      ...caseData, 
      updatedAt: new Date() 
    };
    this.cases.set(id, updatedCase);
    return updatedCase;
  }
  
  // Wallet operations
  async getWallet(id: number): Promise<Wallet | undefined> {
    return this.wallets.get(id);
  }
  
  async getWalletByAddress(address: string): Promise<Wallet | undefined> {
    return Array.from(this.wallets.values()).find(
      (w) => w.address === address
    );
  }
  
  async getWallets(limit = 100, offset = 0): Promise<Wallet[]> {
    return Array.from(this.wallets.values())
      .sort((a, b) => (b.riskScore || 0) - (a.riskScore || 0))
      .slice(offset, offset + limit);
  }
  
  async getWalletsByRiskLevel(riskLevel: string): Promise<Wallet[]> {
    return Array.from(this.wallets.values()).filter(
      (w) => w.riskLevel === riskLevel
    );
  }
  
  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const id = this.walletId++;
    const now = new Date();
    const newWallet: Wallet = { 
      ...wallet, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.wallets.set(id, newWallet);
    return newWallet;
  }
  
  async updateWallet(id: number, wallet: Partial<InsertWallet>): Promise<Wallet | undefined> {
    const existingWallet = this.wallets.get(id);
    if (!existingWallet) return undefined;
    
    const updatedWallet: Wallet = { 
      ...existingWallet, 
      ...wallet, 
      updatedAt: new Date() 
    };
    this.wallets.set(id, updatedWallet);
    return updatedWallet;
  }
  
  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }
  
  async getTransactionsByWallet(walletAddress: string): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (t) => t.fromWallet === walletAddress || t.toWallet === walletAddress
    );
  }
  
  async getTransactionsByCase(caseId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      (t) => t.caseId === caseId
    );
  }
  
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionId++;
    const newTransaction: Transaction = { 
      ...transaction, 
      id, 
      timestamp: transaction.timestamp || new Date() 
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }
  
  // Suspicious Pattern operations
  async getSuspiciousPattern(id: number): Promise<SuspiciousPattern | undefined> {
    return this.suspiciousPatterns.get(id);
  }
  
  async getSuspiciousPatternByReferenceId(patternId: string): Promise<SuspiciousPattern | undefined> {
    return Array.from(this.suspiciousPatterns.values()).find(
      (p) => p.patternId === patternId
    );
  }
  
  async getSuspiciousPatterns(limit = 100, offset = 0): Promise<SuspiciousPattern[]> {
    return Array.from(this.suspiciousPatterns.values())
      .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
      .slice(offset, offset + limit);
  }
  
  async getSuspiciousPatternsByRiskLevel(riskLevel: string): Promise<SuspiciousPattern[]> {
    return Array.from(this.suspiciousPatterns.values()).filter(
      (p) => p.riskLevel === riskLevel
    );
  }
  
  async createSuspiciousPattern(pattern: InsertSuspiciousPattern): Promise<SuspiciousPattern> {
    const id = this.suspiciousPatternId++;
    const newPattern: SuspiciousPattern = { 
      ...pattern, 
      id, 
      detectedAt: pattern.detectedAt || new Date(),
      createdAt: new Date() 
    };
    this.suspiciousPatterns.set(id, newPattern);
    return newPattern;
  }
  
  // STR Report operations
  async getStrReport(id: number): Promise<StrReport | undefined> {
    return this.strReports.get(id);
  }
  
  async getStrReportByReferenceId(strId: string): Promise<StrReport | undefined> {
    return Array.from(this.strReports.values()).find(
      (s) => s.strId === strId
    );
  }
  
  async getStrReports(limit = 100, offset = 0): Promise<StrReport[]> {
    return Array.from(this.strReports.values())
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
      .slice(offset, offset + limit);
  }
  
  async getStrReportsByStatus(status: string): Promise<StrReport[]> {
    return Array.from(this.strReports.values()).filter(
      (s) => s.status === status
    );
  }
  
  async createStrReport(report: InsertStrReport): Promise<StrReport> {
    const id = this.strReportId++;
    const newReport: StrReport = { 
      ...report, 
      id, 
      generatedAt: new Date(),
      submittedAt: report.status === 'submitted' ? new Date() : null
    };
    this.strReports.set(id, newReport);
    return newReport;
  }
  
  async updateStrReport(id: number, report: Partial<InsertStrReport>): Promise<StrReport | undefined> {
    const existingReport = this.strReports.get(id);
    if (!existingReport) return undefined;
    
    // Update submittedAt if status is changing to submitted
    const submittedAt = report.status === 'submitted' && existingReport.status !== 'submitted' 
      ? new Date() 
      : existingReport.submittedAt;
    
    const updatedReport: StrReport = { 
      ...existingReport, 
      ...report,
      submittedAt 
    };
    this.strReports.set(id, updatedReport);
    return updatedReport;
  }
  
  // Case Timeline operations
  async getCaseTimelineEvents(caseId: number): Promise<CaseTimeline[]> {
    return Array.from(this.caseTimelines.values())
      .filter((t) => t.caseId === caseId)
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }
  
  async createCaseTimelineEvent(event: InsertCaseTimeline): Promise<CaseTimeline> {
    const id = this.caseTimelineId++;
    const newEvent: CaseTimeline = { 
      ...event, 
      id, 
      date: event.date || new Date()
    };
    this.caseTimelines.set(id, newEvent);
    return newEvent;
  }
  
  // State Fraud Stats operations
  async getStateFraudStats(): Promise<StateFraudStat[]> {
    return Array.from(this.stateFraudStats.values())
      .sort((a, b) => b.caseCount - a.caseCount);
  }
  
  async getStateFraudStatByState(state: string): Promise<StateFraudStat | undefined> {
    return Array.from(this.stateFraudStats.values()).find(
      (s) => s.state === state
    );
  }
  
  async updateStateFraudStat(id: number, stat: Partial<InsertStateFraudStat>): Promise<StateFraudStat | undefined> {
    const existingStat = this.stateFraudStats.get(id);
    if (!existingStat) return undefined;
    
    const updatedStat: StateFraudStat = { 
      ...existingStat, 
      ...stat, 
      dateRecorded: new Date() 
    };
    this.stateFraudStats.set(id, updatedStat);
    return updatedStat;
  }
  
  async createStateFraudStat(stat: InsertStateFraudStat): Promise<StateFraudStat> {
    const id = this.stateFraudStatId++;
    const newStat: StateFraudStat = { 
      ...stat, 
      id, 
      dateRecorded: stat.dateRecorded || new Date() 
    };
    this.stateFraudStats.set(id, newStat);
    return newStat;
  }
  
  // Blockchain operations
  async createBlockchainTransaction(transaction: InsertBlockchainTransaction): Promise<BlockchainTransaction> {
    // Generate a unique transaction hash for blockchain transactions
    const txHash = `bct_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    const newTransaction: BlockchainTransaction = {
      ...transaction,
      txHash,
      timestamp: transaction.timestamp || new Date(),
      status: transaction.status || 'pending',
      metadata: transaction.metadata || {},
      entityId: transaction.entityId || '',
      entityType: transaction.entityType || '',
      stakeholderId: transaction.stakeholderId || null,
      stakeholderType: transaction.stakeholderType || null
    };
    
    this.blockchainTransactions.set(txHash, newTransaction);
    return newTransaction;
  }
  
  async getBlockchainTransactionsByEntity(entityType: string, entityId: string): Promise<BlockchainTransaction[]> {
    return Array.from(this.blockchainTransactions.values())
      .filter(tx => tx.entityType === entityType && tx.entityId === entityId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  async createBlockchainNode(node: InsertBlockchainNode): Promise<BlockchainNode> {
    const id = this.blockchainNodeId++;
    const newNode: BlockchainNode = {
      ...node,
      id,
      status: node.status || 'active',
      lastSyncTimestamp: node.lastSyncTimestamp || new Date(),
      createdAt: new Date()
    };
    
    this.blockchainNodes.set(id, newNode);
    return newNode;
  }
  
  async getBlockchainNodesByType(type: string): Promise<BlockchainNode[]> {
    return Array.from(this.blockchainNodes.values())
      .filter(node => node.nodeType === type)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async createKycInformation(kyc: InsertKycInformation): Promise<KycInformation> {
    const id = this.kycInformationId++;
    const newKyc: KycInformation = {
      ...kyc,
      id,
      createdAt: new Date(),
      lastVerifiedAt: kyc.lastVerifiedAt || new Date(),
      verificationStatus: kyc.verificationStatus || 'pending'
    };
    
    this.kycInformation.set(id, newKyc);
    return newKyc;
  }
  
  async createCourtExport(exportData: InsertCourtExport): Promise<CourtExport> {
    const id = this.courtExportId++;
    const newExport: CourtExport = {
      ...exportData,
      id,
      exportedAt: new Date(),
      status: exportData.status || 'pending',
      caseId: exportData.caseId || null,
      exportedBy: exportData.exportedBy || null,
      documentHash: exportData.documentHash || null,
      format: exportData.format || 'pdf'
    };
    
    this.courtExports.set(id, newExport);
    return newExport;
  }
}

// Change to DatabaseStorage for production
import { db } from "./db";
import { eq, and, desc, asc, or, like } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Case operations
  async getCase(id: number): Promise<Case | undefined> {
    const [foundCase] = await db.select().from(cases).where(eq(cases.id, id));
    return foundCase || undefined;
  }

  async getCaseByReferenceId(caseId: string): Promise<Case | undefined> {
    const [foundCase] = await db.select().from(cases).where(eq(cases.caseId, caseId));
    return foundCase || undefined;
  }

  async getCases(limit = 100, offset = 0): Promise<Case[]> {
    return await db.select().from(cases).limit(limit).offset(offset);
  }

  async getCasesByStatus(status: string): Promise<Case[]> {
    return await db.select().from(cases).where(eq(cases.status, status));
  }

  async getCasesByPriority(priority: string): Promise<Case[]> {
    return await db.select().from(cases).where(eq(cases.priority, priority));
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const [newCase] = await db
      .insert(cases)
      .values(caseData)
      .returning();
    
    // Create blockchain transaction for case creation
    await this.createBlockchainTransaction({
      blockHash: `block_${Date.now()}`,
      sourceNodeId: "LEA_NODE_001", // Default LEA node
      entityType: "case",
      entityId: newCase.id.toString(),
      action: "create",
      metadata: { caseId: newCase.caseId },
      status: "confirmed",
      signatureHash: `sig_${Date.now()}`
    });
    
    return newCase;
  }

  async updateCase(id: number, caseData: Partial<InsertCase>): Promise<Case | undefined> {
    const [updatedCase] = await db
      .update(cases)
      .set({
        ...caseData,
        updatedAt: new Date()
      })
      .where(eq(cases.id, id))
      .returning();
    
    // Create blockchain transaction for case update
    if (updatedCase) {
      await this.createBlockchainTransaction({
        blockHash: `block_${Date.now()}`,
        sourceNodeId: "LEA_NODE_001", // Default LEA node
        entityType: "case",
        entityId: updatedCase.id.toString(),
        action: "update",
        metadata: { caseId: updatedCase.caseId },
        status: "confirmed",
        signatureHash: `sig_${Date.now()}`
      });
    }
    
    return updatedCase || undefined;
  }

  // Wallet operations
  async getWallet(id: number): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.id, id));
    return wallet || undefined;
  }

  async getWalletByAddress(address: string): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.address, address));
    return wallet || undefined;
  }

  async getWallets(limit = 100, offset = 0): Promise<Wallet[]> {
    return await db.select().from(wallets).limit(limit).offset(offset);
  }

  async getWalletsByRiskLevel(riskLevel: string): Promise<Wallet[]> {
    return await db.select().from(wallets).where(eq(wallets.riskLevel, riskLevel));
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const [newWallet] = await db
      .insert(wallets)
      .values(wallet)
      .returning();
    
    // Create blockchain transaction for wallet creation
    await this.createBlockchainTransaction({
      blockHash: `block_${Date.now()}`,
      sourceNodeId: "LEA_NODE_001", // Default LEA node
      entityType: "wallet",
      entityId: newWallet.id.toString(),
      action: "create",
      metadata: { walletAddress: newWallet.address },
      status: "confirmed",
      signatureHash: `sig_${Date.now()}`
    });
    
    return newWallet;
  }

  async updateWallet(id: number, wallet: Partial<InsertWallet>): Promise<Wallet | undefined> {
    const [updatedWallet] = await db
      .update(wallets)
      .set({
        ...wallet,
        updatedAt: new Date()
      })
      .where(eq(wallets.id, id))
      .returning();
    
    if (updatedWallet) {
      await this.createBlockchainTransaction({
        blockHash: `block_${Date.now()}`,
        sourceNodeId: "LEA_NODE_001", // Default LEA node
        entityType: "wallet",
        entityId: updatedWallet.id.toString(),
        action: "update",
        metadata: { walletAddress: updatedWallet.address },
        status: "confirmed",
        signatureHash: `sig_${Date.now()}`
      });
    }
    
    return updatedWallet || undefined;
  }

  // Transaction operations
  async getTransaction(id: number): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction || undefined;
  }

  async getTransactionsByWallet(walletAddress: string): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(
        or(
          eq(transactions.fromWallet, walletAddress),
          eq(transactions.toWallet, walletAddress)
        )
      );
  }

  async getTransactionsByCase(caseId: number): Promise<Transaction[]> {
    return await db
      .select()
      .from(transactions)
      .where(eq(transactions.caseId, caseId));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    
    // Create blockchain transaction for transaction creation
    await this.createBlockchainTransaction({
      blockHash: `block_${Date.now()}`,
      sourceNodeId: "LEA_NODE_001", // Default LEA node
      entityType: "transaction",
      entityId: newTransaction.id.toString(),
      action: "create",
      metadata: { txHash: newTransaction.txHash },
      status: "confirmed",
      signatureHash: `sig_${Date.now()}`
    });
    
    return newTransaction;
  }

  // Suspicious Pattern operations
  async getSuspiciousPattern(id: number): Promise<SuspiciousPattern | undefined> {
    const [pattern] = await db.select().from(suspiciousPatterns).where(eq(suspiciousPatterns.id, id));
    return pattern || undefined;
  }

  async getSuspiciousPatternByReferenceId(patternId: string): Promise<SuspiciousPattern | undefined> {
    const [pattern] = await db.select().from(suspiciousPatterns).where(eq(suspiciousPatterns.patternId, patternId));
    return pattern || undefined;
  }

  async getSuspiciousPatterns(limit = 100, offset = 0): Promise<SuspiciousPattern[]> {
    return await db.select().from(suspiciousPatterns).limit(limit).offset(offset);
  }

  async getSuspiciousPatternsByRiskLevel(riskLevel: string): Promise<SuspiciousPattern[]> {
    return await db.select().from(suspiciousPatterns).where(eq(suspiciousPatterns.riskLevel, riskLevel));
  }

  async createSuspiciousPattern(pattern: InsertSuspiciousPattern): Promise<SuspiciousPattern> {
    const [newPattern] = await db
      .insert(suspiciousPatterns)
      .values(pattern)
      .returning();
    
    // Create blockchain transaction for pattern creation
    await this.createBlockchainTransaction({
      blockHash: `block_${Date.now()}`,
      sourceNodeId: "FIU_NODE_001", // Default FIU node 
      entityType: "pattern",
      entityId: newPattern.id.toString(),
      action: "create",
      metadata: { patternId: newPattern.patternId },
      status: "confirmed",
      signatureHash: `sig_${Date.now()}`
    });
    
    return newPattern;
  }

  // STR Report operations
  async getStrReport(id: number): Promise<StrReport | undefined> {
    const [report] = await db.select().from(strReports).where(eq(strReports.id, id));
    return report || undefined;
  }

  async getStrReportByReferenceId(strId: string): Promise<StrReport | undefined> {
    const [report] = await db.select().from(strReports).where(eq(strReports.strId, strId));
    return report || undefined;
  }

  async getStrReports(limit = 100, offset = 0): Promise<StrReport[]> {
    return await db.select().from(strReports).limit(limit).offset(offset);
  }

  async getStrReportsByStatus(status: string): Promise<StrReport[]> {
    return await db.select().from(strReports).where(eq(strReports.status, status));
  }

  async createStrReport(report: InsertStrReport): Promise<StrReport> {
    const [newReport] = await db
      .insert(strReports)
      .values(report)
      .returning();
    
    // Create blockchain transaction for STR creation
    await this.createBlockchainTransaction({
      blockHash: `block_${Date.now()}`,
      sourceNodeId: "FIU_NODE_001", // Default FIU node
      entityType: "str",
      entityId: newReport.id.toString(),
      action: "create",
      metadata: { strId: newReport.strId },
      status: "confirmed",
      signatureHash: `sig_${Date.now()}`
    });
    
    return newReport;
  }

  async updateStrReport(id: number, report: Partial<InsertStrReport>): Promise<StrReport | undefined> {
    const [updatedReport] = await db
      .update(strReports)
      .set(report)
      .where(eq(strReports.id, id))
      .returning();
    
    if (updatedReport) {
      await this.createBlockchainTransaction({
        blockHash: `block_${Date.now()}`,
        sourceNodeId: "FIU_NODE_001", // Default FIU node
        entityType: "str",
        entityId: updatedReport.id.toString(),
        action: "update",
        metadata: { strId: updatedReport.strId },
        status: "confirmed",
        signatureHash: `sig_${Date.now()}`
      });
    }
    
    return updatedReport || undefined;
  }

  // Case Timeline operations
  async getCaseTimelineEvents(caseId: number): Promise<CaseTimeline[]> {
    return await db
      .select()
      .from(caseTimeline)
      .where(eq(caseTimeline.caseId, caseId))
      .orderBy(desc(caseTimeline.date));
  }

  async createCaseTimelineEvent(event: InsertCaseTimeline): Promise<CaseTimeline> {
    const [newEvent] = await db
      .insert(caseTimeline)
      .values(event)
      .returning();
    
    // Create blockchain transaction for timeline event
    await this.createBlockchainTransaction({
      blockHash: `block_${Date.now()}`,
      sourceNodeId: "LEA_NODE_001", // Default LEA node
      entityType: "timeline",
      entityId: newEvent.id.toString(),
      action: "create",
      metadata: { caseId: newEvent.caseId },
      status: "confirmed",
      signatureHash: `sig_${Date.now()}`
    });
    
    return newEvent;
  }

  // State Fraud Stats operations
  async getStateFraudStats(): Promise<StateFraudStat[]> {
    return await db.select().from(stateFraudStats);
  }

  async getStateFraudStatByState(state: string): Promise<StateFraudStat | undefined> {
    const [stateStat] = await db.select().from(stateFraudStats).where(eq(stateFraudStats.state, state));
    return stateStat || undefined;
  }

  async updateStateFraudStat(id: number, stat: Partial<InsertStateFraudStat>): Promise<StateFraudStat | undefined> {
    const [updatedStat] = await db
      .update(stateFraudStats)
      .set(stat)
      .where(eq(stateFraudStats.id, id))
      .returning();
    
    return updatedStat || undefined;
  }

  async createStateFraudStat(stat: InsertStateFraudStat): Promise<StateFraudStat> {
    const [newStat] = await db
      .insert(stateFraudStats)
      .values(stat)
      .returning();
    
    return newStat;
  }

  // Blockchain-specific operations
  async createBlockchainTransaction(transaction: InsertBlockchainTransaction): Promise<BlockchainTransaction> {
    const [newTransaction] = await db
      .insert(blockchainTransactions)
      .values(transaction)
      .returning();
    
    return newTransaction;
  }

  async getBlockchainTransactionsByEntity(entityType: string, entityId: string): Promise<BlockchainTransaction[]> {
    return await db
      .select()
      .from(blockchainTransactions)
      .where(
        and(
          eq(blockchainTransactions.entityType, entityType),
          eq(blockchainTransactions.entityId, entityId)
        )
      )
      .orderBy(desc(blockchainTransactions.timestamp));
  }

  async createBlockchainNode(node: InsertBlockchainNode): Promise<BlockchainNode> {
    const [newNode] = await db
      .insert(blockchainNodes)
      .values(node)
      .returning();
    
    return newNode;
  }

  async getBlockchainNodesByType(type: string): Promise<BlockchainNode[]> {
    return await db
      .select()
      .from(blockchainNodes)
      .where(eq(blockchainNodes.type, type));
  }

  async createKycInformation(kyc: InsertKycInformation): Promise<KycInformation> {
    const [newKyc] = await db
      .insert(kycInformation)
      .values(kyc)
      .returning();
    
    // Create blockchain transaction for KYC upload
    await this.createBlockchainTransaction({
      blockHash: `block_${Date.now()}`,
      sourceNodeId: "EXCHANGE_NODE_001", // Default Exchange node
      entityType: "kyc",
      entityId: newKyc.id.toString(),
      action: "create",
      metadata: { kycHash: newKyc.kycHash },
      status: "confirmed",
      signatureHash: `sig_${Date.now()}`
    });
    
    return newKyc;
  }

  async createCourtExport(export_data: InsertCourtExport): Promise<CourtExport> {
    const [newExport] = await db
      .insert(courtExports)
      .values(export_data)
      .returning();
    
    // Create blockchain transaction for court export
    await this.createBlockchainTransaction({
      blockHash: `block_${Date.now()}`,
      sourceNodeId: "LEA_NODE_001", // Default LEA node
      entityType: "export",
      entityId: newExport.id.toString(),
      action: "create",
      metadata: { fileHash: newExport.fileHash },
      status: "confirmed",
      signatureHash: `sig_${Date.now()}`
    });
    
    return newExport;
  }
}

export const storage = new DatabaseStorage();
