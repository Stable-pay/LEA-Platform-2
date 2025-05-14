
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
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

interface Response {
  id: string;
  caseId: string;
  department: string;
  message: string;
  attachments: string[];
  timestamp: string;
  status: 'pending' | 'approved';
}

const CaseManagement = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [showResponseDialog, setShowResponseDialog] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  
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

  const { data: responses = [] } = useQuery({
    queryKey: ['case-responses', selectedCase?.caseId],
    queryFn: async () => {
      if (!selectedCase?.caseId) return [];
      const res = await fetch(`/api/cases/response?caseId=${selectedCase.caseId}`);
      if (!res.ok) throw new Error('Failed to fetch responses');
      return res.json();
    },
    enabled: !!selectedCase?.caseId,
  });

  const submitResponseMutation = useMutation({
    mutationFn: async (data: { message: string; attachments: string[] }) => {
      const formData = new FormData();
      formData.append('message', data.message);
      formData.append('caseId', selectedCase?.caseId || '');
      formData.append('department', user?.department || '');
      
      attachments.forEach(file => {
        formData.append('attachments', file);
      });

      const res = await fetch('/api/cases/response', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error('Failed to submit response');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-responses'] });
      toast({
        title: "Response Submitted",
        description: "Your response has been added to the case",
      });
      setShowResponseDialog(false);
      setResponseMessage("");
      setAttachments([]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit response",
        variant: "destructive",
      });
    }
  });

  const handleResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseMessage.trim()) return;

    submitResponseMutation.mutate({
      message: responseMessage,
      attachments: attachments.map(file => file.name)
    });
  };

  const filteredCases = cases.filter((case_: Case) => {
    const matchesSearch = case_.caseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         case_.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || case_.assignedTo === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="container mx-auto p-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Case Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                <SelectItem value="LEA">Law Enforcement</SelectItem>
                <SelectItem value="FIU">Financial Intel</SelectItem>
                <SelectItem value="I4C">Cyber Security</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredCases.map((case_) => (
              <Card key={case_.caseId} className="cursor-pointer hover:bg-accent/5" onClick={() => setSelectedCase(case_)}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Badge variant="outline">{case_.caseId}</Badge>
                      <h3 className="text-lg font-semibold mt-2">{case_.title}</h3>
                    </div>
                    <Badge>{case_.priority}</Badge>
                  </div>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <p>Assigned to: {case_.assignedTo}</p>
                    <p>Status: {case_.status}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCase} onOpenChange={(open) => !open && setSelectedCase(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Case Details - {selectedCase?.caseId}</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="responses">Responses</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{selectedCase?.title}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <p>{selectedCase?.status}</p>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <p>{selectedCase?.priority}</p>
                  </div>
                  <div>
                    <Label>Assigned To</Label>
                    <p>{selectedCase?.assignedTo}</p>
                  </div>
                  <div>
                    <Label>Created At</Label>
                    <p>{new Date(selectedCase?.createdAt || '').toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="responses">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">Responses</h3>
                  <Button onClick={() => setShowResponseDialog(true)}>Add Response</Button>
                </div>

                <div className="space-y-4">
                  {responses.map((response: Response) => (
                    <Card key={response.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <Badge>{response.department}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {new Date(response.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-2">{response.message}</p>
                        {response.attachments.length > 0 && (
                          <div className="mt-2">
                            <Label>Attachments</Label>
                            <div className="flex gap-2">
                              {response.attachments.map((attachment, i) => (
                                <Badge key={i} variant="outline">{attachment}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <Badge variant={response.status === 'approved' ? 'success' : 'secondary'} className="mt-2">
                          {response.status}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="blockchain">
              {selectedCase && (
                <BlockchainNode
                  caseId={selectedCase.caseId}
                  timestamp={selectedCase.createdAt}
                  hash={selectedCase.blockchainHash || ''}
                  previousHash={selectedCase.previousHash || ''}
                  nodeId={selectedCase.nodeId || ''}
                  status={selectedCase.blockchainStatus || 'pending'}
                />
              )}
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Response</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleResponseSubmit}>
            <div className="space-y-4">
              <div>
                <Label>Response Message</Label>
                <Textarea
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  placeholder="Enter your response..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label>Attachments</Label>
                <Input
                  type="file"
                  multiple
                  onChange={(e) => setAttachments(Array.from(e.target.files || []))}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowResponseDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={submitResponseMutation.isPending}>
                  {submitResponseMutation.isPending ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Response"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseManagement;
