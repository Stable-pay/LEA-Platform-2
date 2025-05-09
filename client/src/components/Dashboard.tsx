import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "@/components/StatsCard";
import FraudHeatmap from "@/components/FraudHeatmap";
import RecentCaseActivity from "@/components/RecentCaseActivity";
import WalletNetwork from "@/components/WalletNetwork";
import QuickActions from "@/components/QuickActions";
import PriorityQueue from "@/components/PriorityQueue";
import CaseTimeline from "@/components/CaseTimeline";
import { FileText, AlertTriangle, UserCheck, CheckCircle, Presentation, Globe, FileCheck } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-dark">Law Enforcement Agency Dashboard</h1>

        {/* LEA Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800 mt-4">
          <div className="flex items-start">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <Presentation className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-blue-900">Law Enforcement Agency Platform</h3>
              <p className="text-sm mt-1">
                Integrated platform for law enforcement agencies with Hyperledger Fabric integration, 
                cross-chain investigation tools, and judicial export features.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
          changeText="Cross-Chain Support"
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
    </div>
  );
};

export default Dashboard;