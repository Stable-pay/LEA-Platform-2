import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { scaleLinear } from "d3-scale";

const stateStats = [
  { state: "Maharashtra", caseCount: 78, estimatedLoss: 48000000 },
  { state: "Karnataka", caseCount: 42, estimatedLoss: 32000000 },
  { state: "Delhi", caseCount: 38, estimatedLoss: 29000000 },
  { state: "Gujarat", caseCount: 25, estimatedLoss: 18000000 },
  { state: "Tamil Nadu", caseCount: 22, estimatedLoss: 15000000 },
  { state: "Uttar Pradesh", caseCount: 15, estimatedLoss: 12000000 },
  { state: "Telangana", caseCount: 12, estimatedLoss: 9000000 },
  { state: "West Bengal", caseCount: 10, estimatedLoss: 7500000 }
];

const colorScale = scaleLinear()
  .domain([0, 80])
  .range(["#ffedea", "#ff5233"]);
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Filter, Share2 } from "lucide-react";

const ScamHeatmap = () => {
  return (
    <div className="container mx-auto py-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Scam Heatmap</h1>
        <p className="text-muted-foreground">
          State-wise visualization of active frauds and escalations
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          <Card className="shadow">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle>India Crypto Fraud Heatmap</CardTitle>
              <div className="flex items-center gap-2">
                <Select defaultValue="monthly">
                  <SelectTrigger className="w-[120px] h-8 text-xs">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                
                <Button variant="outline" size="sm" className="h-8">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
                
                <Button variant="outline" size="sm" className="h-8">
                  <Share2 className="h-4 w-4 mr-1" />
                  Share
                </Button>
                
                <Button variant="outline" size="sm" className="h-8">
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="heatmap h-[500px]">
                <ComposableMap
                  projection="geoMercator"
                  projectionConfig={{
                    scale: 1000,
                    center: [78.9629, 22.5937]
                  }}
                >
                  <Geographies geography={"/india.json"}>
                    {({ geographies }) =>
                      geographies.map((geo) => {
                        const stateName = geo.properties.name;
                        const stateData = stateStats.find(s => s.state === stateName);
                        const intensity = stateData ? colorScale(stateData.caseCount) : "#F5F5F5";
                        
                        return (
                          <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            fill={intensity}
                            stroke="#FFFFFF"
                            strokeWidth={0.5}
                            style={{
                              default: { outline: "none" },
                              hover: { fill: "#666", outline: "none" },
                              pressed: { outline: "none" }
                            }}
                          />
                        );
                      })
                    }
                  </Geographies>
                </ComposableMap>
              </div>
              
              <div className="mt-4 flex justify-between text-xs">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-100 rounded-full mr-2"></span>
                  <span>Low Risk (0-10 cases)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-100 rounded-full mr-2"></span>
                  <span>Medium Risk (11-30 cases)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-orange-100 rounded-full mr-2"></span>
                  <span>High Risk (31-50 cases)</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-100 rounded-full mr-2"></span>
                  <span>Critical Risk (51+ cases)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <Card className="shadow mb-6">
            <CardHeader>
              <CardTitle>Hotspot Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Maharashtra</span>
                  <Badge variant="error">Critical</Badge>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-status-error rounded-full" style={{ width: "78%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>78 Cases</span>
                  <span>₹4.8 Cr Loss</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Karnataka</span>
                  <Badge variant="warning">High</Badge>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-status-warning rounded-full" style={{ width: "42%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>42 Cases</span>
                  <span>₹3.2 Cr Loss</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Delhi</span>
                  <Badge variant="warning">High</Badge>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-status-warning rounded-full" style={{ width: "38%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>38 Cases</span>
                  <span>₹2.9 Cr Loss</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Gujarat</span>
                  <Badge variant="info">Medium</Badge>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-status-info rounded-full" style={{ width: "25%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>25 Cases</span>
                  <span>₹1.8 Cr Loss</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Tamil Nadu</span>
                  <Badge variant="info">Medium</Badge>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-status-info rounded-full" style={{ width: "22%" }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>22 Cases</span>
                  <span>₹1.5 Cr Loss</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow">
            <CardHeader>
              <CardTitle>Fraud Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Fake Exchanges</span>
                <span className="text-sm font-medium">32%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Investment Scams</span>
                <span className="text-sm font-medium">28%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Phishing Attacks</span>
                <span className="text-sm font-medium">18%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Exchange Hacks</span>
                <span className="text-sm font-medium">12%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Others</span>
                <span className="text-sm font-medium">10%</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="shadow">
        <CardHeader>
          <CardTitle>Trending Scam Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <Badge variant="error" className="w-fit mb-2">Rising Trend</Badge>
                <CardTitle className="text-lg">Fake Exchange Exit Scam</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Fraudulent platforms presenting as legitimate crypto exchanges, collecting deposits before shutting down operations.
                </p>
                <div className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span>Primary States:</span>
                    <span className="font-medium">Maharashtra, Delhi</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Loss:</span>
                    <span className="font-medium">₹3.2 Cr</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <Badge variant="warning" className="w-fit mb-2">Persistent</Badge>
                <CardTitle className="text-lg">Investment Ponzi Scheme</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Multi-level marketing schemes promising unrealistic crypto returns, using new investor funds to pay existing members.
                </p>
                <div className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span>Primary States:</span>
                    <span className="font-medium">Karnataka, Tamil Nadu</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Loss:</span>
                    <span className="font-medium">₹2.8 Cr</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <Badge variant="info" className="w-fit mb-2">Emerging</Badge>
                <CardTitle className="text-lg">Fake KYC Data Theft</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Phishing attacks targeting exchange users' KYC information for identity theft and account takeovers.
                </p>
                <div className="text-xs">
                  <div className="flex justify-between mb-1">
                    <span>Primary States:</span>
                    <span className="font-medium">Delhi, Gujarat</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Loss:</span>
                    <span className="font-medium">₹1.5 Cr</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScamHeatmap;
