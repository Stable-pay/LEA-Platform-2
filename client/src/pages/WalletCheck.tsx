
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
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatWalletAddress } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const WalletCheck = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [transactionVolume, setTransactionVolume] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [analysisNotes, setAnalysisNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentWallets, setRecentWallets] = useState<any[]>([]);
  const { toast } = useToast();

  const redirectToArkham = () => {
    if (!walletAddress) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive"
      });
      return;
    }
    window.open(`https://platform.arkhamintelligence.com/explorer/address/${walletAddress}`, '_blank');
  };

  useEffect(() => {
    fetchRecentWallets();
  }, []);

  const fetchRecentWallets = async () => {
    try {
      const response = await fetch('/api/wallet-checks');
      if (response.ok) {
        const data = await response.json();
        setRecentWallets(data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recent wallet checks",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!walletAddress || !network || !riskLevel) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/wallet-checks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          address: walletAddress,
          network,
          transactionVolume: parseFloat(transactionVolume) || 0,
          riskLevel,
          analysisNotes,
          lastChecked: new Date().toISOString(),
          watchlistStatus: 'none',
          firstSeen: new Date().toISOString()
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Wallet check submitted successfully",
        });
        fetchRecentWallets();
        setWalletAddress("");
        setNetwork("");
        setTransactionVolume("");
        setRiskLevel("");
        setAnalysisNotes("");
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
        <h1 className="text-2xl font-bold mb-2">Wallet Risk Assessment</h1>
        <p className="text-muted-foreground">
          Check wallet risk profiles and analyze transaction patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow">
          <CardHeader>
            <CardTitle>New Wallet Check</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
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

              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Network*
                </label>
                <Select value={network} onValueChange={setNetwork}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select network" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ethereum">Ethereum</SelectItem>
                    <SelectItem value="bitcoin">Bitcoin</SelectItem>
                    <SelectItem value="binance">Binance Smart Chain</SelectItem>
                    <SelectItem value="polygon">Polygon</SelectItem>
                    <SelectItem value="solana">Solana</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Transaction Volume
                </label>
                <Input 
                  type="number"
                  placeholder="Enter transaction volume" 
                  value={transactionVolume}
                  onChange={(e) => setTransactionVolume(e.target.value)}
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
                    <SelectItem value="critical">Critical Risk</SelectItem>
                    <SelectItem value="high">High Risk</SelectItem>
                    <SelectItem value="medium">Medium Risk</SelectItem>
                    <SelectItem value="low">Low Risk</SelectItem>
                    <SelectItem value="safe">Safe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium leading-none mb-2 block">
                  Analysis Notes
                </label>
                <Textarea 
                  placeholder="Enter analysis notes"
                  value={analysisNotes}
                  onChange={(e) => setAnalysisNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Submitting..." : "Submit Assessment"}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={redirectToArkham}
                  className="flex-1"
                >
                  Check on Arkham
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentWallets.map((wallet, index) => (
                <div key={index} className="p-4 border rounded">
                  <div className="flex justify-between items-start mb-2">
                    <code className="text-sm">{formatWalletAddress(wallet.address)}</code>
                    <Badge variant={wallet.riskLevel === 'critical' ? 'destructive' : 'secondary'}>
                      {wallet.riskLevel.charAt(0).toUpperCase() + wallet.riskLevel.slice(1)} Risk
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Network: {wallet.network}</p>
                    <p>Volume: {wallet.transactionVolume}</p>
                    <p>Last Checked: {new Date(wallet.lastChecked).toLocaleDateString()}</p>
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
