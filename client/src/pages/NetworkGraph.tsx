import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  PanelRight, 
  AlertTriangle 
} from "lucide-react";
import { formatWalletAddress } from "@/lib/utils";

const NetworkGraph = () => {
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Scam Network Graph</h1>
        <p className="text-muted-foreground">
          Visual links between wallets, victims, and scammers
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="shadow">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <CardTitle>Wallet Network Visualization</CardTitle>
                <Badge variant="error" className="flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  High Risk Cluster
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Maximize className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <PanelRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="network-graph h-[600px] flex items-center justify-center">
                <div className="text-neutral-medium text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-neutral-medium opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p>Network Graph Visualization</p>
                  <p className="text-xs mt-2">Showing connections between suspicious wallets and transactions</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between text-xs border-t pt-4">
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
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                  <span>Victim Wallets</span>
                </div>
                <div className="flex items-center">
                  <span className="border-b border-dashed border-gray-400 w-5 mr-2"></span>
                  <span>Transaction Flow</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Search Wallets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Enter wallet address..." className="pl-9" />
              </div>
              
              <div className="mt-4">
                <div className="text-sm font-medium mb-2">Recent Searches</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm bg-secondary p-2 rounded-md">
                    <code className="font-mono text-xs">
                      {formatWalletAddress("0x7fD23e7d8e2D8")}
                    </code>
                    <Badge variant="error">High Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-secondary p-2 rounded-md">
                    <code className="font-mono text-xs">
                      {formatWalletAddress("0x4eA87c8b3f87B")}
                    </code>
                    <Badge variant="warning">Medium Risk</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm bg-secondary p-2 rounded-md">
                    <code className="font-mono text-xs">
                      {formatWalletAddress("0x9bC12d3e4F56a")}
                    </code>
                    <Badge variant="info">Low Risk</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Selected Wallet Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium mb-1">Wallet Address</div>
                  <code className="font-mono text-xs bg-secondary px-2 py-1 rounded block">
                    0x7fD23e7d8e2D8b6a3c589a32310B374F32e592a8
                  </code>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Risk Assessment</div>
                  <Badge variant="error">High Risk (Score: 87)</Badge>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Connected Wallets</div>
                  <div className="text-sm">5 direct connections</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Fraud Pattern</div>
                  <div className="text-sm">Multi-layered mixing</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Transaction Volume</div>
                  <div className="text-sm">₹4.8 Cr (last 30 days)</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Exchange Association</div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>WazirX</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                    <span>CoinDCX</span>
                  </div>
                </div>
                
                <div className="pt-2 flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1">
                    Add to Case
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Cluster Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium mb-1">Cluster ID</div>
                  <div className="text-sm">CLST-3912-A</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Total Wallets</div>
                  <div className="text-sm">42 wallets in network</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Estimated Fraud Value</div>
                  <div className="text-sm font-medium text-status-error">₹12.7 Cr</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Related Cases</div>
                  <div className="flex gap-1 flex-wrap">
                    <Badge variant="secondary">#3912</Badge>
                    <Badge variant="secondary">#3889</Badge>
                    <Badge variant="secondary">#3756</Badge>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium mb-1">Pattern Match</div>
                  <div className="text-sm">
                    89% match to "Fake Exchange Exit Scam"
                  </div>
                </div>
                
                <Button className="w-full mt-2">
                  Export Cluster Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NetworkGraph;
