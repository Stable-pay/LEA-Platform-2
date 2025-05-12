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
import { Shield, Users, MessageSquare, AlertTriangle, RefreshCw } from "lucide-react";

const DEPARTMENTS = {
  ED: "Enforcement Directorate",
  FIU: "Financial Intelligence Unit",
  I4C: "Indian Cybercrime Coordination Centre",
  IT: "Income Tax Department",
  VASP: "Virtual Asset Service Provider",
  BANK: "Banking Institution"
};

// Demo data
const DEMO_CASES = [
  {
    id: "case-001",
    caseId: "LEA-2024-001",
    title: "Crypto Ponzi Scheme Investigation",
    department: "ED",
    status: "active",
    timestamp: new Date().toISOString(),
    details: "Large-scale cryptocurrency fraud scheme affecting multiple victims across India",
    attachments: [],
    responses: [],
    assignedTo: "FIU",
    initiator: "ED",
    confirmer: "I4C",
    dateReported: new Date().toISOString(),
    reportedBy: "Mumbai Police",
    estimatedLoss: 5000000,
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
    transactionHash: "0xf7d4d8f9e6c5b4a3b2c1d0e9f8a7b6c5d4e3f2a1"
  },
  {
    id: "case-002",
    caseId: "LEA-2024-002",
    title: "Cross-Border Token Scam",
    department: "FIU",
    status: "investigating",
    timestamp: new Date().toISOString(),
    details: "Investigation into suspicious token transfers across international exchanges",
    attachments: [],
    responses: [],
    assignedTo: "I4C",
    initiator: "FIU",
    confirmer: "ED",
    dateReported: new Date().toISOString(),
    reportedBy: "Delhi Cybercrime",
    estimatedLoss: 3000000,
    walletAddress: "0x123f681adc0c0d1c9f82c5d108b8a259c6c93a26",
    transactionHash: "0xa1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0"
  }
];

const BlockchainDemo = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [wsConnected, setWsConnected] = useState(false);
  const [nodes, setNodes] = useState([]);
  const [cases, setCases] = useState(DEMO_CASES);
  const [selectedCase, setSelectedCase] = useState(null);
  const [responseDetails, setResponseDetails] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [caseCounts, setCaseCounts] = useState({
    ED: 0, FIU: 0, I4C: 0, IT: 0, VASP: 0, BANK: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleCaseSelect = (nodeCase) => {
    setSelectedCase(nodeCase);
    setIsDetailsOpen(true);
  };

  const updateCaseCounts = (caseList) => {
    const counts = { ED: 0, FIU: 0, I4C: 0, IT: 0, VASP: 0, BANK: 0 };
    caseList.forEach(c => {
      if (c.department in counts) {
        counts[c.department]++;
      }
    });
    setCaseCounts(counts);
  };

  // Simulated blockchain verification
  const verifyOnBlockchain = async (caseId) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate network delay
      const updatedCases = cases.map(c => {
        if (c.id === caseId) {
          return {
            ...c,
            status: "confirmed",
            blockchainVerified: true
          };
        }
        return c;
      });
      setCases(updatedCases);
      toast({
        title: "Blockchain Verification",
        description: "Case verified on blockchain network",
      });
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to verify on blockchain",
        variant: "destructive"
      });
    }
    setIsLoading(false);
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

    setIsLoading(true);
    try {
      // Simulate response submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      const newResponse = {
        department: user.department,
        message: responseDetails,
        attachments: attachments,
        timestamp: new Date().toISOString(),
        status: "pending"
      };

      const updatedCases = cases.map(c => {
        if (c.id === selectedCase.id) {
          return {
            ...c,
            responses: [...c.responses, newResponse]
          };
        }
        return c;
      });

      setCases(updatedCases);
      setResponseDetails("");
      setAttachments([]);

      toast({
        title: "Response Submitted",
        description: "Your response has been recorded",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit response",
        variant: "destructive"
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    // Demo data initialization
    updateCaseCounts(cases);

    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setTimeout(() => {
        setWsConnected(true);
        toast({
          title: "Connected",
          description: "Connected to blockchain network"
        });
      }, 1000);
    };

    connectWebSocket();

    // Simulate node status updates
    const nodeInterval = setInterval(() => {
      const demoNodes = Object.keys(DEPARTMENTS).map(dept => ({
        id: `${dept}-node`,
        type: dept.toLowerCase(),
        status: Math.random() > 0.1 ? "operational" : "maintenance",
        name: `${DEPARTMENTS[dept]} Node`,
        uptime: (95 + Math.random() * 5).toFixed(2),
        transactions: Math.floor(Math.random() * 1000)
      }));
      setNodes(demoNodes);
    }, 5000);

    return () => {
      clearInterval(nodeInterval);
    };
  }, []);

  const canViewCaseDetails = (nodeCase) => {
    return user?.department === nodeCase.department ||
           user?.department === nodeCase.assignedTo ||
           user?.department === nodeCase.initiator ||
           user?.department === nodeCase.confirmer;
  };

  const canRespondToCase = (nodeCase) => {
    return (user?.department === nodeCase.assignedTo ||
            user?.department === nodeCase.initiator ||
            user?.department === nodeCase.confirmer) &&
           nodeCase.status !== "closed";
  };

  const getDepartmentRole = (nodeCase) => {
    if (user?.department === nodeCase.assignedTo) return "Assigned Department";
    if (user?.department === nodeCase.initiator) return "Initiator Department";
    if (user?.department === nodeCase.confirmer) return "Confirmer Department";
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Node Explorer</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          <Card>
            <CardHeader className="p-3 sm:p-4">
              <CardTitle className="text-base sm:text-lg flex items-center justify-between">
                <span>Node Status</span>
                <Badge variant={wsConnected ? "success" : "destructive"} className="text-xs">
                  {wsConnected ? "Connected" : "Disconnected"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              <div className="space-y-2 sm:space-y-4">
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
        <Tabs defaultValue="all" className="w-full mt-4">
          <TabsList className="w-full flex-wrap h-auto p-1">
            <TabsTrigger value="all" className="text-xs sm:text-sm px-2 py-1.5 h-auto">All Cases</TabsTrigger>
            {Object.entries(DEPARTMENTS).map(([key, value]) => (
              <TabsTrigger key={key} value={key} className="text-xs sm:text-sm whitespace-nowrap">
                {key} ({caseCounts[key]})
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="all">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4 p-4">
                {cases.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    No cases available
                  </div>
                ) : (
                  cases.map((nodeCase) => (
                    <Card
                      key={nodeCase.id}
                      className="cursor-pointer hover:bg-accent/5 transition-colors"
                      onClick={() => handleCaseSelect(nodeCase)}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-sm sm:text-base line-clamp-2">{nodeCase.title}</h3>
                          <Badge variant={nodeCase.status === "confirmed" ? "success" : "secondary"}>
                            {nodeCase.status}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <div>Assigned to: {DEPARTMENTS[nodeCase.assignedTo]}</div>
                          <div>Initiator: {DEPARTMENTS[nodeCase.initiator]}</div>
                          <div>Confirmer: {DEPARTMENTS[nodeCase.confirmer]}</div>
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
                  {cases.filter(c => c.department === dept || c.assignedTo === dept || 
                              c.initiator === dept || c.confirmer === dept).length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      No cases available for {DEPARTMENTS[dept]}
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
                            <div className="text-sm text-muted-foreground mt-2">
                              <p className="line-clamp-2">{nodeCase.details}</p>
                            </div>
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
            <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto p-3 sm:p-6">
              <DialogHeader className="space-y-2">
                <DialogTitle className="text-lg sm:text-xl line-clamp-2">{selectedCase.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 sm:space-y-4">
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
                          <Button 
                            onClick={() => verifyOnBlockchain(selectedCase.id)}
                            disabled={isLoading || selectedCase.blockchainVerified}
                            className="w-full mt-2"
                          >
                            {isLoading ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Verifying...
                              </>
                            ) : selectedCase.blockchainVerified ? (
                              "Verified on Blockchain"
                            ) : (
                              "Verify on Blockchain"
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Participating Departments</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Assigned</Badge>
                          <span>{DEPARTMENTS[selectedCase.assignedTo]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Initiator</Badge>
                          <span>{DEPARTMENTS[selectedCase.initiator]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Confirmer</Badge>
                          <span>{DEPARTMENTS[selectedCase.confirmer]}</span>
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
                                <Badge>{DEPARTMENTS[response.department]}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(response.timestamp), "PPp")}
                                </span>
                              </div>
                              <p>{response.message}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {canRespondToCase(selectedCase) && (
                      <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
                        <div className="flex items-center gap-2">
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
                            disabled={!responseDetails.trim() || isLoading}
                            className="w-full sm:w-auto"
                          >
                            {isLoading ? (
                              <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              "Submit Department Response"
                            )}
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