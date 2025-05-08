import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatWalletAddress, getRiskLevelBgColor, getRiskLevelColor } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";

interface CaseActivityProps {
  icon: React.ReactNode;
  iconBackground: string;
  title: string;
  time: string;
  description: React.ReactNode;
  status: string;
  statusVariant: "error" | "info" | "success" | "warning";
}

const CaseActivity = ({ 
  icon, 
  iconBackground, 
  title, 
  time, 
  description, 
  status, 
  statusVariant 
}: CaseActivityProps) => {
  return (
    <div className="p-4 hover:bg-neutral-lightest">
      <div className="flex items-start space-x-4">
        <div className={`${iconBackground} rounded-full p-2 mt-1`}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-neutral-dark">{title}</h3>
            <span className="text-xs text-neutral-medium">{time}</span>
          </div>
          <p className="text-sm text-neutral-medium mt-1">{description}</p>
          <div className="mt-2 flex items-center justify-between">
            <Badge variant={statusVariant}>{status}</Badge>
            <button className="text-primary text-sm">View Details</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const RecentCaseActivity = () => {
  const activities = [
    {
      icon: <AlertTriangle className="h-5 w-5 text-status-error" />,
      iconBackground: "bg-status-error/10",
      title: "High Risk Wallet Detected",
      time: "2 hours ago",
      description: (
        <>
          Wallet <span className="font-mono text-xs bg-neutral-light px-1 py-0.5 rounded">
            {formatWalletAddress("0x7fD...e2D8")}
          </span> flagged for suspicious activity pattern
        </>
      ),
      status: "High Risk",
      statusVariant: "error" as const,
    },
    {
      icon: <Info className="h-5 w-5 text-status-info" />,
      iconBackground: "bg-status-info/10",
      title: "KYC Verification Requested",
      time: "5 hours ago",
      description: (
        <>
          Case #3892: Exchange verification requested for wallet <span className="font-mono text-xs bg-neutral-light px-1 py-0.5 rounded">
            {formatWalletAddress("0x4eA...f87B")}
          </span>
        </>
      ),
      status: "In Progress",
      statusVariant: "info" as const,
    },
    {
      icon: <CheckCircle className="h-5 w-5 text-status-success" />,
      iconBackground: "bg-status-success/10",
      title: "Case Exported to Court",
      time: "Yesterday",
      description: "Case #3756: Complete case file exported for judicial proceedings",
      status: "Completed",
      statusVariant: "success" as const,
    },
  ];
  
  return (
    <Card className="shadow">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
        <CardTitle className="font-semibold text-neutral-dark">Recent Case Activity</CardTitle>
        <button className="text-primary text-sm font-medium">View All</button>
      </CardHeader>
      <CardContent className="p-0 divide-y">
        {activities.map((activity, index) => (
          <CaseActivity key={index} {...activity} />
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentCaseActivity;
