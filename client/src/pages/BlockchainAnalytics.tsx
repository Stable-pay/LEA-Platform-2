
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BlockchainDemo from "@/components/BlockchainDemo";
import CrossChainExplorer from "@/components/CrossChainExplorer";

export default function BlockchainAnalytics() {
  return (
    <div className="container mx-auto py-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Blockchain Analytics</h1>
        <p className="text-muted-foreground">
          Real-time blockchain transaction monitoring and analysis
        </p>
      </div>

      <div className="grid gap-6">
        <BlockchainDemo />
        <CrossChainExplorer />
      </div>
    </div>
  );
}
