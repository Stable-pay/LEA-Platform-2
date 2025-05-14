
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import EmailComposer from '@/components/EmailComposer';
import { BlockchainNode } from '@/components/BlockchainNode';

interface Case {
  caseId: string;
  title: string;
  status: string;
  assignedTo: string;
  createdAt: string;
  priority: string;
  blockchainHash?: string;
  previousHash?: string;
  nodeId?: string;
  blockchainStatus?: string;
  verificationCount?: number;
}

const CaseManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  
  const { data: responses = [], refetch: refetchResponses } = useQuery({
    queryKey: ['case-responses', selectedCase?.caseId],
    queryFn: async () => {
      if (!selectedCase?.caseId) return [];
      const res = await fetch(`/api/cases/response?caseId=${selectedCase.caseId}`);
      if (!res.ok) throw new Error('Failed to fetch responses');
      return res.json();
    },
    enabled: !!selectedCase?.caseId,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cases = [], isLoading } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const res = await fetch('/api/cases');
      if (!res.ok) throw new Error('Failed to fetch cases');
      return res.json();
    },
  });

  const filteredCases = cases.filter((case_: Case) => {
    const matchesSearch = case_.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || case_.assignedTo === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const verifyOnBlockchain = async (caseId: string) => {
    try {
      const response = await fetch('/api/blockchain/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          entityType: 'case',
          entityId: caseId,
          action: 'verify',
          metadata: {
            verifiedAt: new Date().toISOString(),
            verifiedBy: user?.username
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Verification failed');
      }

      toast({
        title: "Verification Started",
        description: "The case is being verified on the blockchain.",
      });

      queryClient.invalidateQueries(['cases']);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to initiate blockchain verification.",
        variant: "destructive",
      });
    }
  };

  const submitResponse = async (message: string) => {
    if (!selectedCase) return;
    
    try {
      const response = await fetch('/api/cases/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          caseId: selectedCase.caseId,
          message,
          department: user?.department,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit response');

      toast({
        title: "Response Submitted",
        description: "Your response has been added to the case",
      });

      setShowResponseDialog(false);
      refetchResponses();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit response",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Response</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
            submitResponse(message);
          }}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="message">Response Message</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Enter your response..."
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowResponseDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Response</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      
      <Card className="shadow">
        <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b">
          <CardTitle className="font-semibold">Private Case Explorer</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground">
            <div className="mr-2 px-2 py-1 bg-green-100 text-green-700 rounded">Active</div>
            Connected to Private Blockchain Network
          </div>
        </CardHeader>

        <Tabs defaultValue="cases" className="w-full">
          <div className="px-6 py-2 border-b">
            <TabsList>
              <TabsTrigger value="cases">Case Explorer</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain Verification</TabsTrigger>
              <TabsTrigger value="responses">Department Responses</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="cases">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-3 mb-4">
                <div className="relative flex-1">
                  <Input
                    type="text"
                    placeholder="Search by case ID or title"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      <SelectItem value="LEA">Law Enforcement</SelectItem>
                      <SelectItem value="FIU">Financial Intel</SelectItem>
                      <SelectItem value="CERT">Cyber Security</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                {filteredCases.map((case_: Case) => (
                  <Card
                    key={case_.caseId}
                    className="cursor-pointer hover:bg-accent/5"
                    onClick={() => setSelectedCase(case_)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">{case_.caseId}</span>
                          <Badge variant={case_.status === "active" ? "success" : "secondary"}>
                            {case_.status}
                          </Badge>
                        </div>
                        <Badge variant="outline">{case_.priority}</Badge>
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold">{case_.title}</h3>
                        <div className="text-sm text-muted-foreground">
                          <div>Assigned to: {case_.assignedTo}</div>
                          <div>Created: {new Date(case_.createdAt).toLocaleString()}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center">
                          <Badge 
                            variant={
                              case_.blockchainStatus === 'verified' ? 'success' :
                              case_.blockchainStatus === 'pending' ? 'warning' : 'destructive'
                            }
                            className="text-xs"
                          >
                            {case_.blockchainStatus || 'pending'} 
                            {case_.verificationCount ? ` (${case_.verificationCount})` : ''}
                          </Badge>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            verifyOnBlockchain(case_.caseId);
                          }}
                          disabled={case_.blockchainStatus === 'verified'}
                        >
                          Verify on Blockchain
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </TabsContent>

          <TabsContent value="blockchain">
            <CardContent className="p-4">
              {selectedCase ? (
                <BlockchainNode
                  caseId={selectedCase.caseId}
                  timestamp={selectedCase.createdAt}
                  hash={selectedCase.blockchainHash || ''}
                  previousHash={selectedCase.previousHash || ''}
                  nodeId={selectedCase.nodeId || ''}
                  status={selectedCase.blockchainStatus || 'pending'}
                />
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Select a case to view blockchain verification details
                </div>
              )}
            </CardContent>
          </TabsContent>

          <TabsContent value="responses">
            <CardContent className="p-4">
              {selectedCase && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Responses for Case {selectedCase.caseId}</h3>
                    <Button onClick={() => setShowResponseDialog(true)} size="sm">
                      Add Response
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {responses?.map((response) => (
                      <Card key={response.id} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <Badge>{response.department}</Badge>
                            <span className="text-sm text-muted-foreground ml-2">
                              {new Date(response.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <Badge variant={response.status === 'pending' ? 'secondary' : 'success'}>
                            {response.status}
                          </Badge>
                        </div>
                        <p className="text-sm mt-2">{response.message}</p>
                        {response.attachments?.length > 0 && (
                          <div className="mt-2">
                            <div className="text-sm font-medium">Attachments:</div>
                            <div className="flex gap-2 mt-1">
                              {response.attachments.map((attachment, i) => (
                                <Badge variant="outline" key={i}>
                                  {attachment}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
};

export default CaseManagement;
