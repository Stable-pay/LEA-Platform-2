typescript blocks. The edited code provides a clean and correct version of the Dashboard.tsx file. Therefore, I will replace the entire original code with the edited code.

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BlockchainDemo from "./BlockchainDemo";
import StatsCard from "./StatsCard";
import RecentCaseActivity from "./RecentCaseActivity";
import QuickActions from "./QuickActions";
import PriorityQueue from "./PriorityQueue";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard />
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <BlockchainDemo />
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
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