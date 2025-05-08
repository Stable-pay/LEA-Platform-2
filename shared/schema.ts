import { pgTable, text, serial, integer, boolean, timestamp, jsonb, real, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User model for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("law_enforcement"), // law_enforcement, fiu_ind, i4c, bank_exchange
  fullName: text("full_name").notNull(),
  organization: text("organization"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Case model for tracking fraud investigations
export const cases = pgTable("cases", {
  id: serial("id").primaryKey(),
  caseId: text("case_id").notNull().unique(), // Human-readable case ID (e.g., LEA-3912)
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("active"), // active, investigating, pending, resolved, critical
  dateReported: timestamp("date_reported").defaultNow(),
  reportedBy: text("reported_by").notNull(),
  estimatedLoss: integer("estimated_loss"), // In INR
  assignedTo: integer("assigned_to").references(() => users.id),
  priority: text("priority").notNull().default("medium"), // critical, high, medium, low
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Wallet model for tracking cryptocurrency wallets
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  address: text("address").notNull().unique(),
  riskScore: integer("risk_score"), // 0-100 risk score
  riskLevel: text("risk_level"), // critical, high risk, medium risk, low risk, safe
  scamPatterns: jsonb("scam_patterns"), // Array of scam patterns this wallet is associated with
  caseIds: jsonb("case_ids"), // Array of case IDs this wallet is linked to
  exchanges: jsonb("exchanges"), // Array of exchanges this wallet has interacted with
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Transaction model for tracking suspicious transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  txHash: text("tx_hash").notNull().unique(),
  fromWallet: text("from_wallet").notNull(),
  toWallet: text("to_wallet").notNull(),
  amount: real("amount"), // Transaction amount
  currency: text("currency").notNull().default("INR"),
  timestamp: timestamp("timestamp").defaultNow(),
  caseId: integer("case_id").references(() => cases.id),
  suspicious: boolean("suspicious").default(false),
  patternId: integer("pattern_id").references(() => suspiciousPatterns.id),
});

// Pattern model for tracking suspicious transaction patterns
export const suspiciousPatterns = pgTable("suspicious_patterns", {
  id: serial("id").primaryKey(),
  patternId: text("pattern_id").notNull().unique(), // Human-readable pattern ID (e.g., PS-1234)
  pattern: text("pattern").notNull(),
  description: text("description"),
  riskLevel: text("risk_level").notNull(), // high, medium, low
  detectedAt: timestamp("detected_at").defaultNow(),
  walletAddress: text("wallet_address").references(() => wallets.address), // Primary wallet address
  transactionCount: integer("transaction_count").default(0),
  volume: text("volume"), // Volume in currency
  createdAt: timestamp("created_at").defaultNow(),
});

// STR (Suspicious Transaction Report) model
export const strReports = pgTable("str_reports", {
  id: serial("id").primaryKey(),
  strId: text("str_id").notNull().unique(), // Human-readable STR ID (e.g., STR-10089)
  caseReference: text("case_reference").references(() => cases.caseId), // Associated case reference
  reportType: text("report_type").notNull(),
  primaryWallet: text("primary_wallet").references(() => wallets.address),
  description: text("description").notNull(),
  transactionDate: timestamp("transaction_date").defaultNow(),
  amount: integer("amount"), // Amount in INR
  includeBlockchain: boolean("include_blockchain").default(true),
  includeKyc: boolean("include_kyc").default(true),
  includePattern: boolean("include_pattern").default(true),
  includeExchange: boolean("include_exchange").default(true),
  status: text("status").notNull().default("draft"), // draft, submitted, approved, rejected
  generatedAt: timestamp("generated_at").defaultNow(),
  submittedAt: timestamp("submitted_at"),
  createdBy: integer("created_by").references(() => users.id),
});

// Timeline model for tracking case events
export const caseTimeline = pgTable("case_timeline", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => cases.id),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").defaultNow(),
  status: text("status").notNull(), // error, warning, info, success
  createdBy: integer("created_by").references(() => users.id),
});

// State Fraud Stats for heatmap visualization
export const stateFraudStats = pgTable("state_fraud_stats", {
  id: serial("id").primaryKey(),
  state: text("state").notNull().unique(),
  caseCount: integer("case_count").default(0),
  estimatedLoss: integer("estimated_loss").default(0), // In INR
  riskLevel: text("risk_level"), // critical, high, medium, low
  dateRecorded: timestamp("date_recorded").defaultNow(),
});

// Blockchain Node model for Hyperledger Fabric network
export const blockchainNodes = pgTable("blockchain_nodes", {
  id: serial("id").primaryKey(),
  nodeId: text("node_id").notNull().unique(),
  name: text("name").notNull(),
  type: text("type").notNull(), // LEA, FIU-IND, I4C, Bank, Exchange, Court
  organization: text("organization").notNull(),
  ipAddress: text("ip_address"),
  port: integer("port"),
  publicKey: text("public_key"),
  accessLevel: text("access_level").notNull(), // full, read-only, write-only
  status: text("status").notNull().default("active"), // active, inactive, maintenance
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Blockchain Transaction model for Hyperledger Fabric ledger
export const blockchainTransactions = pgTable("blockchain_transactions", {
  id: serial("id").primaryKey(),
  txId: uuid("tx_id").defaultRandom().notNull().unique(),
  blockHash: text("block_hash").notNull(),
  sourceNodeId: text("source_node_id").references(() => blockchainNodes.nodeId),
  entityType: text("entity_type").notNull(), // case, wallet, transaction, pattern, str, timeline
  entityId: text("entity_id").notNull(), // ID of the entity being logged
  action: text("action").notNull(), // create, update, delete, verify, escalate
  metadata: jsonb("metadata"), // Additional information about the transaction
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").notNull().default("confirmed"), // pending, confirmed, rejected
  signatureHash: text("signature_hash"), // Hash of the digital signature
  previousTxHash: text("previous_tx_hash"), // Hash of the previous transaction (for chains)
});

// KYC Information model for encrypted KYC data
export const kycInformation = pgTable("kyc_information", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").references(() => wallets.id),
  exchangeNodeId: text("exchange_node_id").references(() => blockchainNodes.nodeId),
  kycHash: text("kyc_hash").notNull(), // Hash of the KYC information
  dataEncrypted: boolean("data_encrypted").default(true),
  encryptedData: text("encrypted_data"), // Encrypted KYC data
  verificationStatus: text("verification_status").notNull().default("pending"), // pending, verified, rejected
  uploadedAt: timestamp("uploaded_at").defaultNow(),
  verifiedAt: timestamp("verified_at"),
});

// Court Export model for case exports to judiciary
export const courtExports = pgTable("court_exports", {
  id: serial("id").primaryKey(),
  caseId: integer("case_id").references(() => cases.id),
  exportType: text("export_type").notNull(), // pdf, json, hash-proof
  fileName: text("file_name"),
  fileHash: text("file_hash").notNull(), // Hash of the exported file
  signerNodeId: text("signer_node_id").references(() => blockchainNodes.nodeId),
  signerPublicKey: text("signer_public_key"),
  timestamp: timestamp("timestamp").defaultNow(),
  blockchainTxId: uuid("blockchain_tx_id").references(() => blockchainTransactions.txId),
});

// Define relations between tables
export const usersRelations = relations(users, ({ many }) => ({
  cases: many(cases, { relationName: "user_cases" }),
  strReports: many(strReports, { relationName: "user_str_reports" }),
  caseTimelines: many(caseTimeline, { relationName: "user_case_timelines" }),
}));

export const casesRelations = relations(cases, ({ one, many }) => ({
  assignedUser: one(users, {
    fields: [cases.assignedTo],
    references: [users.id],
    relationName: "user_cases",
  }),
  transactions: many(transactions, { relationName: "case_transactions" }),
  caseTimelines: many(caseTimeline, { relationName: "case_timelines" }),
  strReports: many(strReports, { relationName: "case_str_reports" }),
  courtExports: many(courtExports, { relationName: "case_court_exports" }),
}));

export const walletsRelations = relations(wallets, ({ many }) => ({
  suspiciousPatterns: many(suspiciousPatterns, { relationName: "wallet_patterns" }),
  strReports: many(strReports, { relationName: "wallet_str_reports" }),
  kycInformation: many(kycInformation, { relationName: "wallet_kyc" }),
}));

export const blockchainNodesRelations = relations(blockchainNodes, ({ many }) => ({
  blockchainTransactions: many(blockchainTransactions, { relationName: "node_transactions" }),
  kycInformation: many(kycInformation, { relationName: "node_kyc_information" }),
  courtExports: many(courtExports, { relationName: "node_court_exports" }),
}));

export const blockchainTransactionsRelations = relations(blockchainTransactions, ({ one, many }) => ({
  sourceNode: one(blockchainNodes, {
    fields: [blockchainTransactions.sourceNodeId],
    references: [blockchainNodes.nodeId],
    relationName: "node_transactions",
  }),
  courtExports: many(courtExports, { relationName: "transaction_court_exports" }),
}));

// Create insert schemas for each model
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertCaseSchema = createInsertSchema(cases).omit({ id: true });
export const insertWalletSchema = createInsertSchema(wallets).omit({ id: true });
export const insertTransactionSchema = createInsertSchema(transactions).omit({ id: true });
export const insertSuspiciousPatternSchema = createInsertSchema(suspiciousPatterns).omit({ id: true });
export const insertStrReportSchema = createInsertSchema(strReports).omit({ id: true });
export const insertCaseTimelineSchema = createInsertSchema(caseTimeline).omit({ id: true });
export const insertStateFraudStatSchema = createInsertSchema(stateFraudStats).omit({ id: true });
export const insertBlockchainNodeSchema = createInsertSchema(blockchainNodes).omit({ id: true });
export const insertBlockchainTransactionSchema = createInsertSchema(blockchainTransactions).omit({ id: true });
export const insertKycInformationSchema = createInsertSchema(kycInformation).omit({ id: true });
export const insertCourtExportSchema = createInsertSchema(courtExports).omit({ id: true });

// Define types for insert operations
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCase = z.infer<typeof insertCaseSchema>;
export type InsertWallet = z.infer<typeof insertWalletSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertSuspiciousPattern = z.infer<typeof insertSuspiciousPatternSchema>;
export type InsertStrReport = z.infer<typeof insertStrReportSchema>;
export type InsertCaseTimeline = z.infer<typeof insertCaseTimelineSchema>;
export type InsertStateFraudStat = z.infer<typeof insertStateFraudStatSchema>;
export type InsertBlockchainNode = z.infer<typeof insertBlockchainNodeSchema>;
export type InsertBlockchainTransaction = z.infer<typeof insertBlockchainTransactionSchema>;
export type InsertKycInformation = z.infer<typeof insertKycInformationSchema>;
export type InsertCourtExport = z.infer<typeof insertCourtExportSchema>;

// Define types for select operations
export type User = typeof users.$inferSelect;
export type Case = typeof cases.$inferSelect;
export type Wallet = typeof wallets.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type SuspiciousPattern = typeof suspiciousPatterns.$inferSelect;
export type StrReport = typeof strReports.$inferSelect;
export type CaseTimeline = typeof caseTimeline.$inferSelect;
export type StateFraudStat = typeof stateFraudStats.$inferSelect;
export type BlockchainNode = typeof blockchainNodes.$inferSelect;
export type BlockchainTransaction = typeof blockchainTransactions.$inferSelect;
export type KycInformation = typeof kycInformation.$inferSelect;
export type CourtExport = typeof courtExports.$inferSelect;
