import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/ui/data-table';
import { apiRequest } from '@/lib/queryClient';

const CaseManagement = () => {
  const [page, setPage] = useState(1);

  const { data: cases, isLoading } = useQuery({
    queryKey: ['cases', page],
    queryFn: () => apiRequest('GET', `/cases?page=${page}`),
  });

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
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseManagement;