
import { Gateway, Wallets } from 'fabric-network';
import FabricCAServices from 'fabric-ca-client';
import { buildCCP, buildWallet } from './utils';

const channelName = 'cyberfraudchannel';
const chaincodeName = 'fraudcase';

const mspOrgs = {
  LEA: 'LEAMSP',
  FIU: 'FIUMSP', 
  I4C: 'I4CMSP',
  IND: 'INDMSP'
};

export const fabricNetwork = {
  async connectToNetwork(orgId: string) {
    try {
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
