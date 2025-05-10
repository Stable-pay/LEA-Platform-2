
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
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
}

const CaseManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

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

  return (
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
      </Tabs>
    </Card>
  );
};

export default CaseManagement;
