
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { BlockchainNode } from '@/components/BlockchainNode';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const { data: cases = [], isLoading, error } = useQuery({
    queryKey: ['cases'],
    queryFn: async () => {
      const res = await fetch('/api/cases');
      if (!res.ok) throw new Error('Failed to fetch cases');
      return res.json();
    },
    retry: 2,
    staleTime: 30000,
  });

  const { data: responses = [], isLoading: isLoadingResponses, error: responsesError } = useQuery({
    queryKey: ['case-responses', selectedCase?.caseId],
    queryFn: async () => {
      if (!selectedCase?.caseId) return [];
      const res = await fetch(`/api/cases/response?caseId=${selectedCase.caseId}`);
      if (!res.ok) throw new Error('Failed to fetch responses');
      return res.json();
    },
    enabled: !!selectedCase?.caseId,
    retry: 1,
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

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to submit response');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-responses'] });
      toast({
        title: "Success",
        description: "Your response has been added to the case",
        variant: "default",
      });
      setShowResponseDialog(false);
      setResponseMessage("");
      setAttachments([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit response",
        variant: "destructive",
      });
    }
  });

  const handleResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseMessage.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a response message",
        variant: "destructive",
      });
      return;
    }

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

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load cases. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Case Management
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search cases by ID, title, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="ED">Enforcement Directorate</SelectItem>
                  <SelectItem value="FIU">Financial Intelligence Unit</SelectItem>
                  <SelectItem value="I4C">Cybercrime Coordination</SelectItem>
                  <SelectItem value="IT">Income Tax Department</SelectItem>
                  <SelectItem value="VASP">Virtual Asset Provider</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => queryClient.invalidateQueries(['cases'])}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
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

          <ScrollArea className="h-[600px] pr-4">
            <div className="space-y-4">
              {filteredCases.length === 0 && !isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  No cases found matching your criteria
                </div>
              ) : (
                filteredCases.map((case_) => (
                  <Card 
                    key={case_.caseId} 
                    className="cursor-pointer hover:bg-accent/5 transition-all"
                    onClick={() => setSelectedCase(case_)}
                  >
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <Badge variant="outline" className="mb-2">{case_.caseId}</Badge>
                          <h3 className="text-lg font-semibold">{case_.title}</h3>
                        </div>
                        <Badge 
                          variant={case_.priority === 'high' ? 'destructive' : 'default'}
                        >
                          {case_.priority}
                        </Badge>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <p>Assigned to: {case_.assignedTo}</p>
                        <p>Status: {case_.status}</p>
                        <p className="text-xs">
                          Created: {new Date(case_.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!selectedCase} onOpenChange={(open) => !open && setSelectedCase(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Case Details - {selectedCase?.caseId}
              {isLoadingResponses && <Loader2 className="h-4 w-4 animate-spin" />}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="responses">Responses</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-4">{selectedCase?.title}</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <p className="text-lg">{selectedCase?.status}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Priority</Label>
                      <p className="text-lg">{selectedCase?.priority}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Assigned To</Label>
                      <p className="text-lg">{selectedCase?.assignedTo}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Created At</Label>
                      <p className="text-lg">
                        {new Date(selectedCase?.createdAt || '').toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="responses">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold">Responses</h3>
                    <Button onClick={() => setShowResponseDialog(true)}>
                      Add Response
                    </Button>
                  </div>

                  {responsesError ? (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>
                        Failed to load responses. Please try again.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4 pr-4">
                        {responses.length === 0 ? (
                          <div className="text-center py-8 text-muted-foreground">
                            No responses yet
                          </div>
                        ) : (
                          responses.map((response: Response) => (
                            <Card key={response.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                  <Badge>{response.department}</Badge>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date(response.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm">{response.message}</p>
                                {response.attachments.length > 0 && (
                                  <div className="mt-2">
                                    <Label className="text-muted-foreground">Attachments</Label>
                                    <div className="flex gap-2 mt-1">
                                      {response.attachments.map((attachment, i) => (
                                        <Badge key={i} variant="outline">{attachment}</Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <Badge 
                                  variant={response.status === 'approved' ? 'default' : 'secondary'}
                                  className="mt-2"
                                >
                                  {response.status}
                                </Badge>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="blockchain">
              {selectedCase && (
                <Card>
                  <CardContent className="pt-6">
                    <BlockchainNode
                      caseId={selectedCase.caseId}
                      timestamp={selectedCase.createdAt}
                      hash={selectedCase.blockchainHash || ''}
                      previousHash={selectedCase.previousHash || ''}
                      nodeId={selectedCase.nodeId || ''}
                      status={selectedCase.blockchainStatus || 'pending'}
                    />
                  </CardContent>
                </Card>
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
          <form onSubmit={handleResponseSubmit} className="space-y-4">
            <div>
              <Label>Response Message</Label>
              <Textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Enter your response..."
                className="min-h-[100px]"
                disabled={submitResponseMutation.isPending}
              />
            </div>
            <div>
              <Label>Attachments</Label>
              <Input
                type="file"
                multiple
                onChange={(e) => setAttachments(Array.from(e.target.files || []))}
                disabled={submitResponseMutation.isPending}
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowResponseDialog(false)}
                disabled={submitResponseMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitResponseMutation.isPending}
              >
                {submitResponseMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Response"
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CaseManagement;
