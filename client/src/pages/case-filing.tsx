import { useState } from "react";
import CaseFilingForm from "@/components/CaseFilingForm";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { FileCheck, Database, ShieldCheck, ArrowRight, CheckCircle } from "lucide-react";

const CaseFiling = () => {
  const { user } = useAuth();
  const [departmentValidated, setDepartmentValidated] = useState(false);
  const [blockchainStatus, setBlockchainStatus] = useState<'pending' | 'verified' | 'failed'>('pending');

  // Get active cases for display
  const { data: cases = [], isLoading: casesLoading } = useQuery({
    queryKey: ["/api/cases"],
    enabled: !!user,
  });

  // Get blockchain nodes for display
  const { data: nodes = [], isLoading: nodesLoading } = useQuery({
    queryKey: ["/api/blockchain/nodes"],
    enabled: !!user,
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">LEA Information Sharing & Intel Platform</h1>
        <p className="text-neutral-600">
          Create and manage cryptocurrency fraud cases with real-time blockchain verification
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
              <div className={`w-2 h-2 rounded-full ${nodes?.some(n => n.nodeId.includes(key)) ? 'bg-green-500' : 'bg-red-500'}`}></div>
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
                <span>Network Status</span>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="font-medium">Operational</span>
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