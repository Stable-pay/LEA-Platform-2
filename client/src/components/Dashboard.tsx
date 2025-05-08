import StatsCard from "@/components/StatsCard";
import FraudHeatmap from "@/components/FraudHeatmap";
import RecentCaseActivity from "@/components/RecentCaseActivity";
import WalletNetwork from "@/components/WalletNetwork";
import QuickActions from "@/components/QuickActions";
import PriorityQueue from "@/components/PriorityQueue";
import CaseTimeline from "@/components/CaseTimeline";
import { FileText, AlertTriangle, UserCheck, CheckCircle } from "lucide-react";

const Dashboard = () => {
  return (
    <div>
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
    </div>
  );
};

export default Dashboard;
