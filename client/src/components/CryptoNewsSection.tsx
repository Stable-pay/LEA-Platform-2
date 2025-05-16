import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface NewsItem {
  id: string;
  title: string;
  description: string;
  source: string;
  date: string;
  url: string;
}

export function CryptoNewsSection() {
  const enforcementNews = useQuery({
    queryKey: ['enforcement-news'],
    queryFn: async () => {
      const res = await fetch('/api/news/enforcement');
      if (!res.ok) throw new Error('Failed to fetch enforcement news');
      return res.json();
    }
  });

  const regulatoryNews = useQuery({
    queryKey: ['regulatory-news'],
    queryFn: async () => {
      const res = await fetch('/api/news/regulatory');
      if (!res.ok) throw new Error('Failed to fetch regulatory news');
      return res.json();
    }
  });

  const cryptoNews = useQuery({
    queryKey: ['crypto-news'],
    queryFn: async () => {
      const res = await fetch('/api/news/crypto');
      if (!res.ok) throw new Error('Failed to fetch crypto news');
      return res.json();
    }
  });

  const renderNews = (news: NewsItem[]) => (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        {news?.map((item) => (
          <Card key={item.id} className="p-4">
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{item.source}</span>
              <span>{new Date(item.date).toLocaleDateString()}</span>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intelligence Feed</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="enforcement">
          <TabsList>
            <TabsTrigger value="enforcement">Law Enforcement</TabsTrigger>
            <TabsTrigger value="regulatory">Regulatory</TabsTrigger>
            <TabsTrigger value="crypto">Crypto Updates</TabsTrigger>
          </TabsList>

          <TabsContent value="enforcement">
            {enforcementNews.isLoading ? (
              <div>Loading enforcement news...</div>
            ) : (
              renderNews(enforcementNews.data || [])
            )}
          </TabsContent>

          <TabsContent value="regulatory">
            {regulatoryNews.isLoading ? (
              <div>Loading regulatory news...</div>
            ) : (
              renderNews(regulatoryNews.data || [])
            )}
          </TabsContent>

          <TabsContent value="crypto">
            {cryptoNews.isLoading ? (
              <div>Loading crypto news...</div>
            ) : (
              renderNews(cryptoNews.data || [])
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}