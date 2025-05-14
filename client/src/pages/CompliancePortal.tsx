
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CompliancePortal() {
  const [complianceStats, setComplianceStats] = useState({
    totalCases: 0,
    pendingReview: 0,
    recentUpdates: []
  });

  useEffect(() => {
    // Fetch compliance stats
    fetch('/api/compliance/stats')
      .then(res => res.json())
      .then(data => setComplianceStats(data))
      .catch(err => console.error('Error fetching compliance stats:', err));
  }, []);

  return (
    <div className="container mx-auto py-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Compliance Portal</h1>
        <p className="text-muted-foreground">
          Regulatory compliance and reporting dashboard
        </p>
      </div>

      <Tabs defaultValue="requirements">
        <TabsList>
          <TabsTrigger value="requirements">Requirements</TabsTrigger>
          <TabsTrigger value="reports">Compliance Reports</TabsTrigger>
          <TabsTrigger value="audits">Audit Logs</TabsTrigger>
          <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requirements">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>PMLA Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Prevention of Money Laundering Act requirements and guidelines</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>KYC/AML Standards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Know Your Customer and Anti-Money Laundering compliance standards</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Reporting Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Mandatory reporting schedules and thresholds</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Reports</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>Generate and view monthly compliance reports</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Quarterly Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>View quarterly compliance analysis and trends</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audits">
          <Card>
            <CardHeader>
              <CardTitle>Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {complianceStats.recentUpdates.map((update, index) => (
                  <div key={index} className="p-4 border rounded">
                    <p className="font-medium">{update.title}</p>
                    <p className="text-sm text-muted-foreground">{update.timestamp}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle>KYC Verification Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <span>Total Cases</span>
                  <span className="font-bold">{complianceStats.totalCases}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pending Review</span>
                  <span className="font-bold text-amber-500">{complianceStats.pendingReview}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
