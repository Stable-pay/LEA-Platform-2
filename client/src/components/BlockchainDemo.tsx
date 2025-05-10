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
  status: "active" | "inactive" | "operational";
  name: string;
  uptime: number;
  transactions: number;
}

const BlockchainDemo = () => {
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);

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

        // Verify node status for logged in department
        if (user?.department) {
          const nodeStatus = await fetch(`/api/blockchain/nodes?type=${user.department}`);
          const nodeData = await nodeStatus.json();

          toast({
            title: `${user.department} Node Status`,
            description: `Department node is ${nodeData[0]?.status || 'inactive'}`,
            variant: nodeData[0]?.status === 'active' ? 'default' : 'destructive'
          });
        }

        setNodes(initialNodes);

        // Transform department data into nodes
        const transformedNodes = data.map((dept: string) => ({
          id: `${dept}-node`,
          type: dept.toLowerCase(),
          status: 'operational',
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
    if (!selectedCase || !responseDetails.trim() || !user?.department) {
      toast({
        title: "Error",
        description: "Missing required fields",
        variant: "destructive"
      });
      return;
    }

    try {
      // Validate required fields
      if (!selectedCase || !responseDetails.trim() || !user?.department) {
        throw new Error('Missing required fields: caseId, message, or department');
      }

      // Create JSON payload instead of FormData
      const payload = {
        caseId: selectedCase.caseId,
        message: responseDetails.trim(),
        department: user.department,
        attachments: attachments || []
      };

      const response = await fetch('/api/cases/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
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
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Node Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nodes.map(node => (
                  <div key={node.id} className={`flex items-center justify-between p-2 ${user?.department === node.type.toUpperCase() ? 'bg-primary/10' : 'bg-muted/30'} rounded-lg`}>
                      <div>
                        <p className="font-medium">{node.name}</p>
                        <div className="flex items-center mt-1">
                          <Badge variant={node.status === "operational" ? "success" : "secondary"} className="text-xs">
                            {node.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-2">
                            {node.uptime}% uptime
                          </span>
                          {user?.department === node.type.toUpperCase() && (
                            <Badge variant="outline" className="ml-2 text-xs">Current Node</Badge>
                          )}
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
        </Tabs>

        {selectedCase && (
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedCase.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {canViewCaseDetails(selectedCase) ? (
                  <>
                    <div className="bg-muted/30 p-4 rounded-lg space-y-4">
                        <div>
                          <h4 className="font-semibold mb-3">Case Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Case ID</p>
                              <p className="font-medium">{selectedCase.caseId}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Date Reported</p>
                              <p className="font-medium">{format(new Date(selectedCase.dateReported), "PPp")}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Reported By</p>
                              <p className="font-medium">{selectedCase.reportedBy}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Estimated Loss</p>
                              <p className="font-medium">₹{selectedCase.estimatedLoss.toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="bg-background/50 p-4 rounded">
                            <h5 className="font-medium mb-2">Description</h5>
                            <p className="whitespace-pre-wrap">{selectedCase.details}</p>
                          </div>
                        </div>

                        {selectedCase.attachments && selectedCase.attachments.length > 0 && (
                          <div>
                            <h5 className="font-semibold mb-2">Case Attachments</h5>
                            <div className="flex flex-wrap gap-2">
                              {selectedCase.attachments.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-1 p-1 bg-background rounded">
                                  <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
                                    {file.name}
                                  </Badge>
                                  <a 
                                    href={URL.createObjectURL(file)}
                                    download={file.name}
                                    className="text-xs text-blue-500 hover:text-blue-700"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Download
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <h5 className="font-semibold mb-2">Blockchain Details</h5>
                          <div className="bg-background/50 p-3 rounded space-y-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Wallet Address</p>
                              <p className="font-mono text-sm break-all">{selectedCase.walletAddress}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Transaction Hash</p>
                              <p className="font-mono text-sm break-all">{selectedCase.transactionHash}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Participating Departments</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Assigned</Badge>
                          <span>{DEPARTMENTS[selectedCase.assignedTo as keyof typeof DEPARTMENTS]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Initiator</Badge>
                          <span>{DEPARTMENTS[selectedCase.initiator as keyof typeof DEPARTMENTS]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Confirmer</Badge>
                          <span>{DEPARTMENTS[selectedCase.confirmer as keyof typeof DEPARTMENTS]}</span>
                        </div>
                      </div>
                    </div>

                    {selectedCase.responses && selectedCase.responses.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold">Department Responses</h4>
                        {selectedCase.responses.map((response, idx) => (
                          <Card key={idx}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <Badge>{DEPARTMENTS[response.department as keyof typeof DEPARTMENTS]}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(response.timestamp), "PPp")}
                                </span>
                              </div>
                              <p>{response.message}</p>
                              <div className="mt-2">
                              <h6 className="text-sm font-semibold mb-1">Attachments</h6>
                              <div className="flex flex-wrap gap-2">
                                {response.attachments.map((file, fileIdx) => (
                                  <div key={fileIdx} className="flex items-center gap-1 p-1 bg-muted rounded">
                                    <Badge variant="secondary" className="cursor-pointer hover:bg-accent">
                                      {file.name}
                                    </Badge>
                                    <a 
                                      href={URL.createObjectURL(file)}
                                      download={file.name}
                                      className="text-xs text-blue-500 hover:text-blue-700"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      Download
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

{selectedCase.responses && selectedCase.responses.length > 0 && (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <h4 className="font-semibold">Department Responses</h4>
      <Badge variant="outline">Chain of Custody</Badge>
    </div>
    <div className="grid gap-4">
      {/* Initiator Response */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Badge>Initiator</Badge>
            {DEPARTMENTS[selectedCase.initiator as keyof typeof DEPARTMENTS]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCase.responses.find(r => r.department === selectedCase.initiator) ? (
            <div className="text-sm">
              {selectedCase.responses.find(r => r.department === selectedCase.initiator)?.message}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Awaiting response...</div>
          )}
        </CardContent>
      </Card>

      {/* Confirmer Response */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Badge>Confirmer</Badge>
            {DEPARTMENTS[selectedCase.confirmer as keyof typeof DEPARTMENTS]}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedCase.responses.find(r => r.department === selectedCase.confirmer) ? (
            <div className="text-sm">
              {selectedCase.responses.find(r => r.department === selectedCase.confirmer)?.message}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">Awaiting response...</div>
          )}
        </CardContent>
      </Card>
    </div>
  </div>
)}

{canRespondToCase(selectedCase) && (
  <div className="space-y-4 bg-muted/30 p-4 rounded-lg mt-4">
    <div className="flex items-center gap-2 mb-4">
      <h4 className="font-semibold">Submit Department Response</h4>
      <Badge variant="outline">
        {getDepartmentRole(selectedCase)}
      </Badge>
    </div>
                        <Textarea
                          placeholder="Enter your department's official response..."
                          value={responseDetails}
                          onChange={(e) => setResponseDetails(e.target.value)}
                          className="min-h-[100px]"
                        />
                        <div className="space-y-4">
                          <div className="bg-background/50 p-4 rounded-md">
                            <h5 className="text-sm font-medium mb-2">Attachments</h5>
                            <FileUploader
                              onFilesSelected={setAttachments}
                              maxFiles={5}
                              accept=".pdf,.doc,.docx,.jpg,.png"
                            />
                            {attachments.length > 0 && (
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground">
                                  {attachments.length} file(s) selected
                                </p>
                              </div>
                            )}
                          </div>
                          <Button 
                            onClick={submitResponse} 
                            disabled={!responseDetails.trim()}
                            className="w-full sm:w-auto"
                          >
                            Submit Department Response
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      You don't have permission to view the complete case details.
                      Only participating departments can access this information.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
};

export default BlockchainDemo;