import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileUploader } from "@/components/ui/file-uploader";
import { Shield, Users, MessageSquare, AlertTriangle } from "lucide-react";

const DEPARTMENTS = {
  ED: "Enforcement Directorate",
  FIU: "Financial Intelligence Unit",
  I4C: "Indian Cybercrime Coordination Centre",
  IT: "Income Tax Department",
  VASP: "Virtual Asset Service Provider",
  BANK: "Banking Institution"
};

interface NodeCase {
  id: string;
  title: string;
  department: string;
  status: string;
  timestamp: string;
  details: string;
  attachments: File[];
  responses: {
    department: string;
    message: string;
    attachments: File[];
    timestamp: string;
    status: string;
  }[];
  assignedTo: string;
  initiator: string;
  confirmer: string;
  caseId: string;
  dateReported: string;
  reportedBy: string;
  estimatedLoss: number;
  walletAddress: string;
  transactionHash: string;
}

interface NetworkNode {
  id: string;
  type: "validator" | "peer";
  status: "active" | "inactive";
  name: string;
  uptime: number;
  transactions: number;
}

interface Block {
  blockNumber: number;
  hash: string;
  timestamp: string;
  txCount: number;
}

interface Transaction {
  txId: string;
  type: string;
  status: string;
  channel: string;
  submitter: string;
  timestamp: string;
}

const BlockchainDemo = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([
    { blockNumber: 1, hash: "0x123abc", timestamp: "2024-01-01 10:00", txCount: 5 },
    { blockNumber: 2, hash: "0x456def", timestamp: "2024-01-01 10:05", txCount: 3 },
    { blockNumber: 3, hash: "0x789ghi", timestamp: "2024-01-01 10:10", txCount: 7 },
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([
    { txId: "0xabc123", type: "transfer", status: "SUCCESS", channel: "mychannel", submitter: "org1", timestamp: "2024-01-01 10:01" },
    { txId: "0xdef456", type: "invoke", status: "FAILED", channel: "mychannel", submitter: "org2", timestamp: "2024-01-01 10:06" },
    { txId: "0xghi789", type: "transfer", status: "SUCCESS", channel: "mychannel", submitter: "org1", timestamp: "2024-01-01 10:11" },
  ]);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments');
        if (!response.ok) throw new Error('Failed to fetch departments');
        const data = await response.json();
        setDepartments(data);

        // Initialize nodes with department data
        const initialNodes = data.map((dept: string) => ({
          id: `${dept}-node`,
          type: dept.toLowerCase(),
          status: 'active',
          name: `${dept} Node`,
          uptime: 99.9,
          transactions: 0
        }));
        setNodes(initialNodes);

        // Transform department data into nodes
        const transformedNodes = data.map((dept: string) => ({
          id: `${dept}-node`,
          type: 'validator',
          status: 'active',
          name: `${dept} Node`,
          uptime: 99.9,
          transactions: 0
        }));

        setNodes(transformedNodes);
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast({
          title: "Error",
          description: "Failed to fetch departments",
          variant: "destructive"
        });
      }
    };

    fetchDepartments();
  }, []);
  const { toast } = useToast();
  const { user } = useAuth();
  const [wsConnected, setWsConnected] = useState(false);
  const [cases, setCases] = useState<NodeCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<NodeCase | null>(null);
  const [responseDetails, setResponseDetails] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [caseCounts, setCaseCounts] = useState<{ [department: string]: number }>({
    ED: 0, FIU: 0, I4C: 0, IT: 0, VASP: 0, BANK: 0
  });

  const handleCaseSelect = (nodeCase: NodeCase) => {
    setSelectedCase(nodeCase);
    setIsDetailsOpen(true);
  };

  useEffect(() => {
    // Connect to WebSocket using the same host as the page
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const ws = new WebSocket(`${protocol}//${host}/ws`);

    ws.onopen = () => {
      setWsConnected(true);
      toast({
        title: "Connected to blockchain network",
        description: "Receiving real-time updates"
      });
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "NEW_CASE") {
          setCases(prev => [...prev, data.case]);
          updateCaseCounts([...cases, data.case]);
        }
      } catch (error) {
        console.error('WebSocket message parsing error:', error);
      }
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
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, []);

  const updateCaseCounts = (caseList: NodeCase[]) => {
    const counts = { ED: 0, FIU: 0, I4C: 0, IT: 0, VASP: 0, BANK: 0 };
    if (Array.isArray(caseList)) {
      caseList.forEach(c => {
        if (c.department in counts) {
          counts[c.department as keyof typeof counts]++;
        }
      });
    }
    setCaseCounts(counts);
  };

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch('/api/cases', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (Array.isArray(data)) {
          setCases(data);
          updateCaseCounts(data);
        } else {
          setCases([]);
          console.error('Invalid data format received:', data);
        }
      } catch (error) {
        console.error('Error fetching cases:', error);
        setCases([]);
        toast({
          title: "Error",
          description: "Failed to fetch cases. Please try again later.",
          variant: "destructive"
        });
      }
    };

    if (user) {
      fetchCases();
    }
  }, [user]);

  const canViewCaseDetails = (nodeCase: NodeCase) => {
    return user?.department === nodeCase.department ||
           user?.department === nodeCase.assignedTo ||
           user?.department === nodeCase.initiator ||
           user?.department === nodeCase.confirmer;
  };

  const canRespondToCase = (nodeCase: NodeCase) => {
    return (user?.department === nodeCase.assignedTo ||
            user?.department === nodeCase.initiator ||
            user?.department === nodeCase.confirmer) &&
           nodeCase.status !== "closed";
  };

  const getDepartmentRole = (nodeCase: NodeCase) => {
    if (user?.department === nodeCase.assignedTo) return "Assigned Department";
    if (user?.department === nodeCase.initiator) return "Initiator Department";
    if (user?.department === nodeCase.confirmer) return "Confirmer Department";
    return null;
  };

  const submitResponse = async () => {
    if (!selectedCase || !responseDetails.trim()) return;

    try {
      const formData = new FormData();
      formData.append('caseId', selectedCase.id);
      formData.append('department', user?.department || '');
      formData.append('message', responseDetails);
      attachments.forEach(file => formData.append('attachments', file));

      const response = await fetch('/api/cases/response', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to submit response' }));
        throw new Error(errorData.message || 'Failed to submit response');
      }

      const data = await response.json();

      setCases(prev => prev.map(c => {
        if (c.id === selectedCase.id) {
          return {
            ...c,
            responses: [...c.responses, data]
          };
        }
        return c;
      }));

      setResponseDetails('');
      setAttachments([]);

      toast({
        title: 'Response Submitted',
        description: 'Your response has been recorded on the blockchain',
      });
    } catch (error) {
      console.error('Response submission error:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit response',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'NEW_CASE') {
        setCases(prev => [...prev, data.case]);
      } else if (data.type === 'NEW_RESPONSE') {
        setCases(prev => prev.map(c => {
          if (c.id === data.caseId) {
            return {
              ...c,
              responses: [...c.responses, data.response]
            };
          }
          return c;
        }));
      }
    };

    return () => ws.close();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Node Explorer</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Total Nodes</p>
                <Users className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mt-2">{nodes.length}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {nodes.filter(n => n.status === "active").length} Active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Validator Nodes</p>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mt-2">
                {nodes.filter(n => n.type === "validator").length}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {nodes.filter(n => n.type === "validator" && n.status === "active").length} Active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Average Uptime</p>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mt-2">
                {(nodes.reduce((acc, node) => acc + node.uptime, 0) / nodes.length).toFixed(1)}%
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium">Total Transactions</p>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold mt-2">
                {nodes.reduce((acc, node) => acc + node.transactions, 0).toLocaleString()}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Across all nodes</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Network Topology</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] bg-muted/30 rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Network visualization goes here</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Node Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nodes.map(node => (
                  <div key={node.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-lg">
                    <div>
                      <p className="font-medium">{node.name}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant={node.status === "active" ? "success" : "destructive"} className="text-xs">
                          {node.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground ml-2">
                          {node.uptime}% uptime
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {node.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full flex-wrap">
            <TabsTrigger value="all" className="text-xs sm:text-sm">All Cases</TabsTrigger>
            {Object.entries(DEPARTMENTS).map(([key, value]) => (
              <TabsTrigger key={key} value={key} className="text-xs sm:text-sm whitespace-nowrap">
                {key} ({caseCounts[key as keyof typeof caseCounts]})
              </TabsTrigger>
            ))}
            <TabsTrigger value="blocks" className="text-xs sm:text-sm">Blocks</TabsTrigger>
            <TabsTrigger value="transactions" className="text-xs sm:text-sm">Transactions</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 p-4">
                {(!cases || cases.length === 0) ? (
                  <div className="text-center text-muted-foreground py-8">
                    No cases available
                  </div>
                ) : (
                  cases.map((nodeCase) => (
                    <Card
                      key={nodeCase.id}
                      className="cursor-pointer hover:bg-accent/5"
                      onClick={() => handleCaseSelect(nodeCase)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{nodeCase.title}</h3>
                          <Badge variant={nodeCase.status === "confirmed" ? "success" : "secondary"}>
                            {nodeCase.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Assigned to: {DEPARTMENTS[nodeCase.assignedTo as keyof typeof DEPARTMENTS]}</div>
                          <div>Initiator: {DEPARTMENTS[nodeCase.initiator as keyof typeof DEPARTMENTS]}</div>
                          <div>Confirmer: {DEPARTMENTS[nodeCase.confirmer as keyof typeof DEPARTMENTS]}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          {Object.keys(DEPARTMENTS).map(dept => (
            <TabsContent key={dept} value={dept}>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4 p-4">
                  {(!cases || cases.length === 0) ? (
                    <div className="text-center text-muted-foreground py-8">
                      No cases available for {DEPARTMENTS[dept as keyof typeof DEPARTMENTS]}
                    </div>
                  ) : (
                    cases
                      .filter(c => c.department === dept || c.assignedTo === dept || 
                                c.initiator === dept || c.confirmer === dept)
                      .map((nodeCase) => (
                        <Card
                          key={nodeCase.id}
                          className="cursor-pointer hover:bg-accent/5"
                          onClick={() => handleCaseSelect(nodeCase)}
                        >
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                              <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{nodeCase.title}</h3>
                              <Badge variant={nodeCase.status === "confirmed" ? "success" : "secondary"} className="w-fit">
                                {nodeCase.status}
                              </Badge>
                            </div>
                            {nodeCase && (
                              <div className="text-sm text-muted-foreground mt-2">
                                <p>{nodeCase.details}</p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}

      <TabsContent value="blocks">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blocks.map((block) => (
              <Card key={block.hash} className="cursor-pointer hover:bg-accent/5" onClick={() => setSelectedBlock(block)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <Badge variant="outline">Block #{block.blockNumber}</Badge>
                    <span className="text-sm text-muted-foreground">{block.timestamp}</span>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="font-mono text-xs truncate">{block.hash}</div>
                    <div>{block.txCount} transactions</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="transactions">
        <div className="space-y-4">
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {transactions.map((tx) => (
                <Card key={tx.txId}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Badge>{tx.type}</Badge>
                        <span className="text-sm font-mono">{tx.txId}</span>
                      </div>
                      <Badge variant={tx.status === "SUCCESS" ? "success" : "destructive"}>
                        {tx.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <div>Channel: {tx.channel}</div>
                      <div>Submitter: {tx.submitter}</div>
                      <div>Timestamp: {tx.timestamp}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </div>
      </TabsContent>
      </Tabs>
      </CardContent>
    </Card>
  );
};

export default BlockchainDemo;