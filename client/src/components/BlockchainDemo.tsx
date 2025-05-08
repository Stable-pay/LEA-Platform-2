
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ShieldCheck, Key, LockKeyhole, FileCheck, Database, BarChart4, ArrowRight, CheckCircle2, MapPin, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlockchainNodeProps {
  name: string;
  type: string;
  status: "initiated" | "pending" | "confirmed" | "rejected";
  lastBlock: string;
  location: {
    lat: number;
    lng: number;
    state: string;
  };
  confirmations: NodeConfirmation[];
  details?: string;
}

interface NodeConfirmation {
  department: string;
  timestamp: string;
  status: "pending" | "confirmed" | "rejected";
  details: string;
  signatureHash: string;
}

const BlockchainDemo = () => {
  const { toast } = useToast();
  const [nodes, setNodes] = useState<BlockchainNodeProps[]>([
    {
      name: "LEA Central Node",
      type: "Law Enforcement",
      status: "initiated",
      lastBlock: "1024",
      location: { lat: 28.6139, lng: 77.2090, state: "Delhi" },
      confirmations: [],
      details: "Initial case filing from Delhi Police"
    },
    {
      name: "FIU Node 1",
      type: "Financial Intelligence",
      status: "pending",
      lastBlock: "1024",
      location: { lat: 19.0760, lng: 72.8777, state: "Maharashtra" },
      confirmations: [],
    },
    {
      name: "IND Node",
      type: "Indian Nodal Dept",
      status: "pending",
      lastBlock: "1024",
      location: { lat: 12.9716, lng: 77.5946, state: "Karnataka" },
      confirmations: [],
    },
    {
      name: "I4C Node",
      type: "Cyber Crime Coord",
      status: "pending",
      lastBlock: "1024",
      location: { lat: 26.8467, lng: 80.9462, state: "Uttar Pradesh" },
      confirmations: [],
    }
  ]);

  const [selectedNode, setSelectedNode] = useState<BlockchainNodeProps | null>(null);
  const [confirmationDetails, setConfirmationDetails] = useState("");
  const [heatmapData, setHeatmapData] = useState<{ state: string; intensity: number }[]>([
    { state: "Delhi", intensity: 75 },
    { state: "Maharashtra", intensity: 85 },
    { state: "Karnataka", intensity: 60 },
    { state: "Uttar Pradesh", intensity: 45 }
  ]);

  useEffect(() => {
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
          handleNodeConfirmation(data.nodeName, data.details);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    return () => ws.close();
  }, []);

  const handleNodeConfirmation = (nodeName: string, details: string) => {
    setNodes(prevNodes => 
      prevNodes.map(node => 
        node.name === nodeName ? {
          ...node,
          status: "confirmed",
          confirmations: [
            ...node.confirmations,
            {
              department: node.type,
              timestamp: new Date().toISOString(),
              status: "confirmed",
              details: details,
              signatureHash: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
            }
          ]
        } : node
      )
    );

    toast({
      title: "Node Confirmed",
      description: `${nodeName} has confirmed the case`,
    });
  };

  const confirmNode = () => {
    if (!selectedNode || !confirmationDetails) return;

    handleNodeConfirmation(selectedNode.name, confirmationDetails);
    setConfirmationDetails("");
    setSelectedNode(null);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Blockchain Node Status</CardTitle>
        </CardHeader>
        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="nodes">Nodes</TabsTrigger>
            <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="map">
            <CardContent>
              <div className="h-[500px] relative bg-neutral-100 rounded-lg">
                {/* Map visualization placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p>Interactive India Map</p>
                    <p className="text-sm text-muted-foreground">Shows node locations and status</p>
                  </div>
                </div>
                
                {nodes.map((node) => (
                  <div
                    key={node.name}
                    className="absolute"
                    style={{
                      left: `${((node.location.lng - 70) / 30) * 100}%`,
                      top: `${((node.location.lat - 8) / 30) * 100}%`
                    }}
                  >
                    <Badge
                      className="cursor-pointer"
                      variant={node.status === "confirmed" ? "default" : "outline"}
                      onClick={() => setSelectedNode(node)}
                    >
                      {node.name}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="nodes">
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nodes.map((node) => (
                  <div
                    key={node.name}
                    className={`border rounded-lg p-4 ${
                      selectedNode?.name === node.name ? 'border-primary' : ''
                    }`}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          node.status === 'confirmed' ? 'bg-green-500' :
                          node.status === 'initiated' ? 'bg-blue-500' :
                          node.status === 'rejected' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`} />
                        <div>
                          <div className="font-medium">{node.name}</div>
                          <div className="text-sm text-gray-500">{node.type}</div>
                        </div>
                      </div>
                      <Badge>{node.status}</Badge>
                    </div>

                    {node.details && (
                      <p className="text-sm text-gray-600 mt-2">{node.details}</p>
                    )}

                    {node.confirmations.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {node.confirmations.map((conf, idx) => (
                          <div key={idx} className="text-xs text-gray-500 flex justify-between">
                            <span>{conf.department}</span>
                            <span>{new Date(conf.timestamp).toLocaleTimeString()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {selectedNode && (
                <div className="mt-4 space-y-4">
                  <Alert>
                    <AlertDescription>
                      Confirming node: {selectedNode.name}
                    </AlertDescription>
                  </Alert>
                  <Textarea
                    placeholder="Enter confirmation details..."
                    value={confirmationDetails}
                    onChange={(e) => setConfirmationDetails(e.target.value)}
                  />
                  <Button onClick={confirmNode} disabled={!confirmationDetails}>
                    Confirm Node
                  </Button>
                </div>
              )}
            </CardContent>
          </TabsContent>

          <TabsContent value="heatmap">
            <CardContent>
              <div className="h-[500px] relative bg-neutral-100 rounded-lg">
                {/* Heatmap visualization placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart4 className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p>Cyber Crime Heatmap</p>
                    <p className="text-sm text-muted-foreground">Shows concentration of cases</p>
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow">
                  <div className="grid grid-cols-4 gap-4">
                    {heatmapData.map((data) => (
                      <div key={data.state} className="text-center">
                        <div className="text-sm font-medium">{data.state}</div>
                        <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary"
                            style={{ width: `${data.intensity}%` }}
                          />
                        </div>
                        <div className="text-xs mt-1">{data.intensity}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="network">
            <CardContent>
              <div className="h-[500px] relative bg-neutral-100 rounded-lg">
                {/* Network graph visualization placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <Database className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p>Node Network Graph</p>
                    <p className="text-sm text-muted-foreground">Shows connections between nodes</p>
                  </div>
                </div>

                {nodes.map((node, index) => (
                  <div
                    key={node.name}
                    className="absolute"
                    style={{
                      left: `${50 + 35 * Math.cos(2 * Math.PI * index / nodes.length)}%`,
                      top: `${50 + 35 * Math.sin(2 * Math.PI * index / nodes.length)}%`
                    }}
                  >
                    <Badge
                      className="cursor-pointer"
                      variant={node.status === "confirmed" ? "default" : "outline"}
                    >
                      {node.name}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default BlockchainDemo;
