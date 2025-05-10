
import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlockchainNodeProps {
  caseId: string;
  timestamp: string;
  hash: string;
  previousHash: string;
  nodeId: string;
  status: 'pending' | 'verified' | 'rejected';
}

export const BlockchainNode = ({ caseId, timestamp, hash, previousHash, nodeId, status }: BlockchainNodeProps) => {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">Node ID: {nodeId}</CardTitle>
        <Badge variant={status === 'verified' ? 'success' : status === 'pending' ? 'warning' : 'destructive'}>
          {status}
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
      </CardContent>
    </Card>
  );
};
