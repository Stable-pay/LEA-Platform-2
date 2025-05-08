import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Key, LockKeyhole, FileCheck, Database, BarChart4, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlockchainNodeProps {
  name: string;
  type: string;
  status: "active" | "pending" | "offline";
  lastBlock: string;
  confirmations?: NodeConfirmation[];
}

interface NodeConfirmation {
  timestamp: string;
  confirmationHash: string;
  status: "pending" | "confirmed" | "rejected";
}

const BlockchainDemo = () => {
  const { toast } = useToast();
  const [nodes, setNodes] = useState<BlockchainNodeProps[]>([
    { name: "LEA Central Node", type: "Law Enforcement", status: "active", lastBlock: "1024" },
    { name: "FIU Node 1", type: "Financial Intelligence", status: "active", lastBlock: "1024" },
    { name: "IND Node", type: "Indian Nodal Dept", status: "active", lastBlock: "1024" },
    { name: "I4C Node", type: "Cyber Crime Coord", status: "active", lastBlock: "1024" }
  ]);
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0);

  useEffect(() => {
    // Connect to WebSocket for real-time updates
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.host}/ws`);

    ws.onopen = () => {
      console.log('Connected to WebSocket');
      toast({
        title: "Connected to Blockchain Network",
        description: "Ready to process node confirmations",
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "NODE_CONFIRMATION") {
          handleNodeConfirmation(data.nodeName);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to blockchain network",
        variant: "destructive",
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  const handleNodeConfirmation = (nodeName: string) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.name === nodeName ? {
          ...node,
          confirmations: [
            ...(node.confirmations || []),
            {
              timestamp: new Date().toISOString(),
              confirmationHash: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              status: "confirmed"
            }
          ]
        } : node
      )
    );

    // Move to next node
    setCurrentNodeIndex(prev => (prev + 1) % nodes.length);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Blockchain Node Status</CardTitle>
      </CardHeader>
      <Tabs defaultValue="nodes" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="confirmations">Confirmations</TabsTrigger>
        </TabsList>

        <TabsContent value="nodes">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nodes.map((node, index) => (
                <div 
                  key={node.name}
                  className={`border rounded-lg p-4 ${
                    index === currentNodeIndex ? 'border-primary' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      node.status === 'active' ? 'bg-green-500' : 
                      node.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <div className="font-medium">{node.name}</div>
                      <div className="text-sm text-gray-500">{node.type}</div>
                    </div>
                  </div>

                  {node.confirmations && node.confirmations.length > 0 && (
                    <div className="mt-2 text-xs text-gray-500">
                      Latest confirmation: {new Date(node.confirmations[node.confirmations.length - 1].timestamp).toLocaleTimeString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="status">
          <CardContent>
            <div className="space-y-4">
              {nodes.map((node) => (
                <div key={node.name} className="flex items-center justify-between">
                  <span>{node.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    node.status === 'active' ? 'bg-green-100 text-green-800' :
                    node.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {node.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="confirmations">
          <CardContent>
            <div className="space-y-4">
              {nodes.map((node) => (
                <div key={node.name} className="border-b pb-4">
                  <h3 className="font-medium mb-2">{node.name}</h3>
                  <div className="space-y-2">
                    {node.confirmations?.slice(-3).map((conf, idx) => (
                      <div key={idx} className="text-sm flex justify-between">
                        <span className="font-mono">{conf.confirmationHash.slice(0, 8)}</span>
                        <span>{new Date(conf.timestamp).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default BlockchainDemo;