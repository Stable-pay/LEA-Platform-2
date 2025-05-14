
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { InfoIcon, AlertTriangle, Bell, Book, FileText, Database, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  source: string;
  summary: string;
  relevantFor: string[];
  date: Date;
  priority?: 'high' | 'medium' | 'low';
  impact?: string;
  lawReference?: string;
}

export const CryptoNewsSection = () => {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    fetch('/api/crypto-news')
      .then(res => res.json())
      .then(data => setNews(data));
  }, []);

  const getDepartmentIcon = (category: string) => {
    switch (category) {
      case 'FIU':
        return <Database className="h-4 w-4" />;
      case 'ED':
        return <Shield className="h-4 w-4" />;
      case 'I4C':
        return <AlertTriangle className="h-4 w-4" />;
      case 'IT':
        return <FileText className="h-4 w-4" />;
      case 'VASP':
        return <Book className="h-4 w-4" />;
      default:
        return <InfoIcon className="h-4 w-4" />;
    }
  };

  const filterNewsByDepartment = (items: NewsItem[]) => {
    if (selectedDepartment === 'all') return items;
    return items.filter(item => 
      item.relevantFor.includes(selectedDepartment) || 
      (user?.department === selectedDepartment && item.priority === 'high')
    );
  };

  const getPriorityBadge = (priority?: string) => {
    const colors = {
      high: 'bg-red-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return (
      <Badge className={priority ? colors[priority as keyof typeof colors] : 'bg-blue-500'}>
        {priority || 'info'}
      </Badge>
    );
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Department Intelligence Feed</span>
          <Badge variant="outline" className="animate-pulse">Live Updates</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 lg:grid-cols-7 gap-2 mb-4">
            <TabsTrigger value="all">All Updates</TabsTrigger>
            <TabsTrigger value="FIU">FIU-IND</TabsTrigger>
            <TabsTrigger value="ED">ED</TabsTrigger>
            <TabsTrigger value="I4C">I4C</TabsTrigger>
            <TabsTrigger value="IT">Income Tax</TabsTrigger>
            <TabsTrigger value="VASP">VASP</TabsTrigger>
            <TabsTrigger value="alerts">Priority</TabsTrigger>
          </TabsList>

          {['all', 'FIU', 'ED', 'I4C', 'IT', 'VASP', 'alerts'].map(category => (
            <TabsContent key={category} value={category}>
              <div className="space-y-4">
                {filterNewsByDepartment(news)
                  .filter(item => {
                    if (category === 'alerts') return item.priority === 'high';
                    if (category === 'all') return true;
                    return item.relevantFor.includes(category);
                  })
                  .map(item => (
                    <Alert 
                      key={item.id} 
                      className="border-l-4" 
                      variant={item.priority === 'high' ? 'destructive' : 'default'}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <AlertTitle className="font-semibold flex items-center gap-2">
                          {getDepartmentIcon(item.category)}
                          {item.title}
                        </AlertTitle>
                        {getPriorityBadge(item.priority)}
                      </div>
                      <AlertDescription>
                        <p className="text-sm mb-2">{item.summary}</p>
                        {item.lawReference && (
                          <p className="text-xs text-muted-foreground mb-2">
                            <strong>Legal Reference:</strong> {item.lawReference}
                          </p>
                        )}
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
                            <Badge key={dept} variant="outline">
                              {dept}
                            </Badge>
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
