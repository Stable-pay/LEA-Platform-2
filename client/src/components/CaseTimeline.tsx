import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';

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

export const CaseTimeline = ({ caseId }: { caseId: string }) => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const { data: timelineEvents, isLoading } = useQuery({
    queryKey: ['timeline', caseId],
    queryFn: async () => {
      const response = await fetch(`/api/case-timeline/${caseId}`);
      if (!response.ok) throw new Error('Failed to fetch timeline');
      return response.json();
    }
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-4">{/* Add loading skeleton */}</div>;
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {timelineEvents?.map((event: any) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedEvent(event.id === selectedEvent ? null : event.id)}
            className="cursor-pointer"
          >
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
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default CaseTimeline;