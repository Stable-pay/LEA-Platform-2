import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  FileText, 
  Shield, 
  CheckCircle, 
  Download, 
  RefreshCw, 
  Eye, 
  Lock, 
  AlertTriangle, 
  Clock,
  Calendar,
  BarChart,
  User
} from "lucide-react";

interface CourtExportItemProps {
  id: string;
  title: string;
  exportDate: string;
  status: "pending" | "verified" | "submitted" | "accepted";
  fileType: string;
  caseId: string;
  stakeholders: string[];
  verificationHash: string;
}

const stakeholderColors: Record<string, { bg: string, text: string }> = {
  "LEA": { bg: "bg-blue-100", text: "text-blue-700" },
  "FIU": { bg: "bg-purple-100", text: "text-purple-700" },
  "IND": { bg: "bg-green-100", text: "text-green-700" },
  "I4C": { bg: "bg-amber-100", text: "text-amber-700" },
  "COURT": { bg: "bg-red-100", text: "text-red-700" }
};

const CourtExportDemo = () => {
  const [selectedExport, setSelectedExport] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  const courtExports: CourtExportItemProps[] = [
    {
      id: "EXP-2023-089",
      title: "Crypto Fraud Case #3756 - Court Evidence Package",
      exportDate: "2023-08-25T09:17:42Z",
      status: "accepted",
      fileType: "PDF + Blockchain Hash",
      caseId: "CASE-3756",
      stakeholders: ["LEA", "FIU", "COURT"],
      verificationHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    {
      id: "EXP-2023-087",
      title: "Phishing Attack Investigation - Full Evidence Export",
      exportDate: "2023-08-24T14:36:21Z",
      status: "verified",
      fileType: "PDF + JSON",
      caseId: "CASE-3742",
      stakeholders: ["LEA", "I4C", "FIU"],
      verificationHash: "f2ca1bb6c7e907d06dafe4687e579fce76b37e4e93b7605022da52e6ccc26fd2"
    },
    {
      id: "EXP-2023-086",
      title: "Wallet Cluster Analysis - Multi-Exchange Fraud",
      exportDate: "2023-08-23T11:28:45Z",
      status: "submitted",
      fileType: "PDF + Transaction Data",
      caseId: "CASE-3729",
      stakeholders: ["LEA", "FIU", "COURT"],
      verificationHash: "d14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f"
    },
    {
      id: "EXP-2023-085",
      title: "KYC Verification Evidence - Case #3712",
      exportDate: "2023-08-22T09:47:12Z",
      status: "pending",
      fileType: "PDF + Blockchain Hash",
      caseId: "CASE-3712",
      stakeholders: ["LEA", "IND"],
      verificationHash: "7d793037a0760186574b0282f2f435e7"
    }
  ];

  const handleExportNew = () => {
    setIsExporting(true);
    setExportProgress(0);
    
    const interval = setInterval(() => {
      setExportProgress(prev => {
        const next = prev + 5;
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
          }, 500);
          return 100;
        }
        return next;
      });
    }, 200);
  };

  const handleSelectExport = (id: string) => {
    setSelectedExport(prev => prev === id ? null : id);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "pending":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>;
      case "verified":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <Shield className="mr-1 h-3 w-3" /> Verified
        </Badge>;
      case "submitted":
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          <FileText className="mr-1 h-3 w-3" /> Submitted
        </Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <CheckCircle className="mr-1 h-3 w-3" /> Accepted
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card className="shadow">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
        <CardTitle className="font-semibold text-neutral-dark">Judicial Export System</CardTitle>
        <Button
          onClick={handleExportNew}
          disabled={isExporting}
          size="sm"
          className="h-9"
        >
          {isExporting ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <FileText className="mr-2 h-4 w-4" />
              Export New Case
            </>
          )}
        </Button>
      </CardHeader>

      {isExporting && (
        <div className="px-6 py-4 bg-blue-50 border-b border-blue-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Creating verified export package...</span>
            <span className="text-sm font-medium">{exportProgress}%</span>
          </div>
          <Progress value={exportProgress} className="h-2" />
          <div className="mt-2 grid grid-cols-4 gap-2 text-xs">
            <div className={`rounded px-2 py-1 flex items-center ${exportProgress >= 20 ? 'bg-green-100 text-green-800' : 'bg-neutral-100'}`}>
              <CheckCircle className={`h-3 w-3 mr-1 ${exportProgress >= 20 ? 'opacity-100' : 'opacity-30'}`} />
              <span>Case Data</span>
            </div>
            <div className={`rounded px-2 py-1 flex items-center ${exportProgress >= 40 ? 'bg-green-100 text-green-800' : 'bg-neutral-100'}`}>
              <CheckCircle className={`h-3 w-3 mr-1 ${exportProgress >= 40 ? 'opacity-100' : 'opacity-30'}`} />
              <span>Evidence</span>
            </div>
            <div className={`rounded px-2 py-1 flex items-center ${exportProgress >= 70 ? 'bg-green-100 text-green-800' : 'bg-neutral-100'}`}>
              <CheckCircle className={`h-3 w-3 mr-1 ${exportProgress >= 70 ? 'opacity-100' : 'opacity-30'}`} />
              <span>Blockchain Verification</span>
            </div>
            <div className={`rounded px-2 py-1 flex items-center ${exportProgress >= 100 ? 'bg-green-100 text-green-800' : 'bg-neutral-100'}`}>
              <CheckCircle className={`h-3 w-3 mr-1 ${exportProgress >= 100 ? 'opacity-100' : 'opacity-30'}`} />
              <span>Digital Signature</span>
            </div>
          </div>
        </div>
      )}

      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x">
          <div className="col-span-2 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-neutral-dark">Recent Exports</h3>
              <div className="text-xs text-neutral-medium">
                Showing 4 of 42 total exports
              </div>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Case Export</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courtExports.map((item) => (
                    <TableRow 
                      key={item.id}
                      className={`cursor-pointer ${selectedExport === item.id ? 'bg-neutral-50' : ''}`}
                      onClick={() => handleSelectExport(item.id)}
                    >
                      <TableCell className="font-medium">
                        <div>{item.title}</div>
                        <div className="text-xs text-neutral-medium mt-1">
                          ID: {item.id} • Case: {item.caseId}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(item.exportDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(item.status)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="p-4">
            {selectedExport ? (
              <div>
                {courtExports.filter(item => item.id === selectedExport).map((export_item) => (
                  <div key={export_item.id}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold">{export_item.id}</h3>
                      {getStatusBadge(export_item.status)}
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Export Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex">
                            <div className="w-28 text-neutral-medium">Title:</div>
                            <div className="flex-1 font-medium">{export_item.title}</div>
                          </div>
                          <div className="flex">
                            <div className="w-28 text-neutral-medium">Case ID:</div>
                            <div className="flex-1">{export_item.caseId}</div>
                          </div>
                          <div className="flex">
                            <div className="w-28 text-neutral-medium">Export Date:</div>
                            <div className="flex-1">{new Date(export_item.exportDate).toLocaleString()}</div>
                          </div>
                          <div className="flex">
                            <div className="w-28 text-neutral-medium">File Type:</div>
                            <div className="flex-1">{export_item.fileType}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Blockchain Verification</h4>
                        <div className="p-3 bg-neutral-50 rounded-md border">
                          <div className="text-xs font-medium mb-2 flex items-center">
                            <Lock className="h-3 w-3 mr-1 text-green-600" />
                            <span>Verification Hash</span>
                          </div>
                          <div className="font-mono text-xs break-all">
                            {export_item.verificationHash}
                          </div>
                          <div className="mt-2 flex justify-end">
                            <Button 
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs"
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Verify on Chain
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Stakeholders</h4>
                        <div className="flex flex-wrap gap-2">
                          {export_item.stakeholders.map((stakeholder) => (
                            <div 
                              key={stakeholder}
                              className={`px-2 py-1 rounded-full text-xs font-medium ${stakeholderColors[stakeholder]?.bg} ${stakeholderColors[stakeholder]?.text}`}
                            >
                              {stakeholder}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <Button className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Download Export
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-6 text-center text-neutral-medium">
                <FileText className="h-12 w-12 opacity-30 mb-3" />
                <h3 className="text-base font-medium text-neutral-dark">No Export Selected</h3>
                <p className="text-sm mt-1 max-w-xs">
                  Select a court export from the list to view details and verification information
                </p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-4 border-t">
          <h3 className="font-semibold text-neutral-dark mb-3">Export Analytics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="border rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-neutral-medium">Total Exports</div>
                  <div className="text-2xl font-semibold mt-1">42</div>
                </div>
                <div className="bg-blue-100 p-2 rounded-md">
                  <BarChart className="h-5 w-5 text-blue-500" />
                </div>
              </div>
              <div className="text-xs text-green-600 mt-2">↑ 12% from last month</div>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-neutral-medium">Court Accepted</div>
                  <div className="text-2xl font-semibold mt-1">28</div>
                </div>
                <div className="bg-green-100 p-2 rounded-md">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <div className="text-xs text-green-600 mt-2">↑ 8% from last month</div>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-neutral-medium">Pending Review</div>
                  <div className="text-2xl font-semibold mt-1">9</div>
                </div>
                <div className="bg-amber-100 p-2 rounded-md">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
              </div>
              <div className="text-xs text-red-600 mt-2">↑ 3% from last month</div>
            </div>
            
            <div className="border rounded-lg p-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-neutral-medium">Avg. Acceptance Time</div>
                  <div className="text-2xl font-semibold mt-1">3.2d</div>
                </div>
                <div className="bg-purple-100 p-2 rounded-md">
                  <Calendar className="h-5 w-5 text-purple-500" />
                </div>
              </div>
              <div className="text-xs text-green-600 mt-2">↓ 0.5d from last month</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourtExportDemo;