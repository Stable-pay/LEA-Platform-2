
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CrossChainExplorer } from "@/components/CrossChainExplorer";

export default function CrossChainMonitoring() {
  return (
    <div className="container mx-auto py-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Cross-Chain Transaction Monitoring</h1>
        <p className="text-muted-foreground">
          Monitor and analyze transactions across multiple blockchain networks
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cross-Chain Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <CrossChainExplorer />
        </CardContent>
      </Card>
    </div>
  );
}
