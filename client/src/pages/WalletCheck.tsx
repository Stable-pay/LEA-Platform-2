
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const WalletCheck = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [coin, setCoin] = useState("");
  const [hashId, setHashId] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentWallets, setRecentWallets] = useState<any[]>([]);
  const { toast } = useToast();

  // Fetch recent wallets on component mount
  useEffect(() => {
    fetchRecentWallets();
  }, []);

  const fetchRecentWallets = async () => {
    try {
      const response = await fetch('/api/recent-wallets');
      if (response.ok) {
        const data = await response.json();
        setRecentWallets(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recent wallets",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!walletAddress || !network || !riskLevel) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address: walletAddress,
          network,
          coin,
          hashId,
          riskLevel,
          analysis
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Wallet check submitted successfully",
        });
        fetchRecentWallets();
      } else {
        throw new Error('Failed to submit wallet check');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit wallet check",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Wallet Check</h1>
        <p className="text-muted-foreground">
          Add and update wallet information across departments
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow">
          <CardHeader>
            <CardTitle>New Wallet Check</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Wallet Address*
                </label>
                <Input 
                  placeholder="Enter wallet address" 
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium leading-none mb-2 block">
                    Coin (Optional)
                  </label>
                  <Input 
                    placeholder="e.g. BTC, ETH" 
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
                      <SelectItem value="bitcoin">Bitcoin</SelectItem>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                      <SelectItem value="binance">Binance Smart Chain</SelectItem>
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="solana">Solana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Transaction Hash ID (Optional)
                </label>
                <Input 
                  placeholder="Enter transaction hash" 
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
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="none">No Risk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Risk Analysis*
                </label>
                <Input 
                  placeholder="Enter risk analysis details"
                  value={analysis}
                  onChange={(e) => setAnalysis(e.target.value)}
                />
              </div>

              <Button 
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full"
              >
                {isSubmitting ? "Submitting..." : "Submit Wallet Check"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle>Recent Wallet Checks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWallets.map((wallet, index) => (
                <div key={index} className="p-4 border rounded">
                  <div className="flex justify-between items-start mb-2">
                    <code className="text-sm">{wallet.address}</code>
                    <Badge variant={wallet.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                      {wallet.riskLevel} Risk
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Network: {wallet.network}</p>
                    {wallet.coin && <p>Coin: {wallet.coin}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletCheck;
