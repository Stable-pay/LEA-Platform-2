
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

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

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Crypto Intelligence Feed</span>
          <Badge>Live Updates</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-4 gap-4 mb-4">
            <TabsTrigger value="all">All News</TabsTrigger>
            <TabsTrigger value="regulation">Regulation</TabsTrigger>
            <TabsTrigger value="enforcement">Enforcement</TabsTrigger>
            <TabsTrigger value="technology">Technology</TabsTrigger>
          </TabsList>

          {['all', 'regulation', 'enforcement', 'technology'].map(category => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                {filterNewsByDepartment(news)
                  .filter(item => category === 'all' || item.category.toLowerCase() === category)
                  .map(item => (
                    <Card key={item.id} className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{item.title}</h3>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority || 'info'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.summary}</p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                        <span>{item.source}</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        {item.relevantFor.map(dept => (
                          <Badge key={dept} variant="outline">{dept}</Badge>
                        ))}
                      </div>
                    </Card>
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
