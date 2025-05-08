import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimelineEventProps {
  title: string;
  date: string;
  description: string;
  status: "error" | "warning" | "info" | "success";
}

const TimelineEvent = ({ title, date, description, status }: TimelineEventProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "error": return "bg-status-error";
      case "warning": return "bg-status-warning";
      case "info": return "bg-status-info";
      case "success": return "bg-status-success";
    }
  };
  
  return (
    <div className="relative pl-6 pb-4 border-l border-neutral-light">
      <div className={cn("absolute left-0 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white", getStatusColor())}></div>
      <div className="text-xs">
        <div className="font-medium text-neutral-dark">{title}</div>
        <div className="text-neutral-medium">{date}</div>
        <div className="mt-1 text-neutral-dark">{description}</div>
      </div>
    </div>
  );
};

const CaseTimeline = () => {
  const timelineEvents: TimelineEventProps[] = [
    {
      title: "Case Intake",
      date: "Jun 10, 2023 - 10:23 AM",
      description: "Initial report from victim, ₹1.2 Cr loss reported",
      status: "error"
    },
    {
      title: "Wallet Check",
      date: "Jun 10, 2023 - 11:45 AM",
      description: "5 wallets identified, linked to known scam cluster",
      status: "warning"
    },
    {
      title: "KYC Request Sent",
      date: "Jun 11, 2023 - 09:30 AM",
      description: "Exchange verification requested for primary wallet",
      status: "info"
    }
  ];
  
  return (
    <Card className="shadow">
      <CardHeader className="py-4 px-6 border-b border-gray-100">
        <CardTitle className="font-semibold text-neutral-dark">Active Case Timeline</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium">Case #3912</h3>
          <Badge variant="error">Critical</Badge>
        </div>
        
        {/* Timeline Visualization Placeholder */}
        <div className="case-timeline mb-3">
          <div className="text-neutral-medium text-xs text-center flex items-center justify-center h-full">
            Timeline visualization would appear here
          </div>
        </div>
        
        {/* Timeline Events */}
        <div className="space-y-4">
          {timelineEvents.map((event, index) => (
            <TimelineEvent key={index} {...event} />
          ))}
        </div>
        
        <Button variant="outline" className="w-full mt-4 text-center text-primary font-medium border-primary">
          View Complete Timeline
        </Button>
      </CardContent>
    </Card>
  );
};

export default CaseTimeline;
