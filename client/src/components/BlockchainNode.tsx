
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

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
  const [peerNodes, setPeerNodes] = useState<string[]>([]);

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
    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'PEER_VERIFICATION') {
        setPeerNodes(prev => [...prev, data.nodeId]);
        setVerificationCount(prev => prev + 1);
      }
    };

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (nodeTransactions?.length) {
      const verifiedTx = nodeTransactions.filter((tx: any) => tx.status === 'verified');
      setVerificationCount(verifiedTx.length);
      setVerificationProgress((verifiedTx.length / nodeTransactions.length) * 100);
    }
  }, [nodeTransactions]);

  return (
    <Card className="w-full">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold">Node ID: {nodeId}</h3>
          <Badge variant={status === 'verified' ? 'success' : status === 'pending' ? 'warning' : 'destructive'}>
            {status}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div>Case ID: {caseId}</div>
          <div className="font-mono text-xs truncate">Hash: {hash}</div>
          <div className="font-mono text-xs truncate">Previous: {previousHash}</div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Peer Verification Progress</span>
            <span>{verificationCount} nodes</span>
          </div>
          <Progress value={verificationProgress} />
        </div>

        {peerNodes.length > 0 && (
          <div className="space-y-1">
            <div className="text-sm font-medium">Verifying Peers</div>
            <div className="flex flex-wrap gap-1">
              {peerNodes.map((peer, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {peer}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          Last Updated: {new Date(timestamp).toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};
