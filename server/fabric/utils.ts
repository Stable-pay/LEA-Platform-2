
import { Wallets } from 'fabric-network';
import path from 'path';
import fs from 'fs';

export async function buildCCP(orgId: string) {
  const ccpPath = path.resolve(__dirname, 'connections', `connection-${orgId}.json`);
  const fileExists = fs.existsSync(ccpPath);
  
  if (!fileExists) {
    throw new Error(`no such file or directory: ${ccpPath}`);
  }

  const contents = fs.readFileSync(ccpPath, 'utf8');
  const ccp = JSON.parse(contents);

  return ccp;
}

export async function buildWallet(orgId: string) {
  const walletPath = path.join(process.cwd(), 'wallet', orgId);
  const wallet = await Wallets.newFileSystemWallet(walletPath);
  return wallet;
}

export async function enrollAdmin(caClient: any, wallet: any, orgMspId: string) {
  try {
    const identity = await wallet.get('admin');
    if (identity) {
      console.log('Admin identity already exists in the wallet');
      return;
    }

    const enrollment = await caClient.enroll({
      enrollmentID: 'admin',
      enrollmentSecret: 'adminpw'
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: 'X.509',
    };

    await wallet.put('admin', x509Identity);
  } catch (error) {
    console.error(`Failed to enroll admin user: ${error}`);
    throw error;
  }
}
