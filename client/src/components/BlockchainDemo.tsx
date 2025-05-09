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
}

const BlockchainDemo = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [wsConnected, setWsConnected] = useState(false);
  const [cases, setCases] = useState<NodeCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<NodeCase | null>(null);
  const [responseDetails, setResponseDetails] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [caseCounts, setCaseCounts] = useState<{ [department: string]: number }>({
    ED: 0, FIU: 0, I4C: 0, IT: 0, VASP: 0, BANK: 0
  });

  useEffect(() => {
    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`);

    ws.onopen = () => {
      setWsConnected(true);
      toast({
        title: "Connected to blockchain network",
        description: "Receiving real-time updates"
      });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_CASE") {
        setCases(prev => [...prev, data.case]);
        updateCaseCounts([...cases, data.case]);
      }
    };

    return () => ws.close();
  }, []);

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

  const updateCaseCounts = (caseList: NodeCase[]) => {
    const counts = { ED: 0, FIU: 0, I4C: 0, IT: 0, VASP: 0, BANK: 0 };
    caseList.forEach(c => {
      counts[c.department as keyof typeof counts] = (counts[c.department as keyof typeof counts] || 0) + 1;
    });
    setCaseCounts(counts);
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
      });

      if (!response.ok) {
        throw new Error('Failed to submit response');
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

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch('/api/cases');
        if (response.ok) {
          const data = await response.json();
          setCases(data || []);
          updateCaseCounts(data || []);
        }
      } catch (error) {
        console.error('Error fetching cases:', error);
        setCases([]);
      }
    };

    if (user) {
      fetchCases();
    }
  }, [user, updateCaseCounts]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Node Explorer</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
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
                {cases.map((nodeCase) => (
                  <Card
                    key={nodeCase.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedCase(nodeCase)}
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
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {Object.keys(DEPARTMENTS).map(dept => (
            <TabsContent key={dept} value={dept}>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4 p-4">
                  {cases
                    .filter(c => c.department === dept || c.assignedTo === dept || 
                               c.initiator === dept || c.confirmer === dept)
                    .map((nodeCase) => (
                    <Card
                      key={nodeCase.id}
                      className="cursor-pointer hover:bg-accent/5"
                      onClick={() => setSelectedCase(nodeCase)}
                    >
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-sm sm:text-base line-clamp-1">{nodeCase.title}</h3>
                          <Badge variant={nodeCase.status === "confirmed" ? "success" : "secondary"} className="w-fit">
                            {nodeCase.status}
                          </Badge>
                        </div>
                        {canViewCaseDetails(nodeCase) && (
                          <div className="text-sm text-muted-foreground mt-2">
                            <p>{nodeCase.details}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          ))}
        </Tabs>

        {selectedCase && (
          <Dialog open={!!selectedCase} onOpenChange={() => setSelectedCase(null)}>
            <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedCase.title}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {canViewCaseDetails(selectedCase) ? (
                  <>
                    <div className="bg-muted/30 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Case Details</h4>
                      <p>{selectedCase.details}</p>
                      {selectedCase.attachments.length > 0 && (
                        <div className="mt-3">
                          <h5 className="font-semibold mb-2">Attachments</h5>
                          <div className="flex gap-2">
                            {selectedCase.attachments.map((file, idx) => (
                              <Badge key={idx} variant="secondary">
                                {file.name}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
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

                    {selectedCase.responses.length > 0 && (
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
                              {response.attachments.length > 0 && (
                                <div className="mt-2">
                                  <h6 className="text-sm font-semibold mb-1">Attachments</h6>
                                  <div className="flex gap-2">
                                    {response.attachments.map((file, fileIdx) => (
                                      <Badge key={fileIdx} variant="secondary">
                                        {file.name}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}

                    {canRespondToCase(selectedCase) && (
                      <div className="space-y-4 bg-muted/30 p-4 rounded-lg">
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