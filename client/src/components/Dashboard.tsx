
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StatsCard from "./StatsCard";
import RecentCaseActivity from "./RecentCaseActivity";
import QuickActions from "./QuickActions";
import PriorityQueue from "./PriorityQueue";
import BlockchainDemo from "./BlockchainDemo";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard />
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-2/3">
          <BlockchainDemo />
        </div>

        <div className="w-full lg:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-4">
              <RecentCaseActivity />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <QuickActions />
        <PriorityQueue />
      </div>
    </div>
  );
};

export default Dashboard;
