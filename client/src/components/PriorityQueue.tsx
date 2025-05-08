import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PriorityCaseProps {
  id: string;
  title: string;
  description: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  assignees: number;
  updatedTime: string;
}

const PriorityCase = ({ id, title, description, priority, assignees, updatedTime }: PriorityCaseProps) => {
  const getBorderColor = () => {
    switch (priority) {
      case "Critical": return "border-status-error";
      case "High": return "border-status-warning";
      case "Medium": return "border-status-info";
      case "Low": return "border-status-success";
    }
  };
  
  const getBgColor = () => {
    switch (priority) {
      case "Critical": return "bg-status-error/5";
      case "High": return "bg-status-warning/5";
      case "Medium": return "bg-status-info/5";
      case "Low": return "bg-status-success/5";
    }
  };
  
  const getTextColor = () => {
    switch (priority) {
      case "Critical": return "text-status-error";
      case "High": return "text-status-warning";
      case "Medium": return "text-status-info";
      case "Low": return "text-status-success";
    }
  };
  
  return (
    <div className={cn("border-l-4 p-3 rounded-r-md", getBorderColor(), getBgColor())}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-neutral-dark text-sm">#{id} - {title}</h3>
          <p className="text-xs text-neutral-medium mt-1">{description}</p>
        </div>
        <span className={cn("text-xs font-medium", getTextColor())}>{priority}</span>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div className="flex -space-x-1">
          {Array(assignees).fill(0).map((_, i) => (
            <div key={i} className="w-5 h-5 rounded-full border-2 border-white bg-neutral-medium"></div>
          ))}
        </div>
        <span className="text-xs text-neutral-medium">Updated {updatedTime}</span>
      </div>
    </div>
  );
};

const PriorityQueue = () => {
  const priorityCases: PriorityCaseProps[] = [
    {
      id: "3912",
      title: "Multi-Exchange Fraud",
      description: "Reported by 6 victims, estimated loss ₹4.8 Cr",
      priority: "Critical",
      assignees: 2,
      updatedTime: "1hr ago"
    },
    {
      id: "3889",
      title: "Fake Exchange KYC",
      description: "Similar pattern to #3756, new wallet cluster",
      priority: "High",
      assignees: 1,
      updatedTime: "3hrs ago"
    },
    {
      id: "3867",
      title: "Phishing Attempt",
      description: "Wallet check pending, exchange compliance in progress",
      priority: "Medium",
      assignees: 2,
      updatedTime: "1d ago"
    }
  ];
  
  return (
    <Card className="shadow">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
        <CardTitle className="font-semibold text-neutral-dark">Priority Cases</CardTitle>
        <button className="text-primary text-sm font-medium">View All</button>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {priorityCases.map((priorityCase) => (
          <PriorityCase key={priorityCase.id} {...priorityCase} />
        ))}
      </CardContent>
    </Card>
  );
};

export default PriorityQueue;
