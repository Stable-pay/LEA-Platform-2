import { caseResponses } from '../shared/schema';

import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { WebSocketServer, WebSocket } from "ws";
import { log } from "./vite";
import { setupAuth } from "./auth";
import {
  insertCaseSchema,
  insertWalletSchema,
  insertTransactionSchema,
  insertSuspiciousPatternSchema,
  insertStrReportSchema,
  insertCaseTimelineSchema,
  insertBlockchainTransactionSchema,
  insertCourtExportSchema
} from "@shared/schema";

// Helper to validate request body against a Zod schema
const validateBody = <T>(schema: z.ZodType<T>) => {
  return (req: Request, res: Response, next: () => void) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid request body", error });
    }
  };
};

// Generate a unique reference ID with a prefix
const generateReferenceId = (prefix: string, number: number) => {
  return `${prefix}-${number.toString().padStart(4, '0')}`;
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes without authentication

  // API routes
  // All routes are prefixed with /api

  // ===== Case Management Routes =====

  // Get all cases with pagination
  app.get("/api/cases", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const cases = await storage.getCases(limit, offset);

      if (!cases) {
        return res.status(200).json([]);
      }

      res.setHeader('Content-Type', 'application/json');
      res.json(cases);
    } catch (error) {
      console.error('Error fetching cases:', error);
      res.status(500).json({ 
        message: "Failed to fetch cases", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Get cases by status
  app.get("/api/cases/status/:status", async (req, res) => {
    try {
      const { status } = req.params;
      const cases = await storage.getCasesByStatus(status);
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cases by status" });
    }
  });

  // Get cases by priority
  app.get("/api/cases/priority/:priority", async (req, res) => {
    try {
      const { priority } = req.params;
      const cases = await storage.getCasesByPriority(priority);
      res.json(cases);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cases by priority" });
    }
  });

  // Get a single case by ID
  app.get("/api/cases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const caseData = await storage.getCaseByReferenceId(id);
      if (!caseData) {
        return res.status(404).json({ message: "Case not found" });
      }
      res.json(caseData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch case" });
    }
  });

  // Create a new case
  app.post("/api/cases", async (req, res) => {
    try {
      console.log("Creating case with data:", req.body);

      const cases = await storage.getCases();
      const caseCount = Array.isArray(cases) ? cases.length : 0;
      const caseId = generateReferenceId("LEA", caseCount + 1);
      const dateReported = new Date();

      // Create case with validated data
      const newCase = await storage.createCase({
        caseId,
        title: req.body.title,
        description: req.body.description,
        status: "active",
        dateReported,
        reportedBy: req.body.reportedBy,
        estimatedLoss: Number(req.body.estimatedLoss || 0),
        assignedTo: req.body.assignedDepartment,
        initiatorDepartment: req.body.initiatorDepartment,
        confirmerDepartment: req.body.confirmerDepartment,
        walletAddress: req.body.walletAddress,
        transactionHash: req.body.transactionHash,
        priority: req.body.priority || "medium"
      });

      // Create blockchain transaction for verification
      const blockchainTx = await storage.createBlockchainTransaction({
        txHash: `tx-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        entityType: "case",
        entityId: newCase.id.toString(),
        action: "create",
        sourceNodeId: req.body.initiatorDepartment,
        status: "pending",
        metadata: {
          caseId: newCase.caseId,
          assignedTo: req.body.assignedDepartment
        }
      });

      // Create initial timeline event
      await storage.createCaseTimelineEvent({
        caseId: newCase.id,
        title: "Case Intake",
        description: "Case created in the system",
        status: "info",
        createdBy: newCase.assignedTo
      });

      res.status(201).json(newCase);
    } catch (error) {
      res.status(500).json({ message: "Failed to create case", error });
    }
  });

  // Update a case
  app.patch("/api/cases/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const caseData = await storage.getCaseByReferenceId(id);
      if (!caseData) {
        return res.status(404).json({ message: "Case not found" });
      }

      const updatedCase = await storage.updateCase(caseData.id, req.body);

      // Add timeline event for status change if applicable
      if (req.body.status && req.body.status !== caseData.status) {
        await storage.createCaseTimelineEvent({
          caseId: caseData.id,
          title: "Status Changed",
          description: `Case status updated from ${caseData.status} to ${req.body.status}`,
          status: "info",
          createdBy: req.body.assignedTo || caseData.assignedTo
        });
      }

      res.json(updatedCase);
    } catch (error) {
      res.status(500).json({ message: "Failed to update case" });
    }
  });

  app.post("/api/cases/response", async (req, res) => {
    try {
      if (!req.body.caseId || !req.body.message || !req.body.department) {
        return res.status(400).json({ 
          message: "Missing required fields: caseId, message, or department" 
        });
      }

      const newResponse = await db.insert(caseResponses).values({
        caseId: req.body.caseId,
        message: req.body.message,
        department: req.body.department,
        attachments: req.body.attachments || [],
        timestamp: new Date(),
        status: 'pending'
      }).returning();

      res.setHeader('Content-Type', 'application/json');
      res.json(newResponse);
    } catch (error) {
      console.error('Response submission error:', error);
      res.status(500).json({ 
        message: "Failed to submit response",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // ===== Wallet Routes =====

  // Get all wallets with pagination
  app.get("/api/wallets", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const wallets = await storage.getWallets(limit, offset);
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallets" });
    }
  });

  // Get a single wallet by address
  app.get("/api/wallets/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const wallet = await storage.getWalletByAddress(address);
      if (!wallet) {
        return res.status(404).json({ message: "Wallet not found" });
      }
      res.json(wallet);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallet" });
    }
  });

  // Get wallets by risk level
  app.get("/api/wallets/risk/:level", async (req, res) => {
    try {
      const { level } = req.params;
      const wallets = await storage.getWalletsByRiskLevel(level);
      res.json(wallets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wallets by risk level" });
    }
  });

  // Create or update a wallet (upsert)
  app.post("/api/wallets", validateBody(insertWalletSchema), async (req, res) => {
    try {
      const existingWallet = await storage.getWalletByAddress(req.body.address);

      if (existingWallet) {
        // Update existing wallet
        const updatedWallet = await storage.updateWallet(existingWallet.id, req.body);
        return res.json(updatedWallet);
      } else {
        // Create new wallet
        const newWallet = await storage.createWallet(req.body);
        return res.status(201).json(newWallet);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to create/update wallet", error });
    }
  });

  // ===== Transaction Routes =====

  // Get transactions by wallet address
  app.get("/api/transactions/wallet/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const transactions = await storage.getTransactionsByWallet(address);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Get transactions by case ID
  app.get("/api/transactions/case/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const caseData = await storage.getCaseByReferenceId(id);
      if (!caseData) {
        return res.status(404).json({ message: "Case not found" });
      }

      const transactions = await storage.getTransactionsByCase(caseData.id);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Create a new transaction
  app.post("/api/transactions", validateBody(insertTransactionSchema), async (req, res) => {
    try {
      const newTransaction = await storage.createTransaction(req.body);
      res.status(201).json(newTransaction);
    } catch (error) {
      res.status(500).json({ message: "Failed to create transaction", error });
    }
  });

  // ===== Suspicious Pattern Routes =====

  // Get all suspicious patterns with pagination
  app.get("/api/patterns", async (_req, res) => {
    try {
      const patterns = await storage.getSuspiciousPatterns();
      if (!patterns) {
        return res.status(200).json([]);
      }
      res.setHeader('Content-Type', 'application/json');
      res.json(Array.from(patterns));
    } catch (error) {
      console.error('Error fetching patterns:', error);
      res.status(500).json({ 
        message: "Failed to fetch patterns", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Get suspicious patterns by risk level
  app.get("/api/patterns/risk/:level", async (req, res) => {
    try {
      const { level } = req.params;
      const patterns = await storage.getSuspiciousPatternsByRiskLevel(level);
      res.json(patterns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patterns by risk level" });
    }
  });

  // Get a single pattern by pattern ID
  app.get("/api/patterns/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const pattern = await storage.getSuspiciousPatternByReferenceId(id);
      if (!pattern) {
        return res.status(404).json({ message: "Pattern not found" });
      }
      res.json(pattern);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pattern" });
    }
  });

  // Create a new suspicious pattern
  app.post("/api/patterns", validateBody(insertSuspiciousPatternSchema), async (req, res) => {
    try {
      const patternCount = (await storage.getSuspiciousPatterns()).length;
      const patternId = req.body.patternId || generateReferenceId("PS", patternCount + 1);

      const newPattern = await storage.createSuspiciousPattern({
        ...req.body,
        patternId
      });

      res.status(201).json(newPattern);
    } catch (error) {
      res.status(500).json({ message: "Failed to create pattern", error });
    }
  });

  // ===== STR Report Routes =====

  // Get all STR reports with pagination
  app.get("/api/str-reports", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const reports = await storage.getStrReports(limit, offset);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch STR reports" });
    }
  });

  // Get STR reports by status
  app.get("/api/str-reports/status/:status", async (req, res) => {
    try {
      const { status } = req.params;
      const reports = await storage.getStrReportsByStatus(status);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch STR reports by status" });
    }
  });

  // Get a single STR report by ID
  app.get("/api/str-reports/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const report = await storage.getStrReportByReferenceId(id);
      if (!report) {
        return res.status(404).json({ message: "STR report not found" });
      }
      res.json(report);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch STR report" });
    }
  });

  // Create a new STR report
  app.post("/api/str-reports", validateBody(insertStrReportSchema), async (req, res) => {
    try {
      const reportCount = (await storage.getStrReports()).length;
      const strId = req.body.strId || generateReferenceId("STR", 10000 + reportCount + 1);

      const newReport = await storage.createStrReport({
        ...req.body,
        strId
      });

      // If this is associated with a case, add a timeline event
      if (newReport.caseReference) {
        const caseData = await storage.getCaseByReferenceId(newReport.caseReference);
        if (caseData) {
          await storage.createCaseTimelineEvent({
            caseId: caseData.id,
            title: "STR Report Generated",
            description: `STR Report ${strId} has been created`,
            status: "info",
            createdBy: newReport.createdBy
          });
        }
      }

      res.status(201).json(newReport);
    } catch (error) {
      res.status(500).json({ message: "Failed to create STR report", error });
    }
  });

  // Update an STR report
  app.patch("/api/str-reports/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const report = await storage.getStrReportByReferenceId(id);
      if (!report) {
        return res.status(404).json({ message: "STR report not found" });
      }

      const updatedReport = await storage.updateStrReport(report.id, req.body);

      // If status changed to submitted and associated with a case, add a timeline event
      if (req.body.status === 'submitted' && report.status !== 'submitted' && report.caseReference) {
        const caseData = await storage.getCaseByReferenceId(report.caseReference);
        if (caseData) {
          await storage.createCaseTimelineEvent({
            caseId: caseData.id,
            title: "STR Report Submitted",
            description: `STR Report ${id} has been submitted to FIU`,
            status: "success",
            createdBy: report.createdBy
          });
        }
      }

      res.json(updatedReport);
    } catch (error) {
      res.status(500).json({ message: "Failed to update STR report" });
    }
  });

  // ===== Case Timeline Routes =====

  // Get timeline events for a case
  app.get("/api/case-timeline/:caseId", async (req, res) => {
    try {
      const { caseId } = req.params;
      const caseData = await storage.getCaseByReferenceId(caseId);
      if (!caseData) {
        return res.status(404).json({ message: "Case not found" });
      }

      const events = await storage.getCaseTimelineEvents(caseData.id);
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timeline events" });
    }
  });

  // Add a timeline event to a case
  app.post("/api/case-timeline", validateBody(insertCaseTimelineSchema), async (req, res) => {
    try {
      const newEvent = await storage.createCaseTimelineEvent(req.body);
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ message: "Failed to create timeline event", error });
    }
  });

  // ===== State Fraud Stats Routes =====

  // Get all state fraud stats
  app.get("/api/state-fraud-stats", async (req, res) => {
    try {
      const stats = await storage.getStateFraudStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch state fraud stats" });
    }
  });

  // Get fraud stats for a specific state
  app.get("/api/state-fraud-stats/:state", async (req, res) => {
    try {
      const { state } = req.params;
      const stats = await storage.getStateFraudStatByState(state);
      if (!stats) {
        return res.status(404).json({ message: "State stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch state stats" });
    }
  });

  // Get departments list
  app.get("/api/departments", async (_req, res) => {
    try {
      const departments = ["ED", "FIU", "I4C", "IT", "VASP", "BANK"];
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  // News feed endpoints
  app.get("/api/news/enforcement", async (_req, res) => {
    try {
      const news = await storage.getLawEnforcementNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch law enforcement news" });
    }
  });

  app.get("/api/news/regulatory", async (_req, res) => {
    try {
      const news = await storage.getRegulatoryNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch regulatory news" });
    }
  });

  app.get("/api/news/crypto", async (_req, res) => {
    try {
      const news = await storage.getCryptoNews();
      res.json(news);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crypto news" });
    }
  });

  // Wallet checks API endpoints
  app.post("/api/wallet-checks", async (req, res) => {
    try {
      const wallet = await storage.createWallet({
        ...req.body,
        lastChecked: new Date(),
        watchlistStatus: 'active'
      });
      res.status(201).json(wallet);
    } catch (error) {
      console.error('Error creating wallet check:', error);
      res.status(500).json({ message: "Failed to create wallet check" });
    }
  });

  app.get("/api/wallet-checks", async (_req, res) => {
    try {
      const wallets = await storage.getWallets();

      // Provide sample data if no wallets exist
      if (!wallets || wallets.length === 0) {
        return res.json([{
          address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
          network: "ethereum",
          riskLevel: "high",
          transactionVolume: 250000,
          lastChecked: new Date(),
          riskIndicators: ["Mixer Usage", "High Velocity Trading"],
          watchlistStatus: "active"
        }]);
      }

      const enrichedChecks = wallets.map(wallet => ({
        address: wallet.address || "",
        network: wallet.network || "ethereum",
        riskLevel: wallet.riskLevel || "medium",
        transactionVolume: wallet.transactionVolume || 0,
        lastChecked: wallet.lastChecked || new Date(),
        riskIndicators: wallet.riskIndicators || [],
        watchlistStatus: wallet.watchlistStatus || 'active'
      }));

      res.json(enrichedChecks);
    } catch (error) {
      console.error('Error fetching wallet checks:', error);
      // Return empty array instead of error to prevent UI breaking
      res.json([]);
    }
  });

  // Setup authentication routes
  setupAuth(app);

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Blockchain peer network routes
  app.post("/api/blockchain/peer/verify", isAuthenticated, async (req, res) => {
    try {
      const { caseId, nodeId, hash } = req.body;

      // Broadcast to all connected peers
      if (wss) {
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'PEER_VERIFICATION',
              nodeId,
              caseId,
              hash,
              timestamp: new Date()
            }));
          }
        });
      }

      res.status(200).json({ message: "Verification broadcast to peers" });
    } catch (error) {
      res.status(500).json({ message: "Failed to broadcast verification" });
    }
  });

  // Blockchain API routes  
  app.get("/api/blockchain/nodes", async (req, res) => {
    try {
      const nodeType = req.query.type as string || "all";
      const nodes = await storage.getBlockchainNodesByType(nodeType);
      res.json(nodes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch blockchain nodes" });
    }
  });

  app.post("/api/blockchain/verify", isAuthenticated, validateBody(insertBlockchainTransactionSchema), async (req, res) => {
    try {
      // Generate transaction hash
      const timestamp = Date.now();
      const txHash = `tx-${timestamp}-${Math.floor(Math.random() * 10000)}`;
      const blockHash = `block-${Math.floor(timestamp / 10000)}-${Math.floor(Math.random() * 1000)}`;

      // Create transaction record
      const transaction = await storage.createBlockchainTransaction({
        ...req.body,
        txHash,
        blockHash,
        status: "pending",
        timestamp: new Date(),
        metadata: req.body.metadata || {}
      });

      res.status(201).json(transaction);

      // Simulate consensus process with delay
      setTimeout(async () => {
        try {
          // This would be done by the blockchain network in a real implementation
          const updatedTransaction = {
            ...transaction,
            status: "confirmed",
            signatureHash: `sig-${Date.now()}-${Math.floor(Math.random() * 10000)}`
          };

          await storage.updateBlockchainTransaction(transaction.id, updatedTransaction);
        } catch (error) {
          log(`Error confirming transaction: ${error}`, "blockchain");
        }
      }, 3000);
    } catch (error) {
      res.status(500).json({ message: "Failed to verify on blockchain", error });
    }
  });

  // AI Email Generation endpoint
  app.post("/api/generate-email", isAuthenticated, async (req, res) => {
    try {
      const { subject, caseId, department } = req.body;

      let prompt = `Write a professional email for law enforcement communication with the subject: "${subject}". `;

      const departmentContext = {
        'ED': 'Focus on financial investigation aspects and regulatory compliance.',
        'FIU': 'Emphasize suspicious transaction patterns and financial intelligence.',
        'I4C': 'Address cybercrime investigation and digital forensics aspects.',
        'IT': 'Focus on technical infrastructure and system security.',
        'VASP': 'Cover virtual asset service provider compliance and monitoring.',
        'BANK': 'Address banking transaction monitoring and compliance.'
      };

      if (caseId) {
        const caseDetails = await storage.getCaseByReferenceId(caseId);
        if (caseDetails) {
          prompt += `This email is regarding case ${caseId} (${caseDetails.title}). Include relevant case details and next steps. `;
        }
      }

      prompt += `Write from the perspective of ${department} department. ${departmentContext[department] || ''} Keep it formal, precise, and action-oriented.`;

      // You can integrate with your preferred AI service here
      // For now, returning a template response
      const content = `Dear Sir/Madam,

I am writing regarding ${subject}.

Based on our department's review, we would like to inform you about the current status and next steps.

Please let us know if you need any additional information.

Best regards,
${department} Department`;

      res.json({ content });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate email content", error });
    }
  });

  // Email Routes
  app.post("/api/emails/send", isAuthenticated, async (req, res) => {
    try {
      const { to, subject, body, caseId, department } = req.body;

      // Store email in database
      const email = await storage.createEmail({
        to,
        subject,
        body,
        caseId,
        senderDepartment: department,
        status: 'sent',
        timestamp: new Date()
      });

      // Add timeline event if case related
      if (caseId) {
        await storage.createCaseTimelineEvent({
          caseId,
          title: "Email Sent",
          description: `Email sent to ${to}: ${subject}`,
          status: "info",
          createdBy: department
        });
      }

      res.status(201).json(email);
    } catch (error) {
      res.status(500).json({ message: "Failed to send email", error });
    }
  });

  app.post("/api/emails/draft", isAuthenticated, async (req, res) => {
    try {
      const { to, subject, body, caseId, department } = req.body;

      const draft = await storage.createEmail({
        to,
        subject,
        body,
        caseId,
        senderDepartment: department,
        status: 'draft',
        timestamp: new Date()
      });

      res.status(201).json(draft);
    } catch (error) {
      res.status(500).json({ message: "Failed to save draft", error });
    }
  });

  // Court export with blockchain verification
  app.post("/api/court-exports", isAuthenticated, validateBody(insertCourtExportSchema), async (req, res) => {
    try {
      const exportData = await storage.createCourtExport({
        ...req.body,
        status: "pending",
        exportedAt: new Date(),
        timestamp: new Date()
      });

      res.status(201).json(exportData);

      // Create blockchain transaction for court export verification
      const timestamp = Date.now();
      const txHash = `tx-${timestamp}-${Math.floor(Math.random() * 10000)}`;

      const blockchainTx = await storage.createBlockchainTransaction({
        txHash,
        blockHash: `block-${Math.floor(timestamp / 10000)}-${Math.floor(Math.random() * 1000)}`,
        entityType: "court_export",
        entityId: exportData.id.toString(),
        action: "create",
        sourceNodeId: req.body.signerNodeId || "stable-pay-node",
        status: "pending",
        metadata: {
          exportType: exportData.exportType,
          fileHash: exportData.fileHash
        },
        timestamp: new Date()
      });

      // Simulate verification delay
      setTimeout(async () => {
        try {
          // Update transaction status to confirmed
          const updatedTx = {
            ...blockchainTx,
            status: "confirmed",
            signatureHash: `sig-${Date.now()}-${Math.floor(Math.random() * 10000)}`
          };

          // Update court export with transaction hash
          await storage.updateCourtExport(exportData.id, {
            blockchainTxHash: txHash,
            status: "verified"
          });

          // Broadcast to WebSocket clients
          if (wss) {
            wss.clients.forEach(client => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: "COURT_EXPORT_VERIFIED",
                  data: {
                    exportId: exportData.id,
                    transaction: updatedTx
                  }
                }));
              }
            });
          }

          log("Court export verified on blockchain", "blockchain");
        } catch (error) {
          log(`Error verifying court export: ${error}`, "blockchain");
        }
      }, 5000); // 5 second simulated verification delay

    } catch (error) {
      res.status(500).json({ message: "Failed to create court export", error });
    }
  });

  const httpServer = createServer(app);

  // Setup WebSocket Server for real-time blockchain updates
  const wss = new WebSocketServer({
    noServer: true
  });

  httpServer.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  // WebSocket connection handling
  wss.on('connection', (ws) => {
    log("WebSocket client connected", "ws");

    // Send welcome message
    ws.send(JSON.stringify({
      type: "CONNECTED",
      message: "Connected to StablePay Blockchain Network",
      timestamp: new Date()
    }));

    // Simulate periodic node confirmations
    const nodeNames = ["LEA Central Node", "FIU Node 1", "IND Node", "I4C Node"];
    const confirmationInterval = setInterval(() => {
      const randomNode = nodeNames[Math.floor(Math.random() * nodeNames.length)];
      ws.send(JSON.stringify({
        type: "NODE_CONFIRMATION",
        nodeName: randomNode,
        timestamp: new Date().toISOString()
      }));
    }, 2000);

    ws.on('close', () => {
      clearInterval(confirmationInterval);
    });

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString());

        if (data.type === "SUBSCRIBE_BLOCKCHAIN") {
          // Send recent blockchain transactions
          const transactions = await storage.getBlockchainTransactionsByEntity(
            data.entityType || "all",
            data.entityId || "all"
          );

          ws.send(JSON.stringify({
            type: "BLOCKCHAIN_TRANSACTIONS",
            data: transactions
          }));
        }

      } catch (error) {
        log(`WebSocket error: ${error}`, "ws");
        ws.send(JSON.stringify({
          type: "ERROR",
          message: "Failed to process message"
        }));
      }
    });

    ws.on('close', () => {
      log("WebSocket client disconnected", "ws");
    });
  });

  return httpServer;
}