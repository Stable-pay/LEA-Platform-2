
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RiskAssessment() {
  return (
    <div className="container mx-auto py-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Risk Assessment</h1>
        <p className="text-muted-foreground">
          Comprehensive risk assessment and scoring system
        </p>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Risk Overview</TabsTrigger>
          <TabsTrigger value="scoring">Risk Scoring</TabsTrigger>
          <TabsTrigger value="alerts">Risk Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Risk Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>High Risk Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-500">24</div>
                    <p className="text-sm text-muted-foreground">Active high-risk cases</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Medium Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-amber-500">45</div>
                    <p className="text-sm text-muted-foreground">Cases under review</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Low Risk</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">78</div>
                    <p className="text-sm text-muted-foreground">Monitored cases</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scoring">
          <Card>
            <CardHeader>
              <CardTitle>Risk Scoring Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              Risk scoring system coming soon
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts">
          <Card>
            <CardHeader>
              <CardTitle>Risk Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              Risk alert dashboard coming soon
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
