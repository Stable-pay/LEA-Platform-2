import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, ExternalLink, ChevronRight, AlertTriangle, ArrowRightLeft, BarChart } from "lucide-react";

interface TransactionType {
  txHash: string;
  from: string;
  to: string;
  amount: string;
  timestamp: string;
  status: "confirmed" | "pending" | "flagged";
  blockchain: "ETH" | "BTC" | "TRX" | "BNB" | "SOL";
}

const formatAddress = (address: string, blockchain: string) => {
  if (address.length < 12) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const BlockchainIcon = ({ type }: { type: string }) => {
  const colors: Record<string, { bg: string, text: string }> = {
    ETH: { bg: "bg-blue-100", text: "text-blue-600" },
    BTC: { bg: "bg-amber-100", text: "text-amber-600" },
    TRX: { bg: "bg-red-100", text: "text-red-600" },
    BNB: { bg: "bg-yellow-100", text: "text-yellow-600" },
    SOL: { bg: "bg-purple-100", text: "text-purple-600" }
  };
  
  const color = colors[type] || { bg: "bg-gray-100", text: "text-gray-600" };
  
  return (
    <div className={`flex items-center justify-center w-6 h-6 rounded-full ${color.bg}`}>
      <span className={`text-xs font-bold ${color.text}`}>{type}</span>
    </div>
  );
};

const CrossChainExplorer = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>("all");
  const [searchLoading, setSearchLoading] = useState(false);
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  
  const transactions: TransactionType[] = [
    {
      txHash: "0x7cd3c0d359c8bcd5f0f4a6bc025d8f523e7e48d471f9ee51b795af3d4d457780",
      from: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      to: "0x1B92d7aD079B22A2FE6e5745bc9f8D97bE7390F0",
      amount: "2.35 ETH",
      timestamp: "2023-08-24T14:36:21Z",
      status: "confirmed",
      blockchain: "ETH"
    },
    {
      txHash: "0x2c7ea95adcd1bd074c6a7926d0c0f4cbc6b55462f15ec51f94f0ebd79b2af56d",
      from: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c",
      to: "0xFe9e21e95c2FA1A3f22461c2CF5E00D830D979eA",
      amount: "0.75 ETH",
      timestamp: "2023-08-24T14:28:45Z",
      status: "flagged",
      blockchain: "ETH"
    },
    {
      txHash: "TYoDX6TXSmcEJXE6zNWgDPpnpXeym1Hchx7qqtRHZTNN2DTL99",
      from: "TJnVEJKjfz7LKQNgXAUfE9zrDwGHPvf5jm",
      to: "TGehVcNhZrqRku3obUKGGKcTVtfpCnJbwG",
      amount: "15,420 TRX",
      timestamp: "2023-08-24T13:47:12Z",
      status: "confirmed",
      blockchain: "TRX"
    },
    {
      txHash: "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
      from: "3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5",
      to: "bc1q4c8n5t00jmj8temxdgcc3t32nkg2wjwz24lywv",
      amount: "0.12 BTC",
      timestamp: "2023-08-24T12:15:33Z",
      status: "confirmed",
      blockchain: "BTC"
    },
    {
      txHash: "0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
      from: "0x388C818CA8B9251b393131C08a736A67ccB19297",
      to: "0x5A0b54D5dc17e0AadC383d2db43B0a0D3E029c4c",
      amount: "1.24 BNB",
      timestamp: "2023-08-24T11:22:47Z",
      status: "pending",
      blockchain: "BNB"
    }
  ];

  const handleSearch = () => {
    if (!searchQuery) return;
    
    setSearchLoading(true);
    // Simulate search delay
    setTimeout(() => {
      setSearchLoading(false);
    }, 1200);
  };

  const toggleTxExpanded = (txHash: string) => {
    if (expandedTx === txHash) {
      setExpandedTx(null);
    } else {
      setExpandedTx(txHash);
    }
  };

  const filteredTransactions = selectedBlockchain === "all" 
    ? transactions 
    : transactions.filter(tx => tx.blockchain === selectedBlockchain);

  return (
    <Card className="shadow">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
        <CardTitle className="font-semibold text-neutral-dark">Multi-Chain Explorer</CardTitle>
        <div className="flex items-center text-xs text-neutral-medium">
          <div className="mr-2 px-2 py-1 bg-green-100 text-green-700 rounded">Live</div>
          Connected to 5 blockchain networks
        </div>
      </CardHeader>

      <Tabs defaultValue="explorer" className="w-full">
        <div className="px-6 py-2 border-b">
          <TabsList>
            <TabsTrigger value="explorer" className="text-sm">Transaction Explorer</TabsTrigger>
            <TabsTrigger value="transfers" className="text-sm">Cross-Chain Transfers</TabsTrigger>
            <TabsTrigger value="arkham" className="text-sm">Arkham Integration</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="explorer" className="pt-2">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search by address, transaction or block hash"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="h-4 w-4 text-neutral-medium" />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedBlockchain} onValueChange={setSelectedBlockchain}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Blockchain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chains</SelectItem>
                    <SelectItem value="ETH">Ethereum</SelectItem>
                    <SelectItem value="BTC">Bitcoin</SelectItem>
                    <SelectItem value="TRX">Tron</SelectItem>
                    <SelectItem value="BNB">Binance</SelectItem>
                    <SelectItem value="SOL">Solana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={searchLoading || !searchQuery}
                className="w-full md:w-auto"
              >
                {searchLoading ? "Searching..." : "Search"}
              </Button>
            </div>

            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <div 
                  key={tx.txHash} 
                  className={`border rounded-lg overflow-hidden hover:border-primary transition-colors ${
                    tx.status === 'flagged' ? 'border-yellow-300 bg-yellow-50' : ''
                  }`}
                >
                  <div 
                    className="p-3 cursor-pointer"
                    onClick={() => toggleTxExpanded(tx.txHash)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <BlockchainIcon type={tx.blockchain} />
                        <div className="font-mono text-xs">
                          {formatAddress(tx.txHash, tx.blockchain)}
                        </div>
                        {tx.status === 'flagged' && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Suspicious
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-neutral-medium">{new Date(tx.timestamp).toLocaleString()}</span>
                        <ChevronRight className={`h-5 w-5 transition-transform ${expandedTx === tx.txHash ? 'rotate-90' : ''}`} />
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center text-sm">
                      <div className="flex-1 truncate">
                        <span className="text-neutral-medium mr-1">From:</span>
                        <span className="font-mono">{formatAddress(tx.from, tx.blockchain)}</span>
                      </div>
                      <ArrowRightLeft className="h-4 w-4 mx-2 text-neutral-medium" />
                      <div className="flex-1 truncate text-right">
                        <span className="text-neutral-medium mr-1">To:</span>
                        <span className="font-mono">{formatAddress(tx.to, tx.blockchain)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-1 flex justify-between text-sm">
                      <div>
                        <span className="font-medium">{tx.amount}</span>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          tx.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          tx.status === 'pending' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {expandedTx === tx.txHash && (
                    <div className="px-3 pb-3 pt-1 border-t border-dashed border-neutral-200">
                      <div className="rounded-md bg-neutral-50 p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
                          <div>
                            <span className="text-neutral-medium">Transaction Hash:</span>
                            <div className="font-mono text-xs overflow-hidden text-ellipsis mt-1">{tx.txHash}</div>
                          </div>
                          <div>
                            <span className="text-neutral-medium">Timestamp:</span>
                            <div className="mt-1">{new Date(tx.timestamp).toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-neutral-medium">From:</span>
                            <div className="font-mono text-xs overflow-hidden text-ellipsis mt-1">{tx.from}</div>
                          </div>
                          <div>
                            <span className="text-neutral-medium">To:</span>
                            <div className="font-mono text-xs overflow-hidden text-ellipsis mt-1">{tx.to}</div>
                          </div>
                          <div>
                            <span className="text-neutral-medium">Value:</span>
                            <div className="mt-1">{tx.amount}</div>
                          </div>
                          <div>
                            <span className="text-neutral-medium">Blockchain:</span>
                            <div className="mt-1 flex items-center">
                              <BlockchainIcon type={tx.blockchain} />
                              <span className="ml-2">
                                {tx.blockchain === "ETH" ? "Ethereum" :
                                 tx.blockchain === "BTC" ? "Bitcoin" :
                                 tx.blockchain === "TRX" ? "Tron" :
                                 tx.blockchain === "BNB" ? "Binance" : "Solana"}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-3 flex justify-end">
                          <Button variant="outline" size="sm" className="text-xs h-8">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            View on Explorer
                          </Button>
                          {tx.status === 'flagged' && (
                            <Button variant="default" size="sm" className="ml-2 text-xs h-8">
                              Add to Case
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="transfers" className="pt-2">
          <CardContent className="p-4 text-center">
            <div className="border-2 border-dashed rounded-lg p-6">
              <BarChart className="h-12 w-12 mx-auto mb-3 text-neutral-medium opacity-50" />
              <h3 className="text-lg font-semibold">Cross-Chain Transfer Analysis</h3>
              <p className="text-neutral-medium max-w-md mx-auto mt-2">
                Track suspicious funds as they move between different blockchains, 
                identifying patterns and correlations in cross-chain activities.
              </p>
              <Button variant="outline" className="mt-4">
                Run Analysis
              </Button>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="arkham" className="pt-2">
          <CardContent className="p-4 text-center">
            <div className="border-2 border-dashed rounded-lg p-6">
              <img 
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExLjA3MSA4LjkyOUw4LjkyOSAxMS4wNzFMMS4wOTM3NSAxOC45MDYyVjFMMTEuMDcxIDguOTI5WiIgc3Ryb2tlPSIjNTY1ODVEIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+CjxwYXRoIGQ9Ik0xMS4wNzEgOC45MjlMMTQuMTY0MyA3LjgzOTNMMTguOTA2MiAxLjA5Mzc1TDExLjA3MSA4LjkyOVoiIHN0cm9rZT0iIzU2NTg1RCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8cGF0aCBkPSJNOC45MjkgMTEuMDcxTDcuODM5MyAxNC4xNjQzTDEuMDkzNzUgMTguOTA2Mkw4LjkyOSAxMS4wNzFaIiBzdHJva2U9IiM1NjU4NUQiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTguOTI5IDExLjA3MUwxMS4wNzEgOC45MjlMMTguOTA2MiAxOUw4LjkyOSAxMS4wNzFaIiBzdHJva2U9IiM1NjU4NUQiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+"
                alt="Arkham Intelligence"
                className="h-16 w-16 mx-auto mb-3 opacity-70"
              />
              <h3 className="text-lg font-semibold">Arkham Intelligence Integration</h3>
              <p className="text-neutral-medium max-w-md mx-auto mt-2">
                Auto-redirect suspicious wallets to Arkham Intelligence for deep 
                blockchain analytics and entity identification.
              </p>
              <Button variant="outline" className="mt-4">
                Connect to Arkham
              </Button>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default CrossChainExplorer;