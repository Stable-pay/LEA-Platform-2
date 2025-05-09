
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "./StatsCard";
import RecentCaseActivity from "./RecentCaseActivity";
import QuickActions from "./QuickActions";
import PriorityQueue from "./PriorityQueue";
import BlockchainDemo from "./BlockchainDemo";
import { useAuth } from "@/hooks/use-auth";

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div className="space-y-6 p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          {user?.department === 'FIU' && 'Financial Intelligence Unit Dashboard'}
          {user?.department === 'ED' && 'Enforcement Directorate Dashboard'}
          {user?.department === 'I4C' && 'Indian Cybercrime Coordination Centre Dashboard'}
          {user?.department === 'IT' && 'Income Tax Department Dashboard'}
          {user?.department === 'VASP' && 'Virtual Asset Service Provider Dashboard'}
          {user?.department === 'BANK' && 'Banking Institution Dashboard'}
          {!user?.department && 'Law Enforcement Intelligence Dashboard'}
        </h1>
        <p className="text-neutral-600">Cryptocurrency Crime Investigation & Analysis Platform</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Active Cases"
          value={42}
          icon={<div className="text-blue-500">📁</div>}
          iconBgColor="bg-blue-100"
          changePercentage={12}
          changeText="vs last month"
        />
        <StatsCard
          title="Pending Investigations"
          value={28}
          icon={<div className="text-amber-500">🔍</div>}
          iconBgColor="bg-amber-100"
          changePercentage={-5}
          changeText="vs last month"
        />
        <StatsCard
          title="Assets Tracked"
          value="₹2.4Cr"
          icon={<div className="text-green-500">💰</div>}
          iconBgColor="bg-green-100"
          changePercentage={8}
          changeText="increase in value"
        />
        <StatsCard
          title="Recovery Rate"
          value="68%"
          icon={<div className="text-purple-500">📈</div>}
          iconBgColor="bg-purple-100"
          changePercentage={15}
          changeText="improvement"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Blockchain Transaction Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <BlockchainDemo />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentCaseActivity />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Priority Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <QuickActions />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>High Priority Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <PriorityQueue />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
