
import { Gateway, Wallets } from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import { buildCCP, buildWallet } from './utils';

const channelName = 'cyberfraudchannel';
const chaincodeName = 'fraudcase';

const peerNodes = {
  // Law Enforcement Nodes
  LEA: {
    peers: [
      { name: 'peer0.lea.example.com', port: 7051, url: 'grpcs://peer0.lea.example.com:7051' },
      { name: 'peer1.lea.example.com', port: 7052, url: 'grpcs://peer1.lea.example.com:7052' }
    ],
    mspId: 'LEAMSP',
    ca: { url: 'https://ca.lea.example.com:7054' }
  },
  // Financial Intelligence Unit Nodes
  FIU: {
    peers: [
      { name: 'peer0.fiu.example.com', port: 7061, url: 'grpcs://peer0.fiu.example.com:7061' }
    ],
    mspId: 'FIUMSP',
    ca: { url: 'https://ca.fiu.example.com:7054' }
  },
  // I4C Nodes
  I4C: {
    peers: [
      { name: 'peer0.i4c.example.com', port: 7071, url: 'grpcs://peer0.i4c.example.com:7071' }
    ],
    mspId: 'I4CMSP',
    ca: { url: 'https://ca.i4c.example.com:7054' }
  },
  // Indian Nodal Department Nodes
  IND: {
    peers: [
      { name: 'peer0.ind.example.com', port: 7081, url: 'grpcs://peer0.ind.example.com:7081' }
    ],
    mspId: 'INDMSP',
    ca: { url: 'https://ca.ind.example.com:7054' }
  }
};

export const fabricNetwork = {
  async connectToNetwork(orgId: string) {
    try {
      const org = peerNodes[orgId];
      if (!org) throw new Error(`Invalid organization: ${orgId}`);

      const ccp = await buildCCP(orgId);
      const wallet = await buildWallet(orgId);
      
      const gateway = new Gateway();
      await gateway.connect(ccp, {
        wallet,
        identity: `${orgId}admin`,
        discovery: { enabled: true, asLocalhost: false }
      });

      const network = await gateway.getNetwork(channelName);
      const contract = network.getContract(chaincodeName);

      return { gateway, network, contract };
    } catch (error) {
      console.error(`Failed to connect to network: ${error}`);
      throw error;
    }
  },

  async getPeerStatus(orgId: string) {
    const org = peerNodes[orgId];
    if (!org) throw new Error(`Invalid organization: ${orgId}`);

    const status = await Promise.all(org.peers.map(async (peer) => {
      try {
        const response = await fetch(`${peer.url}/status`);
        return {
          name: peer.name,
          status: response.ok ? 'active' : 'inactive',
          lastSyncTime: new Date().toISOString()
        };
      } catch (error) {
        return {
          name: peer.name,
          status: 'inactive',
          error: error.message
        };
      }
    }));

    return status;
  },

  async initializeChannels() {
    const channels = [
      {
        name: 'cyberfraudchannel',
        orgs: ['LEA', 'FIU', 'I4C', 'IND']
      },
      {
        name: 'leachannel',
        orgs: ['LEA', 'FIU']
      },
      {
        name: 'finchannel',
        orgs: ['FIU', 'IND']
      }
    ];

    return channels;
  }
};
