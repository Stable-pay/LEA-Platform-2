import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Search, 
  Shield, 
  Clock, 
  User
} from "lucide-react";

const WalletCheck = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchComplete, setSearchComplete] = useState(false);
  
  const handleSearch = () => {
    if (!walletAddress) return;
    
    setIsSearching(true);
    
    // Simulate an API call
    setTimeout(() => {
      setIsSearching(false);
      setSearchComplete(true);
    }, 1500);
  };
  
  const handleReset = () => {
    setWalletAddress("");
    setSearchComplete(false);
  };
  
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Wallet Check</h1>
        <p className="text-muted-foreground">
          Validate cryptocurrency wallets against known scam patterns and behaviors
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Wallet Validator</CardTitle>
              <CardDescription>
                Enter a wallet address to check its risk profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium leading-none mb-2 block">
                    Wallet Address
                  </label>
                  <div className="relative">
                    <Input
                      placeholder="Enter wallet address..."
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      className="pl-10"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-neutral-medium" />
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button 
                    onClick={handleSearch} 
                    disabled={!walletAddress || isSearching}
                    className="flex-1"
                  >
                    {isSearching ? "Searching..." : "Check Wallet"}
                  </Button>
                  {searchComplete && (
                    <Button 
                      variant="outline" 
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-100 flex flex-col items-start">
              <p className="text-sm text-muted-foreground mb-2">
                This tool checks wallet addresses against:
              </p>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li className="flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-2 text-status-warning" />
                  Known scam clusters
                </li>
                <li className="flex items-center">
                  <Clock className="h-3 w-3 mr-2 text-status-info" />
                  Transaction pattern analysis
                </li>
                <li className="flex items-center">
                  <Shield className="h-3 w-3 mr-2 text-status-success" />
                  Security vulnerabilities
                </li>
              </ul>
            </CardFooter>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          {searchComplete ? (
            <Card className="shadow h-full">
              <CardHeader className="border-b border-gray-100">
                <div className="flex justify-between items-center">
                  <CardTitle>Wallet Analysis Results</CardTitle>
                  <Badge variant="error">High Risk</Badge>
                </div>
                <CardDescription>
                  <code className="font-mono bg-neutral-light px-2 py-1 rounded text-sm">
                    {walletAddress}
                  </code>
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-status-error/10 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-status-error">87</div>
                      <div className="text-xs font-medium text-neutral-dark mt-1">Risk Score</div>
                    </div>
                    <div className="bg-secondary rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-neutral-dark">12</div>
                      <div className="text-xs font-medium text-neutral-dark mt-1">Cases Linked</div>
                    </div>
                    <div className="bg-secondary rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-neutral-dark">5</div>
                      <div className="text-xs font-medium text-neutral-dark mt-1">Connected Wallets</div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-neutral-dark mb-2">Risk Factors</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm bg-status-error/5 rounded-md p-2">
                        <AlertTriangle className="h-4 w-4 mr-2 text-status-error" />
                        <span>Linked to known scam pattern "Fake Exchange Exit"</span>
                      </li>
                      <li className="flex items-center text-sm bg-status-warning/5 rounded-md p-2">
                        <Clock className="h-4 w-4 mr-2 text-status-warning" />
                        <span>Unusual transaction pattern - Mixing service detected</span>
                      </li>
                      <li className="flex items-center text-sm bg-status-warning/5 rounded-md p-2">
                        <User className="h-4 w-4 mr-2 text-status-warning" />
                        <span>KYC verification failure on 2 exchanges</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-neutral-dark mb-2">Recommendation</h3>
                    <div className="bg-status-error/5 border border-status-error/20 rounded-md p-3 text-sm">
                      <p className="font-medium text-status-error mb-1">Action Required</p>
                      <p className="text-neutral-dark">This wallet shows strong indicators of fraudulent activity. 
                      Recommend immediate case escalation and KYC verification requests to all associated exchanges.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-100 flex justify-between">
                <Button variant="outline">Export Report</Button>
                <Button>Create Case</Button>
              </CardFooter>
            </Card>
          ) : (
            <Card className="shadow h-full">
              <CardContent className="p-0">
                <div className="h-full flex items-center justify-center p-12">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-neutral-light rounded-full mx-auto flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-neutral-medium" />
                    </div>
                    <h3 className="text-lg font-medium text-neutral-dark mb-2">No Wallet Analysis</h3>
                    <p className="text-sm text-muted-foreground mb-6 max-w-md">
                      Enter a wallet address to check against known scam patterns, transaction behaviors, and KYC verification status.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletCheck;
