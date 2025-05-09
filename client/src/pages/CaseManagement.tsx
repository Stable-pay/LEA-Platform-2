import { DataTable } from "@/components/ui/data-table";
import { formatWalletAddress, formatDateTime, formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

interface Case {
  id: string;
  title: string;
  walletAddress: string;
  status: "Active" | "Investigating" | "Pending" | "Resolved" | "Critical";
  dateReported: string;
  reportedBy: string;
  estimatedLoss: number;
}

const CaseManagement = () => {
  const [managementCases, setManagementCases] = useState<Case[]>([]);

  useEffect(() => {
    const handleCaseUpdate = (e: CustomEvent) => {
      setManagementCases(prev => [...prev, e.detail]);
    };
    
    window.addEventListener('case-management-update', handleCaseUpdate as EventListener);
    return () => window.removeEventListener('case-management-update', handleCaseUpdate as EventListener);
  }, []);

  const columns: ColumnDef<Case>[] = [
    {
      accessorKey: "id",
      header: "Case ID",
      cell: ({ row }) => {
        return <div className="font-medium">#{row.getValue("id")}</div>;
      },
    },
    {
      accessorKey: "title",
      header: "Case Title",
    },
    {
      accessorKey: "walletAddress",
      header: "Primary Wallet",
      cell: ({ row }) => {
        return (
          <code className="font-mono text-xs bg-neutral-light px-1 py-0.5 rounded">
            {formatWalletAddress(row.getValue("walletAddress"))}
          </code>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        
        const getVariant = () => {
          switch (status.toLowerCase()) {
            case "active":
            case "investigating": 
              return "info";
            case "pending": 
              return "warning";
            case "resolved": 
              return "success";
            case "critical": 
              return "error";
            default: 
              return "secondary";
          }
        };
        
        return <Badge variant={getVariant()}>{status}</Badge>;
      }
    },
    {
      accessorKey: "dateReported",
      header: "Date Reported",
      cell: ({ row }) => {
        return <div>{formatDateTime(row.getValue("dateReported"))}</div>;
      },
    },
    {
      accessorKey: "estimatedLoss",
      header: "Estimated Loss",
      cell: ({ row }) => {
        return <div>{formatCurrency(row.getValue("estimatedLoss"))}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
            <ChevronRight className="h-4 w-4" />
          </Button>
        );
      },
    },
  ];
  
  const data: Case[] = [
    {
      id: "3912",
      title: "Multi-Exchange Fraud",
      walletAddress: "0x7fD23e7d8e2D8",
      status: "Critical",
      dateReported: "2023-06-10T10:23:00",
      reportedBy: "Mumbai Police",
      estimatedLoss: 48000000,
    },
    {
      id: "3889",
      title: "Fake Exchange KYC",
      walletAddress: "0x4eA87c8b3f87B",
      status: "Active",
      dateReported: "2023-06-08T14:45:00",
      reportedBy: "Delhi Police",
      estimatedLoss: 2500000,
    },
    {
      id: "3867",
      title: "Phishing Attempt",
      walletAddress: "0x9bC12d3e4F56a",
      status: "Investigating",
      dateReported: "2023-06-05T09:30:00",
      reportedBy: "Bengaluru Police",
      estimatedLoss: 1800000,
    },
    {
      id: "3823",
      title: "Exchange Withdrawal Fraud",
      walletAddress: "0x3fA45c6D8e9B2",
      status: "Pending",
      dateReported: "2023-05-28T11:15:00",
      reportedBy: "Hyderabad Police",
      estimatedLoss: 3700000,
    },
    {
      id: "3756",
      title: "Mining Pool Scam",
      walletAddress: "0x2eB87a9C1d5F3",
      status: "Resolved",
      dateReported: "2023-05-15T16:20:00",
      reportedBy: "Chennai Police",
      estimatedLoss: 5600000,
    },
  ];
  
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Case Management</h1>
        <p className="text-muted-foreground">
          Manage and track crypto fraud cases across different investigation stages
        </p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">All Cases</h2>
          <Button>New Case</Button>
        </div>
        
        <DataTable 
          columns={columns} 
          data={data} 
          searchKey="title"
          searchPlaceholder="Search cases..."
        />
      </div>
    </div>
  );
};

export default CaseManagement;
