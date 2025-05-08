import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShieldCheck, Key, LockKeyhole, FileCheck, Database, BarChart4, ArrowRight, CheckCircle2 } from "lucide-react";

interface BlockchainNodeProps {
  name: string;
  type: string;
  status: "active" | "pending" | "offline";
  lastBlock: string;
}

const BlockchainDemo = () => {
  const [showVerification, setShowVerification] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  interface NodeConfirmation {
  timestamp: string;
  confirmationHash: string;
  status: "pending" | "confirmed" | "rejected";
}

interface BlockchainNodeProps {
  name: string;
  type: string;
  status: "active" | "pending" | "offline";
  lastBlock: string;
  confirmations?: NodeConfirmation[];
}

const blockchainNodes: BlockchainNodeProps[] = [
    { 
      name: "LEA Central Node", 
      type: "Law Enforcement", 
      status: "active", 
      lastBlock: "1024",
      confirmations: []
    },
    { 
      name: "FIU Node 1", 
      type: "Financial Intelligence", 
      status: "active", 
      lastBlock: "1024",
      confirmations: []
    },
    { 
      name: "IND Node", 
      type: "Indian Nodal Dept", 
      status: "active", 
      lastBlock: "1024",
      confirmations: []
    },
    { 
      name: "I4C Node", 
      type: "Cyber Crime Coord", 
      status: "active", 
      lastBlock: "1024",
      confirmations: []
    }
  ];

  const [nodes, setNodes] = useState(blockchainNodes);
  
  useEffect(() => {
    // Simulate real-time confirmations
    const ws = new WebSocket(`wss://${window.location.hostname}/ws`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NODE_CONFIRMATION") {
        setNodes(currentNodes => 
          currentNodes.map(node => 
            node.name === data.nodeName ? {
              ...node,
              confirmations: [
                ...(node.confirmations || []),
                {
                  timestamp: new Date().toISOString(),
                  confirmationHash: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                  status: "confirmed"
                }
              ]
            } : node
          )
        );
      }
    };

    return () => ws.close();
  }, []);

  const verificationSteps = [
    { title: "Case submission", icon: <FileCheck className="h-6 w-6" /> },
    { title: "Blockchain verification", icon: <Database className="h-6 w-6" /> },
    { title: "Multi-node consensus", icon: <ShieldCheck className="h-6 w-6" /> },
    { title: "Evidence hash stored", icon: <Key className="h-6 w-6" /> },
    { title: "Case verified", icon: <CheckCircle2 className="h-6 w-6" /> }
  ];

  const handleDemoVerification = () => {
    setShowVerification(true);
    setCurrentStep(0);
    setIsVerified(false);
    
    // Simulate the verification process steps
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const next = prev + 1;
        if (next >= verificationSteps.length) {
          clearInterval(interval);
          setIsVerified(true);
          return prev;
        }
        return next;
      });
    }, 1500);
  };

  return (
    <Card className="shadow">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
        <CardTitle className="font-semibold text-neutral-dark">Hyperledger Fabric Integration</CardTitle>
        <div className="flex items-center space-x-2">
          <Button 
            onClick={handleDemoVerification}
            variant="default"
            className="h-8 px-4 py-1 text-xs font-medium"
            disabled={showVerification && !isVerified}
          >
            {!showVerification ? "Run Demo" : isVerified ? "Run Again" : "Verifying..."}
          </Button>
        </div>
      </CardHeader>

      <Tabs defaultValue="nodes" className="w-full">
        <div className="px-6 py-2 border-b">
          <TabsList>
            <TabsTrigger value="nodes" className="text-sm">Blockchain Nodes</TabsTrigger>
            <TabsTrigger value="verification" className="text-sm">Case Verification</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm">Analytics</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="nodes" className="pt-2">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {blockchainNodes.map((node, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      node.status === 'active' ? 'bg-green-100' : 
                      node.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                    }`}>
                      <ShieldCheck className={`h-5 w-5 ${
                        node.status === 'active' ? 'text-green-600' : 
                        node.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-neutral-dark">{node.name}</div>
                      <div className="text-xs text-neutral-medium">{node.type}</div>
                      <div className="mt-1 flex items-center">
                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                          node.status === 'active' ? 'bg-green-500' : 
                          node.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></span>
                        <span className="text-xs capitalize">{node.status}</span>
                        <span className="mx-2 text-neutral-light">|</span>
                        <span className="text-xs">Block: {node.lastBlock}</span>
                      </div>
                    </div>
                  </div>
                  
                  {node.confirmations && node.confirmations.length > 0 && (
                    <div className="mt-2 border-t pt-2">
                      <div className="text-xs font-medium mb-1">Recent Confirmations</div>
                      <div className="space-y-1">
                        {node.confirmations.slice(-3).map((conf, idx) => (
                          <div key={idx} className="text-xs flex items-center justify-between">
                            <span className="font-mono text-neutral-600">{conf.confirmationHash.slice(0, 12)}...</span>
                            <span className="text-neutral-500">{new Date(conf.timestamp).toLocaleTimeString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold mb-2">Network Stats</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="border rounded-lg p-3">
                  <div className="text-xs text-neutral-medium">Total Nodes</div>
                  <div className="text-xl font-semibold">6</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-xs text-neutral-medium">Active Channels</div>
                  <div className="text-xl font-semibold">3</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-xs text-neutral-medium">Smart Contracts</div>
                  <div className="text-xl font-semibold">7</div>
                </div>
                <div className="border rounded-lg p-3">
                  <div className="text-xs text-neutral-medium">Avg Response Time</div>
                  <div className="text-xl font-semibold">240ms</div>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="verification" className="pt-2">
          <CardContent className="p-4">
            {!showVerification ? (
              <div className="flex flex-col items-center justify-center p-6 text-center">
                <LockKeyhole className="h-16 w-16 text-neutral-medium opacity-50 mb-3" />
                <h3 className="text-lg font-semibold">Blockchain Case Verification</h3>
                <p className="text-neutral-medium mt-1 max-w-md">
                  This demo shows how cases are verified across multiple stakeholder nodes using 
                  Hyperledger Fabric's consensus mechanism.
                </p>
                <Button 
                  onClick={handleDemoVerification}
                  variant="default" 
                  className="mt-4"
                >
                  Run Verification Demo
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="font-semibold">Case #3921 Verification</h3>
                    <p className="text-sm text-neutral-medium">
                      {isVerified ? 
                        "Case successfully verified and recorded on blockchain" : 
                        "Verifying case across blockchain network..."}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${
                    isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {isVerified ? 'Verified' : 'In Progress'}
                  </div>
                </div>

                <div className="relative">
                  {/* Progress line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200"></div>
                  
                  {/* Steps */}
                  {verificationSteps.map((step, index) => (
                    <div key={index} className="relative flex items-start mb-6">
                      <div className={`z-10 flex items-center justify-center w-8 h-8 rounded-full 
                        ${index <= currentStep ? 'bg-primary text-white' : 'bg-neutral-200 text-neutral-400'}`}>
                        {step.icon}
                      </div>
                      <div className="ml-4">
                        <h4 className={`font-medium ${index <= currentStep ? 'text-neutral-dark' : 'text-neutral-medium'}`}>{step.title}</h4>
                        {index === currentStep && !isVerified && (
                          <div className="mt-1 text-xs text-neutral-medium animate-pulse">Processing...</div>
                        )}
                        {index < currentStep && (
                          <div className="mt-1 text-xs text-green-600 flex items-center">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Complete
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {isVerified && (
                  <div className="mt-4 p-3 bg-neutral-50 rounded-lg border text-sm">
                    <h4 className="font-semibold mb-2">Case Transaction</h4>
                    <div className="font-mono text-xs bg-neutral-100 p-2 rounded overflow-x-auto">
                      <pre>{`{
  "txId": "fb672d7a2fee991ba0f948c42e1f1c843f45c1b9f28c7912b87d0341",
  "timestamp": "${new Date().toISOString()}",
  "channel": "stable-pay-case-channel",
  "chaincode": "case-verification-cc",
  "endorsedBy": ["LEA-Node", "FIU-Node", "I4C-Node"],
  "status": "VALID",
  "caseHash": "25f9e794323b4538a2c9d41a55c34231fb3b1e8e86d9b9c0cb639d4a"
}`}</pre>
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        View on Blockchain Explorer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </TabsContent>

        <TabsContent value="analytics" className="pt-2">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Transaction Types</h3>
                <div className="h-64 border rounded-lg p-4 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart4 className="h-12 w-12 mx-auto mb-2 text-neutral-medium opacity-50" />
                    <p className="text-neutral-medium">Transaction Type Analytics</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-blue-500 rounded-sm mr-2"></span>
                    <span>Case Creation (38%)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-green-500 rounded-sm mr-2"></span>
                    <span>Evidence Upload (27%)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-purple-500 rounded-sm mr-2"></span>
                    <span>KYC Verification (21%)</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-3 h-3 bg-amber-500 rounded-sm mr-2"></span>
                    <span>Case Export (14%)</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Node Performance</h3>
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">LEA Central Node</span>
                      <span className="text-sm font-semibold">99.9%</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "99.9%" }}></div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">FIU Node</span>
                      <span className="text-sm font-semibold">98.5%</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "98.5%" }}></div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">I4C Node</span>
                      <span className="text-sm font-semibold">96.7%</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "96.7%" }}></div>
                    </div>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Court Node</span>
                      <span className="text-sm font-semibold">95.2%</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: "95.2%" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default BlockchainDemo;