import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Analytics = () => {
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive analytics for crypto fraud patterns and trends
        </p>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Case Resolution Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="data-visualization flex items-center justify-center">
                  <div className="text-neutral-medium text-center">
                    <p>Case Resolution Chart</p>
                    <p className="text-xs mt-2">Showing resolution rate over time</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Fraud Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="data-visualization flex items-center justify-center">
                  <div className="text-neutral-medium text-center">
                    <p>Fraud Categories Chart</p>
                    <p className="text-xs mt-2">Distribution of different fraud types</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Wallet Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="data-visualization flex items-center justify-center">
                  <div className="text-neutral-medium text-center">
                    <p>Wallet Risk Assessment Chart</p>
                    <p className="text-xs mt-2">Risk distribution across monitored wallets</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="data-visualization h-[500px] flex items-center justify-center">
                <div className="text-neutral-medium text-center">
                  <p>Fraud Trends Visualization</p>
                  <p className="text-xs mt-2">Timeline of emerging fraud patterns</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center bg-secondary rounded-md">
                <div className="text-neutral-medium text-center">
                  <p>No reports have been generated yet</p>
                  <p className="text-xs mt-2">Use the STR Generator to create reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
