import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { formatDateTime, formatWalletAddress } from "@/lib/utils";
import { Search, Calendar, Filter } from "lucide-react";

interface SuspiciousPattern {
  id: string;
  pattern: string;
  detectedAt: string;
  walletAddress: string;
  transactionCount: number;
  volume: string;
  riskLevel: "High" | "Medium" | "Low";
}

const PatternScan = () => {
  const columns: ColumnDef<SuspiciousPattern>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => {
        return <div className="font-medium">#{row.getValue("id")}</div>;
      },
    },
    {
      accessorKey: "pattern",
      header: "Pattern",
    },
    {
      accessorKey: "detectedAt",
      header: "Detected At",
      cell: ({ row }) => {
        return <div>{formatDateTime(row.getValue("detectedAt"))}</div>;
      },
    },
    {
      accessorKey: "walletAddress",
      header: "Wallet Address",
      cell: ({ row }) => {
        return (
          <code className="font-mono text-xs bg-neutral-light px-1 py-0.5 rounded">
            {formatWalletAddress(row.getValue("walletAddress"))}
          </code>
        );
      },
    },
    {
      accessorKey: "transactionCount",
      header: "Tx Count",
    },
    {
      accessorKey: "volume",
      header: "Volume",
    },
    {
      accessorKey: "riskLevel",
      header: "Risk Level",
      cell: ({ row }) => {
        const riskLevel = row.getValue("riskLevel") as string;
        
        const getVariant = () => {
          switch (riskLevel.toLowerCase()) {
            case "high": return "error";
            case "medium": return "warning";
            case "low": return "info";
            default: return "secondary";
          }
        };
        
        return <Badge variant={getVariant()}>{riskLevel}</Badge>;
      },
    },
    {
      id: "actions",
      cell: () => {
        return (
          <Button size="sm" variant="outline">
            Details
          </Button>
        );
      },
    },
  ];
  
  const data: SuspiciousPattern[] = [
    {
      id: "PS-1234",
      pattern: "Layering Through Multiple Wallets",
      detectedAt: "2023-06-12T14:30:00",
      walletAddress: "0x7fD23e7d8e2D8",
      transactionCount: 32,
      volume: "₹48,00,000",
      riskLevel: "High",
    },
    {
      id: "PS-1233",
      pattern: "Mixing Service Usage",
      detectedAt: "2023-06-12T10:15:00",
      walletAddress: "0x4eA87c8b3f87B",
      transactionCount: 15,
      volume: "₹25,00,000",
      riskLevel: "High",
    },
    {
      id: "PS-1232",
      pattern: "Rapid Exchange Transfers",
      detectedAt: "2023-06-11T18:45:00",
      walletAddress: "0x9bC12d3e4F56a",
      transactionCount: 8,
      volume: "₹18,00,000",
      riskLevel: "Medium",
    },
    {
      id: "PS-1231",
      pattern: "Unusual Transaction Timing",
      detectedAt: "2023-06-11T09:20:00",
      walletAddress: "0x3fA45c6D8e9B2",
      transactionCount: 5,
      volume: "₹12,00,000",
      riskLevel: "Low",
    },
    {
      id: "PS-1230",
      pattern: "Multiple Small Transactions",
      detectedAt: "2023-06-10T15:10:00",
      walletAddress: "0x2eB87a9C1d5F3",
      transactionCount: 47,
      volume: "₹8,50,000",
      riskLevel: "Medium",
    },
  ];
  
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Pattern Scan</h1>
        <p className="text-muted-foreground">
          Monitor crypto transactions for suspicious patterns and anomalies
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="shadow col-span-1">
          <CardHeader>
            <CardTitle>Active Scans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">24</div>
            <p className="text-sm text-muted-foreground mt-1">Pattern detection models running</p>
          </CardContent>
        </Card>
        
        <Card className="shadow col-span-1">
          <CardHeader>
            <CardTitle>High Risk Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-error">8</div>
            <p className="text-sm text-muted-foreground mt-1">Detected in last 24 hours</p>
          </CardContent>
        </Card>
        
        <Card className="shadow col-span-1">
          <CardHeader>
            <CardTitle>Medium Risk Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-warning">15</div>
            <p className="text-sm text-muted-foreground mt-1">Detected in last 24 hours</p>
          </CardContent>
        </Card>
        
        <Card className="shadow col-span-1">
          <CardHeader>
            <CardTitle>Low Risk Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-info">23</div>
            <p className="text-sm text-muted-foreground mt-1">Detected in last 24 hours</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="shadow">
        <CardHeader>
          <CardTitle>Detected Suspicious Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input placeholder="Search patterns..." className="pl-9" />
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Date Range</span>
              </Button>
              
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </Button>
            </div>
          </div>
          
          <DataTable
            columns={columns}
            data={data}
            searchKey="pattern"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PatternScan;
