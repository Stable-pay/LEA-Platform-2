import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileUploader } from "@/components/ui/file-uploader";
import { format } from "date-fns";
import { FileCheck, Eye, Upload, Shield, AlertTriangle, CheckCircle2 } from "lucide-react";
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
  endorsements: Endorsement[];
  channel: string;
  initiator: string;
  confirmer: string;
}

interface Endorsement {
  department: string;
  status: "endorsed" | "rejected";
  timestamp: string;
  signature: string;
}

const DEPARTMENTS = {
  FIU: "Financial Intelligence Unit",
  ED: "Enforcement Directorate",
  I4C: "Indian Cybercrime Coordination Centre",
  IT: "Income Tax Department",
  VASP: "Virtual Asset Service Provider",
  BANK: "Banking Institution"
};

const CHANNELS = {
  "FIU-BANK": "FIU-Bank Communication",
  "ED-FIU": "ED-FIU Investigation",
  "I4C-ALL": "Cybercrime Coordination",
  "ALL": "Common Channel"
};

const BlockchainDemo = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [cases, setCases] = useState<NodeCase[]>([]);
  const [selectedCase, setSelectedCase] = useState<NodeCase | null>(null);
  const [newCaseDetails, setNewCaseDetails] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [initiator, setInitiator] = useState("");
  const [confirmer, setConfirmer] = useState("");

  useEffect(() => {
    // Subscribe to blockchain events
    const handleEndorsement = (e: CustomEvent) => {
      const { caseId, department, status } = e.detail;
      setCases(prev => prev.map(c => {
        if (c.id === caseId) {
          return {
            ...c,
            endorsements: [...c.endorsements, {
              department,
              status,
              timestamp: new Date().toISOString(),
              signature: `${department}_${Date.now()}`
            }]
          };
        }
        return c;
      }));
    };

    window.addEventListener('blockchain-endorsement', handleEndorsement as EventListener);
    return () => window.removeEventListener('blockchain-endorsement', handleEndorsement as EventListener);
  }, []);

  const initiateCase = () => {
    if (!newCaseDetails || !selectedChannel || !initiator || !confirmer) {
      toast({
        title: "Validation Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const newCase: NodeCase = {
      id: `CASE-${Date.now().toString().slice(-6)}`,
      title: `Case from ${user?.department}`,
      department: user?.department || "FIU",
      status: "initiated",
      timestamp: new Date().toISOString(),
      details: newCaseDetails,
      attachments: attachments.map(file => file.name),
      endorsements: [],
      channel: selectedChannel,
      initiator,
      confirmer
    };

    setCases(prev => [...prev, newCase]);
    clearForm();

    toast({
      title: "Case Initiated",
      description: "New case submitted to Hyperledger Fabric network"
    });
  };

  const endorseCase = (nodeCase: NodeCase) => {
    const endorsement: Endorsement = {
      department: user?.department || "FIU",
      status: "endorsed",
      timestamp: new Date().toISOString(),
      signature: `${user?.department}_${Date.now()}`
    };

    setCases(prev => prev.map(c => {
      if (c.id === nodeCase.id) {
        const newEndorsements = [...c.endorsements, endorsement];
        const allEndorsed = [c.initiator, c.confirmer].every(
          dept => newEndorsements.some(e => e.department === dept)
        );

        return {
          ...c,
          status: allEndorsed ? "confirmed" : "pending",
          endorsements: newEndorsements
        };
      }
      return c;
    }));

    toast({
      title: "Case Endorsed",
      description: "Your endorsement has been recorded on the blockchain"
    });
  };

  const clearForm = () => {
    setNewCaseDetails("");
    setSelectedChannel("");
    setAttachments([]);
    setInitiator("");
    setConfirmer("");
  };

  const canEndorse = (nodeCase: NodeCase) => {
    const hasntEndorsed = !nodeCase.endorsements.some(e => e.department === user?.department);
    const isParticipant = [nodeCase.initiator, nodeCase.confirmer].includes(user?.department || "");
    return hasntEndorsed && isParticipant;
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Hyperledger Fabric Node Network</CardTitle>
      </CardHeader>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All Nodes</TabsTrigger>
          {Object.keys(DEPARTMENTS).map(dept => (
            <TabsTrigger key={dept} value={dept}>{dept}</TabsTrigger>
          ))}
        </TabsList>

        {["all", ...Object.keys(DEPARTMENTS)].map(tab => (
          <TabsContent key={tab} value={tab}>
            <CardContent>
              {tab === user?.department && (
                <Card className="mb-4">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">Submit to Blockchain</h3>
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Enter case details..."
                        value={newCaseDetails}
                        onChange={(e) => setNewCaseDetails(e.target.value)}
                      />
                      <Select value={selectedChannel} onValueChange={setSelectedChannel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Channel" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(CHANNELS).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={initiator} onValueChange={setInitiator}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Initiator" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(DEPARTMENTS).map(([key, value]) => (
                            <SelectItem key={key} value={key}>{value}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Select value={confirmer} onValueChange={setConfirmer}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Confirmer" />
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
                          onClick={initiateCase}
                          disabled={!newCaseDetails || !selectedChannel || !initiator || !confirmer}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Submit to Blockchain
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <ScrollArea className="h-[500px]">
                <div className="space-y-4 p-4">
                  {cases
                    .filter(c => tab === "all" || c.department === tab || 
                              c.initiator === tab || c.confirmer === tab)
                    .map((nodeCase) => (
                      <Card key={nodeCase.id} className="relative">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h3 className="font-semibold">{nodeCase.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(nodeCase.timestamp), "PPpp")}
                              </p>
                            </div>
                            <Badge variant={
                              nodeCase.status === "confirmed" ? "success" :
                              nodeCase.status === "rejected" ? "destructive" : 
                              "secondary"
                            }>
                              {nodeCase.status}
                            </Badge>
                          </div>

                          <div className="mt-2">
                            <p className="text-sm mb-2">{nodeCase.details}</p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {nodeCase.attachments.map((file, idx) => (
                                <Badge key={idx} variant="outline">
                                  <FileCheck className="w-4 h-4 mr-1" />
                                  {file}
                                </Badge>
                              ))}
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">Channel: </span>
                                <Badge variant="outline">{CHANNELS[nodeCase.channel as keyof typeof CHANNELS]}</Badge>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Status: </span>
                                <Badge variant="outline">
                                  {nodeCase.endorsements.length} of 2 Endorsements
                                </Badge>
                              </div>
                            </div>
                            <div className="mt-2 flex gap-2">
                              {nodeCase.endorsements.map((endorsement, idx) => (
                                <Badge key={idx} variant="secondary">
                                  <CheckCircle2 className="w-4 h-4 mr-1" />
                                  {endorsement.department}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 flex justify-end">
                            {canEndorse(nodeCase) && (
                              <Button onClick={() => endorseCase(nodeCase)}>
                                Endorse Case
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </ScrollArea>
            </CardContent>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default BlockchainDemo;