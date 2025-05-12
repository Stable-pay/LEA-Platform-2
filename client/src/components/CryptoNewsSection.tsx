
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { format } from "date-fns";

export function CryptoNewsSection() {
  const { data: news = [] } = useQuery({
    queryKey: ['crypto-news'],
    queryFn: async () => {
      const res = await fetch('/api/crypto-news');
      if (!res.ok) throw new Error('Failed to fetch news');
      return res.json();
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Crypto Regulatory News & Updates</span>
          <Badge variant="outline">Live Feed</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {news.map((item: any) => (
              <Card key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{item.summary}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Source: {item.source}</span>
                  <span>{format(new Date(item.date), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {item.relevantFor.map((dept: string) => (
                    <Badge key={dept} variant="outline" className="text-xs">
                      {dept}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
