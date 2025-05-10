
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { BlockchainNode } from '@/components/BlockchainNode';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const CaseManagement = () => {
  const [page, setPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState(null);
  const [ws, setWs] = useState<WebSocket | null>(null);

  const { data: cases, isLoading } = useQuery({
    queryKey: ['cases', page],
    queryFn: () => fetch(`/api/cases?page=${page}`).then(res => res.json()),
  });

  const { data: blockchainNodes } = useQuery({
    queryKey: ['blockchain-nodes'],
    queryFn: () => fetch('/api/blockchain/nodes').then(res => res.json()),
  });

  useEffect(() => {
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${wsProtocol}//${window.location.host}/ws`);
    
    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'SUBSCRIBE_BLOCKCHAIN' }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'BLOCKCHAIN_UPDATE') {
        // Handle blockchain updates
      }
    };

    setWs(socket);
    return () => socket?.close();
  }, []);

  const columns = [
    { accessorKey: 'caseId', header: 'Case ID' },
    { accessorKey: 'title', header: 'Title' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'priority', header: 'Priority' },
    { accessorKey: 'assignedTo', header: 'Assigned To' },
    { accessorKey: 'createdAt', header: 'Created At' },
  ];

  return (
    <div className="container mx-auto py-6">
      <Tabs defaultValue="cases">
        <TabsList>
          <TabsTrigger value="cases">Cases</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain Network</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cases">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Case Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div>Loading...</div>
                  ) : (
                    <DataTable 
                      columns={columns} 
                      data={cases || []}
                      searchKey="caseId"
                      onRowClick={setSelectedCase}
                    />
                  )}
                </CardContent>
              </Card>
            </div>
            
            {selectedCase && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Blockchain Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BlockchainNode
                      caseId={selectedCase.caseId}
                      timestamp={selectedCase.createdAt}
                      hash={selectedCase.blockchainHash || ''}
                      previousHash={selectedCase.previousHash || ''}
                      nodeId={selectedCase.nodeId || 'NODE_001'}
                      status={selectedCase.blockchainStatus || 'pending'}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="blockchain">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blockchainNodes?.map((node: any) => (
              <Card key={node.nodeId} className="bg-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      {node.organization}
                      <Badge className="ml-2" variant={node.status === 'active' ? 'success' : 'destructive'}>
                        {node.status}
                      </Badge>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div>Node ID: {node.nodeId}</div>
                    <div>Type: {node.nodeType}</div>
                    <div>Last Sync: {new Date(node.lastSyncTimestamp).toLocaleString()}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaseManagement;
