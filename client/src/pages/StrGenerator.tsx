import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Upload, CheckCircle } from "lucide-react";

const StrGenerator = () => {
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">STR Generator</h1>
        <p className="text-muted-foreground">
          Generate Suspicious Transaction Reports with blockchain audit trails
        </p>
      </div>
      
      <Tabs defaultValue="new-str" className="space-y-4">
        <TabsList>
          <TabsTrigger value="new-str">New STR</TabsTrigger>
          <TabsTrigger value="str-history">STR History</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new-str">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow">
                <CardHeader>
                  <CardTitle>Create New STR</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="case-reference">Case Reference</Label>
                        <Input id="case-reference" placeholder="e.g. LEA-3912" />
                      </div>
                      <div>
                        <Label htmlFor="report-type">Report Type</Label>
                        <Input id="report-type" placeholder="e.g. Crypto Fraud" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="wallet-address">Primary Wallet Address</Label>
                      <Input id="wallet-address" placeholder="Enter wallet address" />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Suspicious Activity Description</Label>
                      <Textarea 
                        id="description" 
                        placeholder="Describe the suspicious activity pattern..." 
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="transaction-date">Transaction Date</Label>
                        <Input id="transaction-date" type="date" />
                      </div>
                      <div>
                        <Label htmlFor="amount">Amount</Label>
                        <Input id="amount" placeholder="Amount in INR" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Include in Report</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="include-blockchain" />
                          <Label htmlFor="include-blockchain" className="text-sm font-normal">
                            Blockchain Audit Trail
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="include-kyc" />
                          <Label htmlFor="include-kyc" className="text-sm font-normal">
                            KYC Information
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="include-pattern" />
                          <Label htmlFor="include-pattern" className="text-sm font-normal">
                            Pattern Analysis
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="include-exchange" />
                          <Label htmlFor="include-exchange" className="text-sm font-normal">
                            Exchange Details
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Save Draft</Button>
                      <Button>Generate STR</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-1">
              <Card className="shadow">
                <CardHeader>
                  <CardTitle>STR Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-4 min-h-[400px] flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 text-neutral-medium opacity-50" />
                      <p className="text-neutral-medium">
                        Complete the form to generate a preview
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 space-y-4">
                    <Button disabled className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                    
                    <Button disabled variant="outline" className="w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Submit to FIU
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="str-history">
          <Card className="shadow">
            <CardHeader>
              <CardTitle>STR History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        STR ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Case Reference
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date Generated
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">STR-10089</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">LEA-3912</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Jun 12, 2023</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success" className="flex items-center w-fit">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Submitted
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Download</Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">STR-10085</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">LEA-3889</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">Jun 10, 2023</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="success" className="flex items-center w-fit">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Submitted
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <Button variant="ghost" size="sm">View</Button>
                        <Button variant="ghost" size="sm">Download</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card className="shadow">
            <CardHeader>
              <CardTitle>STR Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Crypto Scam</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Template for reporting cryptocurrency fraud and scams
                    </p>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button variant="outline" className="w-full">Use Template</Button>
                  </div>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Money Laundering</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Template for reporting suspected money laundering via crypto
                    </p>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button variant="outline" className="w-full">Use Template</Button>
                  </div>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Exchange Fraud</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Template for reporting suspicious activity on crypto exchanges
                    </p>
                  </CardContent>
                  <div className="p-4 pt-0">
                    <Button variant="outline" className="w-full">Use Template</Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StrGenerator;
