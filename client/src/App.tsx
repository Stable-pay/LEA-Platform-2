import { QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/pages/Dashboard';
import CaseManagement from '@/pages/CaseManagement';
import Analytics from '@/pages/Analytics';
import AppShell from '@/components/AppShell';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/cases" element={<CaseManagement />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}