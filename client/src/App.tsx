import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "@/components/AppShell";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";

// Pages
import Dashboard from "@/pages/Dashboard";
import CaseManagement from "@/pages/CaseManagement";
import Analytics from "@/pages/Analytics";
import WalletCheck from "@/pages/WalletCheck";
import PatternScan from "@/pages/PatternScan";
import StrGenerator from "@/pages/StrGenerator";
import ScamHeatmap from "@/pages/ScamHeatmap";
import NetworkGraph from "@/pages/NetworkGraph";
import CaseFiling from "@/pages/case-filing";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/case-management" component={CaseManagement} />
      <ProtectedRoute path="/case-filing" component={CaseFiling} />
      <ProtectedRoute path="/analytics" component={Analytics} />
      <ProtectedRoute path="/wallet-check" component={WalletCheck} />
      <ProtectedRoute path="/pattern-scan" component={PatternScan} />
      <ProtectedRoute path="/str-generator" component={StrGenerator} />
      <ProtectedRoute path="/scam-heatmap" component={ScamHeatmap} />
      <ProtectedRoute path="/network-graph" component={NetworkGraph} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppShell>
            <Router />
          </AppShell>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
