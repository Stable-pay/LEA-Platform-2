import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch } from 'wouter';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Dashboard';
import CaseManagement from '@/pages/CaseManagement';
import Analytics from '@/pages/Analytics';
import PatternScan from '@/pages/PatternScan';
import NetworkGraph from '@/pages/NetworkGraph';
import ScamHeatmap from '@/pages/ScamHeatmap';
import StrGenerator from '@/pages/StrGenerator';
import WalletCheck from '@/pages/WalletCheck';
import AppShell from '@/components/AppShell';
import { AuthProvider } from "@/hooks/use-auth";
import CaseFiling from "@/pages/case-filing";
import NotFound from "@/pages/not-found";
import { TooltipProvider } from "@/components/ui/tooltip";
import DepartmentLogin from "@/pages/DepartmentLogin";
import BlockchainAnalytics from "@/pages/BlockchainAnalytics";
import CrossChainMonitoring from "@/pages/CrossChainMonitoring";
import IntelligenceHub from "@/pages/IntelligenceHub";
import RiskAssessment from "@/pages/RiskAssessment";
import CompliancePortal from "@/pages/CompliancePortal";

export default function App() {
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const port = process.env.NODE_ENV === 'production' ? '' : ':5000';
    const ws = new WebSocket(`${protocol}//${window.location.hostname}${port}/ws`);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'BLOCKCHAIN_UPDATE') {
          queryClient.invalidateQueries(['blockchain-transactions']);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppShell>
            <Switch>
              <Route path="/" component={DepartmentLogin} />
              <Route path="/dashboard" component={Dashboard} />
              <Route path="/case-management" component={CaseManagement} />
              <Route path="/case-filing" component={CaseFiling} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/wallet-check" component={WalletCheck} />
              <Route path="/pattern-scan" component={PatternScan} />
              <Route path="/str-generator" component={StrGenerator} />
              <Route path="/scam-heatmap" component={ScamHeatmap} />
              <Route path="/network-graph" component={NetworkGraph} />
              <Route path="/blockchain-analytics" component={BlockchainAnalytics} />
              <Route path="/cross-chain-monitoring" component={CrossChainMonitoring} />
              <Route path="/intelligence-hub" component={IntelligenceHub} />
              <Route path="/risk-assessment" component={RiskAssessment} />
              <Route path="/compliance-portal" component={CompliancePortal} />
              <Route component={NotFound} />
            </Switch>
          </AppShell>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}