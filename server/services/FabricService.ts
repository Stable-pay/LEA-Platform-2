import { Gateway, Wallets, Network, Contract } from 'fabric-network';
import { BlockchainTransaction, Case, BlockchainNode } from '@/shared/schema';
import * as path from 'path';
import * as fs from 'fs';

export class FabricService {
  private static instance: FabricService;
  private gateway: Gateway;
  private network: Network;
  private contract: Contract;

  private constructor() {
    this.gateway = new Gateway();
  }

  static getInstance(): FabricService {
    if (!FabricService.instance) {
      FabricService.instance = new FabricService();
    }
    return FabricService.instance;
  }

  private async connect() {
    try {
      // Load connection profile
      const ccpPath = path.resolve(__dirname, '../../crypto/connection.json');
      let ccp;
      try {
        ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
      } catch (error) {
        console.warn('Could not load connection profile, using default config');
        ccp = {
          peers: [{
            url: 'grpc://0.0.0.0:7051',
            'grpcOptions': {
              'ssl-target-name-override': 'peer0'
            }
          }]
        };
      }

      // Create wallet instance
      const walletPath = path.join(process.cwd(), 'wallet');
      const wallet = await Wallets.newFileSystemWallet(walletPath);

      // Connect to gateway
      await this.gateway.connect(ccp, {
        wallet,
        identity: 'admin',
        discovery: { enabled: true, asLocalhost: false }
      });

      // Get network and contract
      this.network = await this.gateway.getNetwork('mychannel');
      this.contract = this.network.getContract('casemgmt');

      console.log('Connected to Fabric network');
    } catch (error) {
      console.error('Failed to connect to Fabric network:', error);
      throw error;
    }
  }

  async recordCase(caseData: Case): Promise<string> {
    try {
      const result = await this.contract.submitTransaction(
        'createCase',
        caseData.caseId,
        JSON.stringify({
          title: caseData.title,
          description: caseData.description,
          status: caseData.status,
          priority: caseData.priority,
          estimatedLoss: caseData.estimatedLoss,
          assignedTo: caseData.assignedTo,
          walletAddress: caseData.walletAddress,
          transactionHash: caseData.transactionHash
        })
      );
      return result.toString();
    } catch (error) {
      console.error('Failed to record case:', error);
      throw error;
    }
  }

  async queryCaseHistory(caseId: string): Promise<BlockchainTransaction[]> {
    try {
      const result = await this.contract.evaluateTransaction('getCaseHistory', caseId);
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Failed to query case history:', error);
      throw error;
    }
  }

  async recordTransaction(txData: BlockchainTransaction): Promise<string> {
    try {
      const result = await this.contract.submitTransaction(
        'recordTransaction',
        txData.txHash,
        JSON.stringify({
          blockHash: txData.blockHash,
          entityType: txData.entityType,
          entityId: txData.entityId,
          action: txData.action,
          metadata: txData.metadata,
          stakeholderId: txData.stakeholderId,
          stakeholderType: txData.stakeholderType
        })
      );
      return result.toString();
    } catch (error) {
      console.error('Failed to record transaction:', error);
      throw error;
    }
  }

  async registerNode(node: BlockchainNode): Promise<void> {
    try {
      await this.contract.submitTransaction(
        'registerNode',
        node.nodeId,
        JSON.stringify({
          name: node.name,
          nodeType: node.nodeType,
          organization: node.organization,
          publicKey: node.publicKey,
          accessLevel: node.accessLevel
        })
      );
    } catch (error) {
      console.error('Failed to register node:', error);
      throw error;
    }
  }

  async validateTransaction(txHash: string): Promise<boolean> {
    try {
      const result = await this.contract.evaluateTransaction('validateTransaction', txHash);
      return JSON.parse(result.toString()).valid;
    } catch (error) {
      console.error('Failed to validate transaction:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this.gateway.disconnect();
  }
}

export default FabricService;