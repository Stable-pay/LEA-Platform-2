
import { Gateway, Wallets, X509Identity } from 'fabric-network';
import { ConnectionProfile } from '@hyperledger/fabric-gateway';
import * as fs from 'fs';
import * as path from 'path';
import { BlockchainTransaction } from '@/shared/schema';
import { DEPARTMENT_DETAILS } from '../constants';

export class FabricService {
  private static instance: FabricService;
  private gateway: Gateway;
  private networkName = 'cryptofraud-net';
  private channelName = 'fraudchannel';
  private chaincodeName = 'fraudcc';
  private mspId = 'RegulatorMSP';

  private constructor() {}

  public static getInstance(): FabricService {
    if (!FabricService.instance) {
      FabricService.instance = new FabricService();
    }
    return FabricService.instance;
  }

  private async getWallet() {
    const walletPath = path.join(process.cwd(), 'wallet');
    return await Wallets.newFileSystemWallet(walletPath);
  }

  private async enrollAdmin() {
    try {
      const wallet = await this.getWallet();
      const identity = await wallet.get('admin');
      
      if (identity) {
        console.log('Admin identity already exists');
        return;
      }

      const enrollment = await this.caClient.enroll({
        enrollmentID: 'admin',
        enrollmentSecret: process.env.FABRIC_ADMIN_SECRET
      });

      const x509Identity: X509Identity = {
        credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
        },
        mspId: this.mspId,
        type: 'X.509',
      };

      await wallet.put('admin', x509Identity);
    } catch (error) {
      console.error('Failed to enroll admin:', error);
      throw error;
    }
  }

  public async connect() {
    try {
      const wallet = await this.getWallet();
      await this.enrollAdmin();

      const identity = await wallet.get('admin');
      if (!identity) {
        throw new Error('Admin identity not found');
      }

      const gateway = new Gateway();
      
      await gateway.connect(this.getConnectionProfile(), {
        identity: identity,
        discovery: { enabled: true, asLocalhost: false }
      });

      this.gateway = gateway;
      console.log('Connected to Fabric network');
    } catch (error) {
      console.error('Failed to connect to Fabric network:', error);
      throw error;
    }
  }

  private getConnectionProfile(): ConnectionProfile {
    return {
      name: 'crypto-fraud-network',
      version: '2.0.0',
      client: {
        organization: 'RegulatorOrg',
        connection: {
          timeout: {
            peer: {
              endorser: '300'
            },
            orderer: '300'
          }
        }
      },
      organizations: {
        RegulatorOrg: {
          mspid: this.mspId,
          peers: ['peer0.regulator.example.com'],
          certificateAuthorities: ['ca.regulator.example.com']
        }
      },
      peers: {
        'peer0.regulator.example.com': {
          url: process.env.FABRIC_PEER_URL,
          tlsCACerts: {
            path: path.resolve(__dirname, '../../crypto/peer-cert.pem')
          },
          grpcOptions: {
            'ssl-target-name-override': 'peer0.regulator.example.com',
            hostnameOverride: 'peer0.regulator.example.com'
          }
        }
      },
      certificateAuthorities: {
        'ca.regulator.example.com': {
          url: process.env.FABRIC_CA_URL,
          caName: 'ca.regulator.example.com',
          tlsCACerts: {
            path: path.resolve(__dirname, '../../crypto/ca-cert.pem')
          },
          httpOptions: {
            verify: false
          }
        }
      }
    };
  }

  public async submitTransaction(txData: BlockchainTransaction) {
    try {
      const network = await this.gateway.getNetwork(this.networkName);
      const contract = network.getContract(this.chaincodeName);

      const result = await contract.submitTransaction(
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
      const network = await this.gateway.getNetwork(this.networkName);
      const contract = network.getContract(this.chaincodeName);

      const result = await contract.evaluateTransaction(
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
      const network = await this.gateway.getNetwork(this.networkName);
      const contract = network.getContract(this.chaincodeName);

      const result = await contract.evaluateTransaction(
        'getTransactionHistory',
        entityId
      );

      return JSON.parse(result.toString());
    } catch (error) {
      console.error('Failed to get transaction history:', error);
      throw error;
    }
  }

  public async disconnect() {
    if (this.gateway) {
      await this.gateway.disconnect();
    }
  }
}

export default FabricService;
