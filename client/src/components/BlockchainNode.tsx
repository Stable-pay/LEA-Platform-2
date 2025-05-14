
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Shield, Link, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface BlockchainNodeProps {
  caseId: string;
  timestamp: string;
  hash: string;
  previousHash: string;
  nodeId: string;
  status: 'pending' | 'verified' | 'rejected';
}

export const BlockchainNode = ({ caseId, timestamp, hash, previousHash, nodeId, status }: BlockchainNodeProps) => {
  const [verificationCount, setVerificationCount] = useState(0);
  const [verificationProgress, setVerificationProgress] = useState(0);

  const { data: nodeTransactions, isLoading } = useQuery({
    queryKey: ['blockchain-transactions', nodeId],
    queryFn: async () => {
      const res = await fetch(`/api/blockchain/transactions/${nodeId}`);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return res.json();
    },
    refetchInterval: status === 'pending' ? 3000 : false
  });

  useEffect(() => {
    if (nodeTransactions?.length) {
      const verifiedTx = nodeTransactions.filter((tx: any) => tx.status === 'verified');
      setVerificationCount(verifiedTx.length);
      setVerificationProgress((verifiedTx.length / nodeTransactions.length) * 100);
    }
  }, [nodeTransactions]);

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4" />
          Case ID: {caseId}
        </CardTitle>
        <Badge variant={status === 'verified' ? 'success' : status === 'pending' ? 'warning' : 'destructive'}>
          {status} ({verificationCount} verifications)
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div className="font-mono break-all bg-muted p-2 rounded">
          <span className="text-muted-foreground">Case Hash:</span> {hash}
        </div>
        <div className="font-mono break-all bg-muted p-2 rounded">
          <span className="text-muted-foreground">Previous Hash:</span> {previousHash}
        </div>
        <div>
          <span className="text-muted-foreground">Timestamp:</span> {new Date(timestamp).toLocaleString()}
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Link className="h-4 w-4" />
            Chain Verification Progress
          </h4>
          <Progress value={verificationProgress} className="h-2 mb-2" />
          <div className="space-y-2">
            {isLoading ? (
              <div className="text-muted-foreground text-center py-2">Loading transactions...</div>
            ) : (
              nodeTransactions?.map((tx: any) => (
                <div key={tx.txHash} className="bg-muted p-2 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <div>TX Hash: {tx.txHash}</div>
                    <Badge variant={tx.status === 'verified' ? 'success' : 'secondary'}>
                      {tx.status}
                    </Badge>
                  </div>
                  <div>Action: {tx.action}</div>
                  <div>Timestamp: {new Date(tx.timestamp).toLocaleString()}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
