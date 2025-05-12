import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  link?: string;
}

export default function StatsCard({ title, value, description, link }: StatsCardProps) {
  const [, setLocation] = useLocation();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {link && (
          <Button 
            variant="ghost" 
            className="mt-2 p-0 h-auto" 
            onClick={() => setLocation(link)}
          >
            View Details <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}