import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/StatsCard";
import FraudHeatmap from "@/components/FraudHeatmap";
import RecentCaseActivity from "@/components/RecentCaseActivity";
import WalletNetwork from "@/components/WalletNetwork";
import QuickActions from "@/components/QuickActions";
import PriorityQueue from "@/components/PriorityQueue";
import CaseTimeline from "@/components/CaseTimeline";
import BlockchainDemo from "@/components/BlockchainDemo";
import CrossChainExplorer from "@/components/CrossChainExplorer";
import CourtExportDemo from "@/components/CourtExportDemo";
import { FileText, AlertTriangle, UserCheck, CheckCircle, Presentation, BarChart, FileCheck, Globe } from "lucide-react";

const Dashboard = () => {
  const [dashboardView, setDashboardView] = useState<"standard" | "demo">("standard");
  
  return (
    <div>
      {/* Dashboard View Switcher */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-dark">
          {dashboardView === "standard" ? "Dashboard" : "LEA Demo Dashboard"}
        </h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant={dashboardView === "standard" ? "default" : "outline"}
            onClick={() => setDashboardView("standard")}
            className="h-9"
          >
            <BarChart className="h-4 w-4 mr-2" />
            Standard View
          </Button>
          <Button 
            variant={dashboardView === "demo" ? "default" : "outline"}
            onClick={() => setDashboardView("demo")}
            className="h-9"
          >
            <Presentation className="h-4 w-4 mr-2" />
            LEA Showcase
          </Button>
        </div>
      </div>
      
      {dashboardView === "standard" ? (
        <>
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Active Cases"
              value="28"
              icon={<FileText className="h-6 w-6 text-primary" />}
              iconBgColor="bg-primary-light/10"
              changePercentage={12}
            />
            
            <StatsCard
              title="Flagged Wallets"
              value="156"
              icon={<AlertTriangle className="h-6 w-6 text-status-warning" />}
              iconBgColor="bg-status-warning/10"
              changePercentage={25}
            />
            
            <StatsCard
              title="KYC Verifications"
              value="42"
              icon={<UserCheck className="h-6 w-6 text-secondary" />}
              iconBgColor="bg-secondary-light/10"
              changePercentage={8}
            />
            
            <StatsCard
              title="Cases Resolved"
              value="19"
              icon={<CheckCircle className="h-6 w-6 text-status-success" />}
              iconBgColor="bg-status-success/10"
              changePercentage={5}
            />
          </div>
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
              <FraudHeatmap />
              <RecentCaseActivity />
              <WalletNetwork />
            </div>
            
            {/* Sidebar Column */}
            <div className="space-y-6">
              <QuickActions />
              <PriorityQueue />
              <CaseTimeline />
            </div>
          </div>
        </>
      ) : (
        <div className="space-y-8">
          {/* LEA Demonstration Dashboard */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
            <div className="flex items-start">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Presentation className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-blue-900">Law Enforcement Agency Demonstration</h3>
                <p className="text-sm mt-1">
                  This showcase demonstrates the Stable Pay platform's capabilities for law enforcement agencies, 
                  including Hyperledger Fabric integration, cross-chain investigation tools, and judicial export features.
                </p>
              </div>
            </div>
          </div>
          
          {/* LEA Integration Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Stakeholder Nodes"
              value="6"
              icon={<Globe className="h-6 w-6 text-primary" />}
              iconBgColor="bg-primary-light/10"
              changeText="LEA, FIU, IND, I4C"
            />
            
            <StatsCard
              title="Blockchain Transactions"
              value="1,024"
              icon={<FileCheck className="h-6 w-6 text-green-600" />}
              iconBgColor="bg-green-100"
              changeText="100% Verifiable"
            />
            
            <StatsCard
              title="Supported Networks"
              value="5"
              icon={<Globe className="h-6 w-6 text-purple-600" />}
              iconBgColor="bg-purple-100"
              changeText="ETH, BTC, TRX, BNB, SOL"
            />
          </div>
          
          {/* Main Integration Demos */}
          <Tabs defaultValue="hyperledger" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="hyperledger" className="text-sm">Hyperledger Fabric Integration</TabsTrigger>
              <TabsTrigger value="cross-chain" className="text-sm">Cross-Chain Explorer</TabsTrigger>
              <TabsTrigger value="court-export" className="text-sm">Judicial Export System</TabsTrigger>
            </TabsList>
            
            <TabsContent value="hyperledger">
              <BlockchainDemo />
            </TabsContent>
            
            <TabsContent value="cross-chain">
              <CrossChainExplorer />
            </TabsContent>
            
            <TabsContent value="court-export">
              <CourtExportDemo />
            </TabsContent>
          </Tabs>
          
          {/* Activity Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentCaseActivity />
            </div>
            <div>
              <PriorityQueue />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
