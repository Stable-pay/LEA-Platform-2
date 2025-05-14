import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CryptoNewsSection } from "@/components/CryptoNewsSection";

export default function IntelligenceHub() {
  return (
    <div className="container mx-auto py-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Intelligence Hub</h1>
        <p className="text-muted-foreground">
          Centralized intelligence gathering and analysis platform
        </p>
      </div>

      <Tabs defaultValue="news">
        <TabsList>
          <TabsTrigger value="news">Intelligence Feed</TabsTrigger>
          <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
          <TabsTrigger value="reports">Intelligence Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="news">
          <CryptoNewsSection />
        </TabsContent>
        
        <TabsContent value="patterns">
          <Card>
            <CardHeader>
              <CardTitle>Emerging Patterns</CardTitle>
            </CardHeader>
            <CardContent>
              Pattern analysis dashboard coming soon
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Intelligence Reports</CardTitle>
            </CardHeader>
            <CardContent>
              Report generation interface coming soon
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}