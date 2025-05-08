import CaseFilingForm from "@/components/CaseFilingForm";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { FileCheck, Database, ShieldCheck, User, ArrowRight, CheckCircle } from "lucide-react";

const CaseFiling = () => {
  const { user } = useAuth();
  
  // Get active cases for display
  const { data: cases = [], isLoading: casesLoading } = useQuery({
    queryKey: ["/api/cases"],
    enabled: !!user,
  });
  
  // Get blockchain nodes for illustration
  const { data: nodes = [], isLoading: nodesLoading } = useQuery({
    queryKey: ["/api/blockchain/nodes"],
    enabled: !!user,
  });
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">LEA Case Management</h1>
        <p className="text-neutral-600">
          Create and manage cryptocurrency fraud cases with real-time blockchain verification and inter-department collaboration
        </p>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries({
            ED: "Enforcement Directorate",
            FIU: "Financial Intelligence Unit",
            I4C: "Indian Cybercrime Coordination Centre",
            IT: "Income Tax Department",
            VASP: "Virtual Asset Service Provider",
            BANK: "Banking Institution"
          }).map(([key, value]) => (
            <div key={key} className="bg-white rounded-lg p-3 shadow-sm border flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <div className="text-sm font-medium">{key}</div>
                <div className="text-xs text-neutral-500">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2">
          <CaseFilingForm />
        </div>
        
        <div className="space-y-6">
          {/* Blockchain Network Status */}
          <div className="border rounded-lg shadow-sm p-5 bg-white">
            <h2 className="text-lg font-medium mb-3 flex items-center">
              <Database className="h-5 w-5 mr-2 text-primary" />
              Blockchain Network Status
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span>Network Type</span>
                <span className="font-medium">StablePay Blockchain</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span>Active Stakeholders</span>
                <span className="font-medium">{nodesLoading ? "Loading..." : nodes.length}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span>Consensus Algorithm</span>
                <span className="font-medium">PBFT</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span>Network Status</span>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="font-medium">Operational</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span>Last Block</span>
                <span className="font-mono text-xs">#29364</span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium mb-2">Connected Stakeholders</h3>
              <div className="space-y-2">
                <div className="p-2 bg-neutral-50 rounded flex items-center text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-medium mr-2">LEA Central Node</span>
                  <span className="text-neutral-500">Your Node</span>
                </div>
                <div className="p-2 bg-neutral-50 rounded flex items-center text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-medium">FIU Node 1</span>
                </div>
                <div className="p-2 bg-neutral-50 rounded flex items-center text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-medium">I4C Node</span>
                </div>
                <div className="p-2 bg-neutral-50 rounded flex items-center text-xs">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-medium">Judiciary Node</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Verification Process Explanation */}
          <div className="border rounded-lg shadow-sm p-5 bg-white">
            <h2 className="text-lg font-medium mb-3 flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-primary" />
              Verification Process
            </h2>
            
            <div className="space-y-4">
              <div className="text-sm flex">
                <div className="flex flex-col items-center mr-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">1</div>
                  <div className="w-px h-full bg-neutral-200 my-1"></div>
                </div>
                <div>
                  <h3 className="font-medium">Case Submission</h3>
                  <p className="text-neutral-600 text-xs mt-1">
                    Case details are encrypted and submitted to the blockchain network
                  </p>
                </div>
              </div>
              
              <div className="text-sm flex">
                <div className="flex flex-col items-center mr-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">2</div>
                  <div className="w-px h-full bg-neutral-200 my-1"></div>
                </div>
                <div>
                  <h3 className="font-medium">Node Verification</h3>
                  <p className="text-neutral-600 text-xs mt-1">
                    LEA, FIU, I4C, and IND nodes verify the submission authenticity
                  </p>
                </div>
              </div>
              
              <div className="text-sm flex">
                <div className="flex flex-col items-center mr-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">3</div>
                  <div className="w-px h-full bg-neutral-200 my-1"></div>
                </div>
                <div>
                  <h3 className="font-medium">Consensus Building</h3>
                  <p className="text-neutral-600 text-xs mt-1">
                    PBFT consensus algorithm confirms the validation across nodes
                  </p>
                </div>
              </div>
              
              <div className="text-sm flex">
                <div className="flex flex-col items-center mr-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs">4</div>
                </div>
                <div>
                  <h3 className="font-medium">Transaction Confirmed</h3>
                  <p className="text-neutral-600 text-xs mt-1">
                    Case is permanently recorded in the blockchain with tamper-proof hash
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recently Filed Cases */}
          {!casesLoading && cases.length > 0 && (
            <div className="border rounded-lg shadow-sm p-5 bg-white">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-medium flex items-center">
                  <FileCheck className="h-5 w-5 mr-2 text-primary" />
                  Recent Cases
                </h2>
                <Button variant="link" size="sm" className="h-auto p-0">
                  View All <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-2">
                {cases.slice(0, 3).map((caseItem: any) => (
                  <div 
                    key={caseItem.id} 
                    className="border rounded p-3 text-sm"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">{caseItem.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        caseItem.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        caseItem.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                        caseItem.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {caseItem.priority.charAt(0).toUpperCase() + caseItem.priority.slice(1)}
                      </span>
                    </div>
                    <div className="text-neutral-500 text-xs mt-1">
                      ID: {caseItem.caseId} • {new Date(caseItem.createdAt).toLocaleDateString()}
                    </div>
                    {caseItem.verifiedOnBlockchain && (
                      <div className="mt-2 text-xs flex items-center text-green-600">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified on Blockchain
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CaseFiling;