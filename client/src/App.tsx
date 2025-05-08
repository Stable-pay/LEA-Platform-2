import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppShell from "@/components/AppShell";
import Dashboard from "@/pages/Dashboard";
import CaseManagement from "@/pages/CaseManagement";
import Analytics from "@/pages/Analytics";
import WalletCheck from "@/pages/WalletCheck";
import PatternScan from "@/pages/PatternScan";
import StrGenerator from "@/pages/StrGenerator";
import ScamHeatmap from "@/pages/ScamHeatmap";
import NetworkGraph from "@/pages/NetworkGraph";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/case-management" component={CaseManagement} />
      <Route path="/analytics" component={Analytics} />
      <Route path="/wallet-check" component={WalletCheck} />
      <Route path="/pattern-scan" component={PatternScan} />
      <Route path="/str-generator" component={StrGenerator} />
      <Route path="/scam-heatmap" component={ScamHeatmap} />
      <Route path="/network-graph" component={NetworkGraph} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppShell>
          <Router />
        </AppShell>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
