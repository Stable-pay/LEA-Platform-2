
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const WalletCheck = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [network, setNetwork] = useState("");
  const [transactionVolume, setTransactionVolume] = useState("");
  const [riskLevel, setRiskLevel] = useState("");
  const [analysisNotes, setAnalysisNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentWallets, setRecentWallets] = useState<any[]>([]);
  const [selectedTab, setSelectedTab] = useState("analysis");
  const [transactionHistory, setTransactionHistory] = useState<any[]>([]);
  const [connectedWallets, setConnectedWallets] = useState<any[]>([]);
  const [riskIndicators, setRiskIndicators] = useState<string[]>([]);
  const { toast } = useToast();

  const RISK_INDICATORS = [
    "Mixer Usage",
    "High Velocity Trading",
    "Known Scam Interaction",
    "Exchange Hopping",
    "Layering Pattern",
    "Dormant Account Activation",
    "Suspicious IP Origins",
    "Cross-Chain Transfers"
  ];

  const fetchWalletDetails = async () => {
    try {
      // Simulated data for demo
      setTransactionHistory([
        { date: "2024-01-15", type: "Transfer", amount: "₹2,50,000", status: "Completed" },
        { date: "2024-01-14", type: "Exchange", amount: "₹1,80,000", status: "Completed" },
        { date: "2024-01-13", type: "Mixer", amount: "₹5,00,000", status: "Suspicious" }
      ]);
      
      setConnectedWallets([
        { address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e", risk: "high" },
        { address: "0x123f681646d4a755815f9cb19e1acc8565a0c2ac", risk: "medium" }
      ]);

      setRiskIndicators([
        "Mixer Usage",
        "High Velocity Trading",
        "Exchange Hopping"
      ]);
    } catch (error) {
      console.error("Error fetching wallet details:", error);
    }
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
          watchlistStatus: 'active',
          riskIndicators
        })
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Wallet check submitted successfully",
        });
        // Reset form
        setWalletAddress("");
        setNetwork("");
        setTransactionVolume("");
        setRiskLevel("");
        setAnalysisNotes("");
        setRiskIndicators([]);
        
        // Refresh data
        await Promise.all([
          fetchRecentWallets(),
          fetchWalletDetails()
        ]);
        
        // Reset selected tab
        setSelectedTab("analysis");
      } else {
        throw new Error('Failed to submit wallet check');
      }
    } catch (error) {
      console.error('Submit error:', error);
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
          Advanced wallet analysis and risk profiling system
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow">
          <CardHeader>
            <CardTitle>Wallet Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="analysis" value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
                <TabsTrigger value="connections">Connections</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis">
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
                      Transaction Volume (₹)
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
                      Risk Indicators
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {RISK_INDICATORS.map((indicator) => (
                        <div key={indicator} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={riskIndicators.includes(indicator)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setRiskIndicators([...riskIndicators, indicator]);
                              } else {
                                setRiskIndicators(riskIndicators.filter(i => i !== indicator));
                              }
                            }}
                            className="mr-2"
                          />
                          <span className="text-sm">{indicator}</span>
                        </div>
                      ))}
                    </div>
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
                      onClick={() => window.open(`https://explorer.arkham.city/${walletAddress}`, '_blank')}
                      className="flex-1"
                    >
                      Check on Arkham
                    </Button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="transactions">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {transactionHistory.map((tx, index) => (
                      <div key={index} className="p-4 border rounded">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{tx.type}</p>
                            <p className="text-sm text-muted-foreground">{tx.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{tx.amount}</p>
                            <Badge variant={tx.status === "Suspicious" ? "destructive" : "secondary"}>
                              {tx.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="connections">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {connectedWallets.map((wallet, index) => (
                      <div key={index} className="p-4 border rounded">
                        <div className="flex justify-between items-center">
                          <code className="text-sm">{formatWalletAddress(wallet.address)}</code>
                          <Badge variant={wallet.risk === "high" ? "destructive" : "secondary"}>
                            {wallet.risk.charAt(0).toUpperCase() + wallet.risk.slice(1)} Risk
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="shadow">
          <CardHeader>
            <CardTitle>Recent Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[600px]">
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
                      <p>Volume: ₹{wallet.transactionVolume?.toLocaleString()}</p>
                      <p>Last Checked: {new Date(wallet.lastChecked).toLocaleDateString()}</p>
                      {wallet.riskIndicators && (
                        <div className="mt-2">
                          <p className="font-medium mb-1">Risk Indicators:</p>
                          <div className="flex flex-wrap gap-1">
                            {wallet.riskIndicators.map((indicator: string, i: number) => (
                              <Badge key={i} variant="outline">{indicator}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletCheck;
