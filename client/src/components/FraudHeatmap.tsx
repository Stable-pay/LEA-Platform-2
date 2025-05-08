import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const timeRanges = ["Weekly", "Monthly", "Yearly"];

const FraudHeatmap = () => {
  const [activeTimeRange, setActiveTimeRange] = useState("Monthly");
  
  return (
    <Card className="shadow">
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b border-gray-100">
        <CardTitle className="font-semibold text-neutral-dark">India Fraud Heatmap</CardTitle>
        <div className="flex space-x-2">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={activeTimeRange === range ? "default" : "outline"}
              className="px-3 py-1 h-8 text-xs font-medium"
              onClick={() => setActiveTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Heatmap Visualization */}
        <div className="heatmap flex items-center justify-center">
          <div className="text-neutral-medium text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-neutral-medium opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <p>India Fraud Heatmap Visualization</p>
            <p className="text-xs mt-2">Showing concentration of crypto fraud cases across India</p>
          </div>
        </div>
        
        {/* State Risk Levels */}
        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-neutral-light rounded-md p-2">
            <div className="font-semibold text-neutral-dark">Maharashtra</div>
            <div className="text-status-error font-medium">High Risk</div>
          </div>
          <div className="bg-neutral-light rounded-md p-2">
            <div className="font-semibold text-neutral-dark">Karnataka</div>
            <div className="text-status-warning font-medium">Medium Risk</div>
          </div>
          <div className="bg-neutral-light rounded-md p-2">
            <div className="font-semibold text-neutral-dark">Delhi</div>
            <div className="text-status-warning font-medium">Medium Risk</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FraudHeatmap;
