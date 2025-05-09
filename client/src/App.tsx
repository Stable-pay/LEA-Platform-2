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
import { ProtectedRoute } from '@/lib/protected-route';
import { AuthProvider } from "@/hooks/use-auth";
import CaseFiling from "@/pages/case-filing";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";
import { TooltipProvider } from "@/components/ui/tooltip";
import DepartmentLogin from "@/pages/DepartmentLogin";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppShell>
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/login" component={DepartmentLogin} />
              <Route path="/case-management" component={CaseManagement} />
              <Route path="/case-filing" component={CaseFiling} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/wallet-check" component={WalletCheck} />
              <Route path="/pattern-scan" component={PatternScan} />
              <Route path="/str-generator" component={StrGenerator} />
              <Route path="/scam-heatmap" component={ScamHeatmap} />
              <Route path="/network-graph" component={NetworkGraph} />
              <Route path="/auth" component={AuthPage} />
              <Route component={NotFound} />
            </Switch>
          </AppShell>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}