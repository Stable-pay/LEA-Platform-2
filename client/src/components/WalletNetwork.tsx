import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const WalletNetwork = () => {
  return (
    <Card className="shadow overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
        <CardTitle className="font-semibold text-neutral-dark">Scam Wallet Network</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowDown className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowUp className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="h-8 px-3 py-1 text-xs font-medium text-primary border-primary">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Network Graph Placeholder */}
        <div className="network-graph flex items-center justify-center">
          <div className="text-neutral-medium text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-neutral-medium opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <p>Scam Wallet Network Visualization</p>
            <p className="text-xs mt-2">Showing connections between suspicious wallets and transactions</p>
          </div>
        </div>
        
        {/* Legend */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-status-error rounded-full mr-2"></span>
            <span>High Risk Wallets</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-status-warning rounded-full mr-2"></span>
            <span>Medium Risk Wallets</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
            <span>Exchange Wallets</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletNetwork;
