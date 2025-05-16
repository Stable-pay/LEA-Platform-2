
import { Gateway, Wallets, Network, Contract } from 'fabric-network';
import { BlockchainTransaction } from '@/shared/schema';
import { DEPARTMENT_DETAILS } from '../constants';

export class FabricService {
  private static instance: FabricService;
  private gateway: Gateway;
  private network: Network;
  private contract: Contract;

  private constructor() {
    this.initializeGateway();
  }

  public static getInstance(): FabricService {
    if (!FabricService.instance) {
      FabricService.instance = new FabricService();
    }
    return FabricService.instance;
  }

  private async initializeGateway() {
    try {
      const wallet = await Wallets.newInMemoryWallet();
      const gatewayOptions = {
        identity: 'admin',
        discovery: { enabled: true, asLocalhost: false }
      };

      this.gateway = new Gateway();
      await this.gateway.connect(this.getConnectionProfile(), gatewayOptions);
      
      this.network = await this.gateway.getNetwork('cryptofraud-net');
      this.contract = this.network.getContract('fraudcase');
    } catch (error) {
      console.error('Failed to initialize Fabric gateway:', error);
    }
  }

  private getConnectionProfile() {
    return {
      name: 'crypto-fraud-network',
      version: '1.0.0',
      channels: {
        'cryptofraud-net': {
          orderers: ['orderer.example.com'],
          peers: Object.keys(DEPARTMENT_DETAILS).map(dept => `${dept.toLowerCase()}.example.com`)
        }
      }
    };
  }

  public async submitTransaction(txData: BlockchainTransaction) {
    try {
      const result = await this.contract.submitTransaction(
        'createTransaction',
        JSON.stringify(txData)
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Failed to submit transaction:', error);
      throw error;
    }
  }

  public async queryTransaction(txId: string) {
    try {
      const result = await this.contract.evaluateTransaction(
        'queryTransaction',
        txId
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Failed to query transaction:', error);
      throw error;
    }
  }

  public async getTransactionHistory(entityId: string) {
    try {
      const result = await this.contract.evaluateTransaction(
        'getTransactionHistory',
        entityId
      );
      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      throw error;
    }
  }
}

export default FabricService;
