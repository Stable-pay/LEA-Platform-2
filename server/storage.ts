import { db } from './db';
import { eq, desc, and } from 'drizzle-orm';
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

  async getCases(limit = 20, offset = 0): Promise<Case[]> {
    return db.select().from(cases).limit(limit).offset(offset).orderBy(desc(cases.createdAt));
  }

  async getCasesByStatus(status: string): Promise<Case[]> {
    return await db.select().from(cases).where(eq(cases.status, status));
  }

  async getCasesByPriority(priority: string): Promise<Case[]> {
    return await db.select().from(cases).where(eq(cases.priority, priority));
  }

  async createCase(caseData: InsertCase): Promise<Case> {
    const [newCase] = await db.insert(cases).values(caseData).returning();
    
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
    const [updated] = await db.update(cases).set(caseData).where(eq(cases.id, id)).returning();

    if (updated) {
      await this.createBlockchainTransaction({
        blockHash: `block_${Date.now()}`,
        sourceNodeId: "LEA_NODE_001", // Default LEA node
        entityType: "case",
        entityId: updated.id.toString(),
        action: "update",
        metadata: { caseId: updated.caseId },
        status: "confirmed",
        signatureHash: `sig_${Date.now()}`
      });
    }
    return updated;
  }

  // Wallet operations
  async getWallet(id: number): Promise<Wallet | undefined> {
    const [wallet] = await db.select().from(wallets).where(eq(wallets.id, id));
    return wallet || undefined;
  }

  async getWalletByAddress(address: string): Promise<Wallet | undefined> {
    const [result] = await db.select().from(wallets).where(eq(wallets.address, address));
    return result;
  }

  async getWallets(limit = 100, offset = 0): Promise<Wallet[]> {
    return await db.select().from(wallets).limit(limit).offset(offset);
  }

  async getWalletsByRiskLevel(riskLevel: string): Promise<Wallet[]> {
    return await db.select().from(wallets).where(eq(wallets.riskLevel, riskLevel));
  }

  async createWallet(wallet: InsertWallet): Promise<Wallet> {
    const [newWallet] = await db.insert(wallets).values(wallet).returning();

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
        and(
          eq(transactions.fromWallet, walletAddress),
          eq(transactions.toWallet, walletAddress)
        )
      );
  }

  async getTransactionsByCase(caseId: number): Promise<Transaction[]> {
    return db.select()
      .from(transactions)
      .where(eq(transactions.caseId, caseId))
      .orderBy(desc(transactions.timestamp));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();

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

  async getStrReports(limit = 20, offset = 0): Promise<StrReport[]> {
    return db.select().from(strReports).limit(limit).offset(offset).orderBy(desc(strReports.generatedAt));
  }

  async getStrReportsByStatus(status: string): Promise<StrReport[]> {
    return await db.select().from(strReports).where(eq(strReports.status, status));
  }

  async createStrReport(report: InsertStrReport): Promise<StrReport> {
    const [newReport] = await db.insert(strReports).values(report).returning();

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
    return db.select()
      .from(caseTimeline)
      .where(eq(caseTimeline.caseId, caseId))
      .orderBy(desc(caseTimeline.date));
  }

  async createCaseTimelineEvent(event: InsertCaseTimeline): Promise<CaseTimeline> {
    const [newEvent] = await db.insert(caseTimeline).values(event).returning();

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
    // Generate txHash if not provided
    if (!transaction.txHash) {
      transaction.txHash = `bct_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    }

    // Set defaults for required fields to ensure schema compatibility
    const transactionData = {
      txHash: transaction.txHash,
      blockHash: transaction.blockHash,
      entityType: transaction.entityType,
      entityId: transaction.entityId,
      action: transaction.action,
      status: transaction.status || 'pending',
      timestamp: transaction.timestamp || new Date(),
      sourceNodeId: transaction.sourceNodeId || null,
      metadata: transaction.metadata || {},
      signatureHash: transaction.signatureHash || null,
      previousTxHash: transaction.previousTxHash || null,
      stakeholderId: transaction.stakeholderId || null,
      stakeholderType: transaction.stakeholderType || null
    };

    const [newTransaction] = await db
      .insert(blockchainTransactions)
      .values(transactionData)
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
      .where(eq(blockchainNodes.nodeType, type));
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