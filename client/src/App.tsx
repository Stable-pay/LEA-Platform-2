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
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";
import CaseFiling from "@/pages/case-filing";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import { TooltipProvider } from "@/components/ui/tooltip";
import DepartmentLogin from "@/pages/DepartmentLogin";

export default function App() {
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(`${protocol}//${window.location.hostname}:5000/ws`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'BLOCKCHAIN_UPDATE') {
        queryClient.invalidateQueries(['blockchain-transactions']);
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
              <Route path="/dashboard">
                {() => <ProtectedRoute><Dashboard /></ProtectedRoute>}
              </Route>
              <Route path="/case-management">
                {() => <ProtectedRoute><CaseManagement /></ProtectedRoute>}
              </Route>
              <Route path="/case-filing">
                {() => <ProtectedRoute><CaseFiling /></ProtectedRoute>}
              </Route>
              <Route path="/analytics">
                {() => <ProtectedRoute><Analytics /></ProtectedRoute>}
              </Route>
              <Route path="/wallet-check">
                {() => <ProtectedRoute><WalletCheck /></ProtectedRoute>}
              </Route>
              <Route path="/pattern-scan">
                {() => <ProtectedRoute><PatternScan /></ProtectedRoute>}
              </Route>
              <Route path="/str-generator">
                {() => <ProtectedRoute><StrGenerator /></ProtectedRoute>}
              </Route>
              <Route path="/scam-heatmap">
                {() => <ProtectedRoute><ScamHeatmap /></ProtectedRoute>}
              </Route>
              <Route path="/network-graph">
                {() => <ProtectedRoute><NetworkGraph /></ProtectedRoute>}
              </Route>
              <Route path="/" component={DepartmentLogin} />
              <Route component={NotFound} />
            </Switch>
          </AppShell>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}