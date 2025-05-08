
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShieldCheck, Key, LockKeyhole, FileCheck, Database, BarChart4, ArrowRight, CheckCircle2, MapPin, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

interface BlockchainNodeProps {
  name: string;
  type: string;
  status: "initiated" | "pending" | "confirmed" | "rejected";
  lastBlock: string;
  location: {
    lat: number;
    lng: number;
    state: string;
  };
  confirmations: NodeConfirmation[];
  details?: string;
  assignedTo?: string;
}

interface NodeConfirmation {
  department: string;
  timestamp: string;
  status: "pending" | "confirmed" | "rejected";
  details: string;
  signatureHash: string;
}

const DEPARTMENTS = {
  LEA: "Law Enforcement",
  FIU: "Financial Intelligence",
  IND: "Indian Nodal Dept",
  I4C: "Cyber Crime Coord"
};

const BlockchainDemo = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [nodes, setNodes] = useState<BlockchainNodeProps[]>([]);
  const [selectedNode, setSelectedNode] = useState<BlockchainNodeProps | null>(null);
  const [confirmationDetails, setConfirmationDetails] = useState("");
  const [assignToDepartment, setAssignToDepartment] = useState("");
  const [newCaseDetails, setNewCaseDetails] = useState("");

  useEffect(() => {
    // Simulate loading initial nodes
    setNodes([
      {
        name: "Case #1024",
        type: "LEA",
        status: "initiated",
        lastBlock: "1024",
        location: { lat: 28.6139, lng: 77.2090, state: "Delhi" },
        confirmations: [],
        details: "Initial case filing from Delhi Police"
      }
    ]);
  }, []);

  const initiateNewCase = () => {
    if (!newCaseDetails) return;

    const newCase: BlockchainNodeProps = {
      name: `Case #${Date.now().toString().slice(-4)}`,
      type: "LEA",
      status: "initiated",
      lastBlock: Date.now().toString(),
      location: { lat: 28.6139, lng: 77.2090, state: "Delhi" },
      confirmations: [],
      details: newCaseDetails
    };

    setNodes(prev => [...prev, newCase]);
    setNewCaseDetails("");
    
    toast({
      title: "New Case Initiated",
      description: "The case has been added to the blockchain network",
    });
  };

  const assignNode = () => {
    if (!selectedNode || !assignToDepartment) return;

    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.name === selectedNode.name
          ? {
              ...node,
              assignedTo: assignToDepartment,
              status: "pending"
            }
          : node
      )
    );

    toast({
      title: "Case Assigned",
      description: `Case assigned to ${DEPARTMENTS[assignToDepartment as keyof typeof DEPARTMENTS]}`,
    });

    setSelectedNode(null);
    setAssignToDepartment("");
  };

  const confirmNode = () => {
    if (!selectedNode || !confirmationDetails) return;

    const userDepartment = user?.department || "LEA";

    setNodes(prevNodes =>
      prevNodes.map(node =>
        node.name === selectedNode.name
          ? {
              ...node,
              status: "confirmed",
              confirmations: [
                ...node.confirmations,
                {
                  department: userDepartment,
                  timestamp: new Date().toISOString(),
                  status: "confirmed",
                  details: confirmationDetails,
                  signatureHash: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                }
              ]
            }
          : node
      )
    );

    toast({
      title: "Node Confirmed",
      description: `${selectedNode.name} has been confirmed by ${userDepartment}`,
    });

    setConfirmationDetails("");
    setSelectedNode(null);
  };

  const getDepartmentNodes = (department: string) => {
    return nodes.filter(node => 
      node.type === department || node.assignedTo === department
    );
  };

  const renderDepartmentDashboard = (department: string) => (
    <div className="space-y-4">
      {department === "LEA" && (
        <Card>
          <CardHeader>
            <CardTitle>Initiate New Case</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter case details..."
                value={newCaseDetails}
                onChange={(e) => setNewCaseDetails(e.target.value)}
              />
              <Button onClick={initiateNewCase} disabled={!newCaseDetails}>
                Create Case Node
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getDepartmentNodes(department).map((node) => (
          <Card
            key={node.name}
            className={`cursor-pointer ${
              selectedNode?.name === node.name ? 'border-primary' : ''
            }`}
            onClick={() => setSelectedNode(node)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    node.status === 'confirmed' ? 'bg-green-500' :
                    node.status === 'initiated' ? 'bg-blue-500' :
                    node.status === 'rejected' ? 'bg-red-500' :
                    'bg-yellow-500'
                  }`} />
                  <div>
                    <div className="font-medium">{node.name}</div>
                    <div className="text-sm text-gray-500">{DEPARTMENTS[node.type as keyof typeof DEPARTMENTS]}</div>
                  </div>
                </div>
                <Badge>{node.status}</Badge>
              </div>

              {node.details && (
                <p className="text-sm text-gray-600 mt-2">{node.details}</p>
              )}

              {node.confirmations.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Confirmations:</h4>
                  {node.confirmations.map((conf, idx) => (
                    <div key={idx} className="text-xs text-gray-500 flex justify-between bg-secondary p-2 rounded">
                      <span>{DEPARTMENTS[conf.department as keyof typeof DEPARTMENTS]}</span>
                      <span>{new Date(conf.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedNode && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Node Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {department === "LEA" && selectedNode.status === "initiated" && (
              <>
                <Select value={assignToDepartment} onValueChange={setAssignToDepartment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Assign to department..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FIU">Financial Intelligence Unit</SelectItem>
                    <SelectItem value="IND">Indian Nodal Department</SelectItem>
                    <SelectItem value="I4C">Cyber Crime Coordination</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={assignNode} disabled={!assignToDepartment}>
                  Assign Case
                </Button>
              </>
            )}
            
            {selectedNode.assignedTo === department && (
              <>
                <Textarea
                  placeholder="Enter confirmation details..."
                  value={confirmationDetails}
                  onChange={(e) => setConfirmationDetails(e.target.value)}
                />
                <Button onClick={confirmNode} disabled={!confirmationDetails}>
                  Confirm Node
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Department Dashboards</CardTitle>
      </CardHeader>
      <Tabs defaultValue="LEA" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="LEA">LEA</TabsTrigger>
          <TabsTrigger value="FIU">FIU</TabsTrigger>
          <TabsTrigger value="IND">IND</TabsTrigger>
          <TabsTrigger value="I4C">I4C</TabsTrigger>
        </TabsList>

        <TabsContent value="LEA">
          <CardContent>
            {renderDepartmentDashboard("LEA")}
          </CardContent>
        </TabsContent>

        <TabsContent value="FIU">
          <CardContent>
            {renderDepartmentDashboard("FIU")}
          </CardContent>
        </TabsContent>

        <TabsContent value="IND">
          <CardContent>
            {renderDepartmentDashboard("IND")}
          </CardContent>
        </TabsContent>

        <TabsContent value="I4C">
          <CardContent>
            {renderDepartmentDashboard("I4C")}
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default BlockchainDemo;
