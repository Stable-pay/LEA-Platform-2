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
      { nodeType: "LEA", nodeId: "LEA_NODE_001", name: "Delhi Police Node", organization: "Delhi Police", ipAddress: "peer0.lea.example.com", port: 7051, status: "active", mspId: "LEAMSP" },
      { nodeType: "LEA", nodeId: "LEA_NODE_002", name: "Mumbai Police Node", organization: "Mumbai Police", ipAddress: "peer1.lea.example.com", port: 7051, status: "active", mspId: "LEAMSP" },
      { nodeType: "FIU", nodeId: "FIU_NODE_001", name: "FIU Central Node", organization: "Financial Intelligence Unit", ipAddress: "peer0.fiu.example.com", port: 7051, status: "active", mspId: "FIUMSP" },
      { nodeType: "I4C", nodeId: "I4C_NODE_001", name: "I4C Primary Node", organization: "I4C", ipAddress: "peer0.i4c.example.com", port: 7051, status: "active", mspId: "I4CMSP" },
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
    const txHash = transaction.txHash || `bct_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    
    const newTransaction: BlockchainTransaction = {
      txHash,
      blockHash: transaction.blockHash,
      entityType: transaction.entityType,
      entityId: transaction.entityId,
      action: transaction.action,
      timestamp: transaction.timestamp || new Date(),
      status: transaction.status || 'pending',
      metadata: transaction.metadata || {},
      sourceNodeId: transaction.sourceNodeId || null,
      signatureHash: transaction.signatureHash || null,
      previousTxHash: transaction.previousTxHash || null,
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
import { db } from './db';
import { eq, desc, and } from 'drizzle-orm';
import * as schema from '@shared/schema';
import type { 
  Case, InsertCase,
  Wallet, InsertWallet,
  Transaction, InsertTransaction,
  SuspiciousPattern, InsertSuspiciousPattern,
  StrReport, InsertStrReport,
  CaseTimeline, InsertCaseTimeline,
  BlockchainTransaction, InsertBlockchainTransaction
} from '@shared/schema';

export const storage = {
  // Case operations
  async createCase(data: InsertCase) {
    try {
      const result = await db.insert(schema.cases).values(data).returning();
      return result[0];
    } catch (error) {
      console.error('Failed to create case:', error);
      throw new Error('Failed to create case');
    }
  },

  async getCases(limit = 20, offset = 0) {
    try {
      return await db.select().from(schema.cases)
        .orderBy(desc(schema.cases.createdAt))
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
      throw new Error('Failed to fetch cases');
    }
  },

  async getCaseByReferenceId(caseId: string) {
    try {
      const results = await db.select().from(schema.cases)
        .where(eq(schema.cases.caseId, caseId));
      return results[0];
    } catch (error) {
      console.error('Failed to fetch case:', error);
      throw new Error('Failed to fetch case');
    }
  },

  async updateCase(id: number, data: Partial<InsertCase>) {
    try {
      const result = await db.update(schema.cases)
        .set({...data, updatedAt: new Date()})
        .where(eq(schema.cases.id, id))
        .returning();
      return result[0];
    } catch (error) {
      console.error('Failed to update case:', error);
      throw new Error('Failed to update case');
    }
  },

  async getCasesByStatus(status: string) {
    try {
      return await db.select().from(schema.cases)
        .where(eq(schema.cases.status, status))
        .orderBy(desc(schema.cases.createdAt));
    } catch (error) {
      console.error('Failed to fetch cases by status:', error);
      throw new Error('Failed to fetch cases by status');
    }
  },

  // Timeline operations
  async createCaseTimelineEvent(event: InsertCaseTimeline) {
    try {
      const result = await db.insert(schema.caseTimeline)
        .values(event)
        .returning();
      return result[0];
    } catch (error) {
      console.error('Failed to create timeline event:', error);
      throw new Error('Failed to create timeline event');
    }
  },

  async getCaseTimelineEvents(caseId: number) {
    try {
      return await db.select().from(schema.caseTimeline)
        .where(eq(schema.caseTimeline.caseId, caseId))
        .orderBy(desc(schema.caseTimeline.date));
    } catch (error) {
      console.error('Failed to fetch timeline events:', error);
      throw new Error('Failed to fetch timeline events');
    }
  },

  // Blockchain operations
  async createBlockchainTransaction(transaction: InsertBlockchainTransaction) {
    try {
      const result = await db.insert(schema.blockchainTransactions)
        .values(transaction)
        .returning();
      return result[0];
    } catch (error) {
      console.error('Failed to create blockchain transaction:', error);
      throw new Error('Failed to create blockchain transaction');
    }
  },

  async getBlockchainTransactionsByEntity(entityType: string, entityId: string) {
    try {
      return await db.select().from(schema.blockchainTransactions)
        .where(and(
          eq(schema.blockchainTransactions.entityType, entityType),
          eq(schema.blockchainTransactions.entityId, entityId)
        ))
        .orderBy(desc(schema.blockchainTransactions.timestamp));
    } catch (error) {
      console.error('Failed to fetch blockchain transactions:', error);
      throw new Error('Failed to fetch blockchain transactions');
    }
  }
};