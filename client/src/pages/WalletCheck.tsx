
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  Search, 
  Shield, 
  Clock, 
  User,
  Plus
} from "lucide-react";

const riskLevels = ["High", "Medium", "Low"];
const networks = ["Bitcoin", "Ethereum", "Binance Smart Chain", "Polygon", "Solana"];

const WalletCheck = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [coin, setCoin] = useState("");
  const [network, setNetwork] = useState("");
  const [hashId, setHashId] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async () => {
    if (!walletAddress || !network || !riskLevel) return;
    
    setIsSubmitting(true);
    // TODO: API integration for wallet patch submission
    setTimeout(() => {
      setIsSubmitting(false);
    }, 1500);
  };
  
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Wallet Address Patch</h1>
        <p className="text-muted-foreground">
          Add and update wallet information across departments
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Add Wallet Information</CardTitle>
            <CardDescription>
              Submit new wallet details for cross-department analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Wallet Address*
                </label>
                <Input
                  placeholder="Enter wallet address..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium leading-none mb-2 block">
                    Coin/Token*
                  </label>
                  <Input
                    placeholder="Enter coin/token..."
                    value={coin}
                    onChange={(e) => setCoin(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium leading-none mb-2 block">
                    Network*
                  </label>
                  <Select value={network} onValueChange={setNetwork}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select network" />
                    </SelectTrigger>
                    <SelectContent>
                      {networks.map((net) => (
                        <SelectItem key={net} value={net.toLowerCase()}>
                          {net}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Transaction Hash ID (Optional)
                </label>
                <Input
                  placeholder="Enter transaction hash..."
                  value={hashId}
                  onChange={(e) => setHashId(e.target.value)}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Risk Level*
                </label>
                <Select value={riskLevel} onValueChange={setRiskLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    {riskLevels.map((level) => (
                      <SelectItem key={level} value={level.toLowerCase()}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Risk Analysis*
                </label>
                <Textarea
                  placeholder="Provide detailed risk analysis..."
                  value={analysis}
                  onChange={(e) => setAnalysis(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setWalletAddress("");
                setCoin("");
                setNetwork("");
                setHashId("");
                setRiskLevel("");
                setAnalysis("");
              }}
            >
              Clear
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!walletAddress || !network || !riskLevel || isSubmitting}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Add Wallet"}
            </Button>
          </CardFooter>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle>Recent Wallet Activity</CardTitle>
            <CardDescription>
              Latest wallet submissions and updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Example Activity Items */}
              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <code className="font-mono text-sm">
                    0x7fD23e7d8e2D8b6a3c589a32310B374F32e592a8
                  </code>
                  <Badge variant="destructive">High Risk</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Network: Ethereum • Coin: ETH
                </div>
                <p className="text-sm mt-2">
                  Multiple connections to known scam patterns. High-velocity transactions with mixing services.
                </p>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <code className="font-mono text-sm">
                    bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
                  </code>
                  <Badge variant="warning">Medium Risk</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Network: Bitcoin • Coin: BTC
                </div>
                <p className="text-sm mt-2">
                  Unusual transaction patterns detected. Multiple small transfers to unverified addresses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletCheck;
