
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, AlertTriangle, Bell } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  source: string;
  summary: string;
  relevantFor: string[];
  date: Date;
  priority?: 'high' | 'medium' | 'low';
  relatedCases?: string[];
  impact?: string;
}

export const CryptoNewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    fetch('/api/crypto-news')
      .then(res => res.json())
      .then(data => setNews(data));
  }, []);

  const filterNewsByDepartment = (items: NewsItem[]) => {
    if (selectedDepartment === 'all') return items;
    return items.filter(item => item.relevantFor.includes(selectedDepartment));
  };

  const getPriorityBadge = (priority?: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return (
      <Badge className={priority ? colors[priority] : 'bg-blue-500'}>
        {priority || 'info'}
      </Badge>
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Intelligence Feed</span>
          <Badge variant="outline">Live Updates</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 gap-4 mb-4">
            <TabsTrigger value="all">All Updates</TabsTrigger>
            <TabsTrigger value="regulation">Regulatory</TabsTrigger>
            <TabsTrigger value="enforcement">LEA Updates</TabsTrigger>
            <TabsTrigger value="alerts">Priority Alerts</TabsTrigger>
          </TabsList>

          {['all', 'regulation', 'enforcement', 'alerts'].map(category => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                {filterNewsByDepartment(news)
                  .filter(item => {
                    if (category === 'alerts') return item.priority === 'high';
                    if (category === 'all') return true;
                    return item.category.toLowerCase() === category;
                  })
                  .map(item => (
                    <Alert key={item.id} className="border-l-4" variant={item.priority === 'high' ? 'destructive' : 'default'}>
                      <div className="flex justify-between items-start mb-2">
                        <AlertTitle className="font-semibold flex items-center gap-2">
                          {item.category === 'regulation' && <InfoIcon className="h-4 w-4" />}
                          {item.category === 'enforcement' && <AlertTriangle className="h-4 w-4" />}
                          {item.title}
                        </AlertTitle>
                        {getPriorityBadge(item.priority)}
                      </div>
                      <AlertDescription>
                        <p className="text-sm mb-2">{item.summary}</p>
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                          <span>{new Date(item.date).toLocaleDateString()}</span>
                          <span>{item.source}</span>
                        </div>
                        {item.impact && (
                          <div className="mt-2 text-sm">
                            <strong>Impact: </strong>{item.impact}
                          </div>
                        )}
                        <div className="mt-2 flex gap-2">
                          {item.relevantFor.map(dept => (
                            <Badge key={dept} variant="outline">{dept}</Badge>
                          ))}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CryptoNewsSection;
