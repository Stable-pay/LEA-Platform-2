
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUploader } from "@/components/ui/file-uploader";
import { format } from "date-fns";
import { LucideFileX, FileCheck, Eye, Upload, Shield, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface NodeCase {
  id: string;
  title: string;
  department: string;
  status: "initiated" | "pending" | "confirmed" | "rejected";
  timestamp: string;
  details: string;
  attachments: string[];
  responses: NodeResponse[];
  assignedTo?: string;
  initiator?: string;
  confirmer?: string;
  caseCounts?: { [key: string]: number };
}

interface NodeResponse {
  department: string;
  details: string;
  attachments: string[];
  timestamp: string;
  status: "confirmed" | "rejected";
}

const DEPARTMENTS = {
  ED: "Enforcement Directorate",
  FIU: "Financial Intelligence Unit",
  I4C: "Indian Cybercrime Coordination Centre",
  IT: "Income Tax Department",
  VASP: "Virtual Asset Service Provider",
  BANK: "Banking Institution"
};

const BlockchainDemo = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [cases, setCases] = useState<NodeCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<NodeCase | null>(null);
  const [newCaseDetails, setNewCaseDetails] = useState("");
  const [responseDetails, setResponseDetails] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [assignToDepartment, setAssignToDepartment] = useState("");
  const [taskInitiator, setTaskInitiator] = useState("");
  const [taskConfirmer, setTaskConfirmer] = useState("");
  const [caseCounts, setCaseCounts] = useState<{ [department: string]: number }>({
    ED: 0,
    FIU: 0,
    I4C: 0,
    IT: 0,
    VASP: 0,
    BANK: 0
  });

  useEffect(() => {
    // Subscribe to case filing and management events
    const handleNewCase = (e: CustomEvent) => {
      const newCase: NodeCase = {
        id: `CASE-${Date.now().toString().slice(-3)}`,
        title: e.detail.title,
        department: e.detail.initiatorDepartment,
        status: "initiated",
        timestamp: new Date().toISOString(),
        details: e.detail.description,
        attachments: e.detail.attachments || [],
        responses: [],
        assignedTo: e.detail.assignedDepartment,
        initiator: e.detail.initiatorDepartment,
        confirmer: e.detail.confirmerDepartment
      };

      setCases(prev => {
        const updated = [...prev, newCase];
        updateCaseCounts(updated);
        return updated;
      });
    };

    window.addEventListener('new-case-filed', handleNewCase as EventListener);
    return () => window.removeEventListener('new-case-filed', handleNewCase as EventListener);
  }, []);

  const updateCaseCounts = (caseList: NodeCase[]) => {
    const counts = { ED: 0, FIU: 0, I4C: 0, IT: 0, VASP: 0, BANK: 0 };
    caseList.forEach(c => {
      counts[c.department] = (counts[c.department] || 0) + 1;
    });
    setCaseCounts(counts);
  };

  const canViewCaseDetails = (nodeCase: NodeCase) => {
    return user?.department === nodeCase.department || 
           user?.department === nodeCase.assignedTo ||
           user?.department === nodeCase.initiator ||
           user?.department === nodeCase.confirmer;
  };

  const initiateNewCase = () => {
    if (!newCaseDetails || !attachments.length || !assignToDepartment || !taskInitiator || !taskConfirmer) return;

    const newCase: NodeCase = {
      id: `CASE-${Date.now().toString().slice(-3)}`,
      title: `New Case from ${user?.department}`,
      department: user?.department || "ED",
      status: "initiated",
      timestamp: new Date().toISOString(),
      details: newCaseDetails,
      attachments: attachments.map(file => file.name),
      responses: [],
      assignedTo: assignToDepartment,
      initiator: taskInitiator,
      confirmer: taskConfirmer
    };

    setCases(prev => {
      const updated = [...prev, newCase];
      updateCaseCounts(updated);
      return updated;
    });

    setNewCaseDetails("");
    setAttachments([]);
    setAssignToDepartment("");
    setTaskInitiator("");
    setTaskConfirmer("");

    toast({
      title: "Case Initiated",
      description: "New case has been added to the blockchain network",
    });
  };

  const submitResponse = () => {
    if (!selectedCase || !responseDetails || !attachments.length) return;

    const response: NodeResponse = {
      department: user?.department || "ED",
      details: responseDetails,
      attachments: attachments.map(file => file.name),
      timestamp: new Date().toISOString(),
      status: "confirmed"
    };

    setCases(prev => prev.map(c =>
      c.id === selectedCase.id
        ? {
            ...c,
            status: "confirmed",
            responses: [...c.responses, response]
          }
        : c
    ));

    setResponseDetails("");
    setAttachments([]);

    toast({
      title: "Response Submitted",
      description: "Your response has been recorded on the blockchain",
    });
  };

  const renderCaseList = (department: string) => (
    <ScrollArea className="h-[400px]">
      <div className="space-y-4 p-4">
        {cases
          .filter(c => department === "all" || 
                      c.department === department || 
                      c.assignedTo === department ||
                      c.initiator === department ||
                      c.confirmer === department)
          .map((nodeCase) => (
          <Card
            key={nodeCase.id}
            className={`cursor-pointer ${
              selectedCase?.id === nodeCase.id ? 'border-primary' : ''
            }`}
            onClick={() => setSelectedCase(nodeCase)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-semibold">{nodeCase.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(nodeCase.timestamp), "PPpp")}
                  </p>
                </div>
                <Badge variant={nodeCase.status === "confirmed" ? "success" : "secondary"}>
                  {nodeCase.status}
                </Badge>
              </div>

              {canViewCaseDetails(nodeCase) ? (
                <>
                  <p className="text-sm mt-2">{nodeCase.details}</p>
                  <div className="flex gap-2 mt-2">
                    {nodeCase.attachments.map((file, idx) => (
                      <Badge key={idx} variant="outline">
                        <FileCheck className="w-4 h-4 mr-1" />
                        {file}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-2 text-sm">
                    <span className="text-muted-foreground">Assigned to: </span>
                    <Badge variant="outline">{DEPARTMENTS[nodeCase.assignedTo as keyof typeof DEPARTMENTS]}</Badge>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="text-muted-foreground">Initiator: </span>
                    <Badge variant="outline">{DEPARTMENTS[nodeCase.initiator as keyof typeof DEPARTMENTS]}</Badge>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="text-muted-foreground">Confirmer: </span>
                    <Badge variant="outline">{DEPARTMENTS[nodeCase.confirmer as keyof typeof DEPARTMENTS]}</Badge>
                  </div>
                </>
              ) : (
                <Alert className="mt-2">
                  <Shield className="w-4 h-4" />
                  <AlertDescription>
                    Limited access. Only initiating and assigned departments can view details.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Department Node Explorer</CardTitle>
      </CardHeader>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All Nodes</TabsTrigger>
          <TabsTrigger value="ED">ED</TabsTrigger>
          <TabsTrigger value="FIU">FIU</TabsTrigger>
          <TabsTrigger value="I4C">I4C</TabsTrigger>
          <TabsTrigger value="IT">Income Tax</TabsTrigger>
          <TabsTrigger value="VASP">VASP</TabsTrigger>
          <TabsTrigger value="BANK">BANK</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <CardContent>
            {renderCaseList("all")}
          </CardContent>
        </TabsContent>

        {Object.keys(DEPARTMENTS).map(dept => (
          <TabsContent key={dept} value={dept}>
            <CardContent>
              {dept === user?.department && (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Initiate New Case</h3>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Enter case details..."
                        value={newCaseDetails}
                        onChange={(e) => setNewCaseDetails(e.target.value)}
                      />
                      <Select
                        value={assignToDepartment}
                        onValueChange={setAssignToDepartment}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Assign to Department" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(DEPARTMENTS).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={taskInitiator}
                        onValueChange={setTaskInitiator}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Task Initiator" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(DEPARTMENTS).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select
                        value={taskConfirmer}
                        onValueChange={setTaskConfirmer}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Task Confirmer" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(DEPARTMENTS).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <div className="flex items-center gap-4">
                        <FileUploader
                          onFilesSelected={setAttachments}
                          maxFiles={5}
                          accept=".pdf,.doc,.docx,.jpg,.png"
                        />
                        <Button
                          onClick={initiateNewCase}
                          disabled={!newCaseDetails || !attachments.length || !assignToDepartment || !taskInitiator || !taskConfirmer}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Create Node
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {renderCaseList(dept)}
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>

      {selectedCase && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="m-4">
              <Eye className="w-4 h-4 mr-2" />
              View Case Details
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Case Details - {selectedCase.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {canViewCaseDetails(selectedCase) ? (
                <>
                  <div className="space-y-2">
                    <h4 className="font-semibold">Details</h4>
                    <p>{selectedCase.details}</p>
                    <div className="flex gap-2">
                      {selectedCase.attachments.map((file, idx) => (
                        <Badge key={idx} variant="outline">
                          <FileCheck className="w-4 h-4 mr-1" />
                          {file}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {selectedCase.responses.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Responses</h4>
                      <div className="space-y-2">
                        {selectedCase.responses.map((response, idx) => (
                          <Card key={idx}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{DEPARTMENTS[response.department as keyof typeof DEPARTMENTS]}</span>
                                <Badge>{response.status}</Badge>
                              </div>
                              <p className="text-sm">{response.details}</p>
                              <div className="flex gap-2 mt-2">
                                {response.attachments.map((file, fileIdx) => (
                                  <Badge key={fileIdx} variant="outline">
                                    <FileCheck className="w-4 h-4 mr-1" />
                                    {file}
                                  </Badge>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCase.status !== "confirmed" && user?.department !== selectedCase.department && (
                    <div className="space-y-4">
                      <h4 className="font-semibold">Submit Response</h4>
                      <Textarea
                        placeholder="Enter your response..."
                        value={responseDetails}
                        onChange={(e) => setResponseDetails(e.target.value)}
                      />
                      <div className="flex items-center gap-4">
                        <FileUploader
                          onFilesSelected={setAttachments}
                          maxFiles={5}
                          accept=".pdf,.doc,.docx,.jpg,.png"
                        />
                        <Button onClick={submitResponse} disabled={!responseDetails || !attachments.length}>
                          Submit Response
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
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default BlockchainDemo;
