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
import StrFilingForm from "@/components/StrFilingForm";

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
          <StrFilingForm />
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