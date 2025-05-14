import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import * as d3 from 'd3';

interface BlockchainNode {
  id: string;
  type: string;
  status: string;
  lastSeen: Date;
}

export const BlockchainDemo = () => {
  const [nodes, setNodes] = useState<BlockchainNode[]>([]);
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const ws = new WebSocket('wss://0.0.0.0:5000/ws');

    ws.onopen = () => {
      console.log('Connected to blockchain network');
      setWsConnection(ws);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleBlockchainUpdate(data);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to blockchain network",
        variant: "destructive"
      });
    };

    return () => {
      if (wsConnection) {
        wsConnection.close();
      }
    };
  }, []);

  const handleBlockchainUpdate = (data: any) => {
    switch (data.type) {
      case 'NODE_UPDATE':
        setNodes(prev => [...prev, data.node]);
        break;
      case 'TRANSACTION_VERIFIED':
        toast({
          title: "Transaction Verified",
          description: `Transaction ${data.txHash} verified by ${data.verifier}`,
          variant: "success"
        });
        break;
    }
  };

  useEffect(() => {
    if (nodes.length > 0) {
      renderNetworkGraph();
    }
  }, [nodes]);

  const renderNetworkGraph = () => {
    const svg = d3.select("#network-graph");
    // D3 visualization implementation
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Blockchain Network Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div id="network-graph" className="w-full h-[400px] bg-neutral-50 dark:bg-neutral-900 rounded-lg">
          {/* D3 visualization will be rendered here */}
        </div>
        <div className="mt-4 space-y-2">
          <h3 className="text-lg font-semibold">Connected Nodes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((node, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <p className="font-medium">{node.id}</p>
                <p className="text-sm text-neutral-500">{node.type}</p>
                <p className="text-xs text-neutral-400">
                  Last seen: {new Date(node.lastSeen).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlockchainDemo;