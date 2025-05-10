
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';

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

  const { data: nodeTransactions } = useQuery({
    queryKey: ['blockchain-transactions', nodeId],
    queryFn: async () => {
      const res = await fetch(`/api/blockchain/transactions/${nodeId}`);
      if (!res.ok) throw new Error('Failed to fetch transactions');
      return res.json();
    }
  });

  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Node ID: {nodeId}</CardTitle>
        <Badge variant={status === 'verified' ? 'success' : status === 'pending' ? 'warning' : 'destructive'}>
          {status} ({verificationCount} verifications)
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm">
        <div className="font-mono break-all">
          <span className="text-muted-foreground">Hash:</span> {hash}
        </div>
        <div className="font-mono break-all">
          <span className="text-muted-foreground">Previous Hash:</span> {previousHash}
        </div>
        <div>
          <span className="text-muted-foreground">Timestamp:</span> {new Date(timestamp).toLocaleString()}
        </div>
        <div className="mt-4">
          <h4 className="font-medium mb-2">Node Transactions</h4>
          <div className="space-y-2">
            {nodeTransactions?.map((tx: any) => (
              <div key={tx.txHash} className="bg-muted p-2 rounded text-xs">
                <div>TX Hash: {tx.txHash}</div>
                <div>Action: {tx.action}</div>
                <div>Status: {tx.status}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
