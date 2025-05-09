
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface NodeStatus {
  nodeId: string;
  department: string;
  status: 'active' | 'syncing' | 'offline';
  lastBlock: string;
}

export const HyperledgerStatus = () => {
  const [nodes, setNodes] = useState<NodeStatus[]>([
    { nodeId: 'ED_001', department: 'Enforcement Directorate', status: 'active', lastBlock: '#2936' },
    { nodeId: 'FIU_001', department: 'Financial Intelligence Unit', status: 'active', lastBlock: '#2936' },
    { nodeId: 'I4C_001', department: 'I4C', status: 'active', lastBlock: '#2936' },
    { nodeId: 'IT_001', department: 'Income Tax', status: 'syncing', lastBlock: '#2935' },
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Hyperledger Fabric Network Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {nodes.map((node) => (
            <div key={node.nodeId} className="flex items-center justify-between p-2 bg-secondary/50 rounded">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  node.status === 'active' ? 'bg-green-500' :
                  node.status === 'syncing' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div>
                  <div className="text-sm font-medium">{node.department}</div>
                  <div className="text-xs text-muted-foreground">{node.nodeId}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {node.status === 'syncing' && (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                <span className="text-xs">{node.lastBlock}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
