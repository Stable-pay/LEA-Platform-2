import { useLocation, Link } from "wouter";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { 
  FileText, 
  FileCheck, 
  BarChart2, 
  Info, 
  Monitor,
  Shield,
  Users,
  Lock,
  AlertTriangle,
  AlertCircle,
  Bell
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  isMobile: boolean;
  badge?: string;
  badgeColor?: string;
}

interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
  isMobile?: boolean;
}

const SidebarSection = ({ title, children, isMobile }: SidebarSectionProps) => (
  <div className="mb-4">
    <h3 className={`mb-2 px-3 text-xs font-semibold text-neutral-500 ${isMobile ? 'text-base' : ''}`}>
      {title}
    </h3>
    <ul>{children}</ul>
  </div>
);

const SidebarLink = ({ href, icon, label, isMobile, badge, badgeColor }: SidebarLinkProps) => {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <Link href={href}>
      <div className={cn(
        "flex items-center p-2 md:px-4 rounded-md",
        isActive 
          ? "bg-primary-light text-white" 
          : "text-neutral-dark hover:bg-neutral-light"
      )}>
        {icon}
        <span className={cn("ml-3", isMobile ? "hidden" : "block")}>{label}</span>
        {badge !== undefined && (
          <span className={`ml-auto rounded-full ${badgeColor} px-2 py-0.5 text-xs text-white`}>
            {badge}
          </span>
        )}
      </div>
    </Link>
  );
};



interface AppShellProps {
  children: React.ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar Navigation */}
      <aside className="bg-white shadow-lg w-16 md:w-64 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center md:justify-start px-4 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold">SP</span>
            </div>
            <span className={cn("text-lg font-semibold text-neutral-dark", isMobile ? "hidden" : "block")}>
              Stable Pay
            </span>
          </div>
        </div>

        {/* User Profile */}
        <UserProfileSection isMobile={isMobile} />

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto scrollbar-thin">
          <ul className="p-2">
            {/* LEA Panel */}
            <li className="mb-1">
              <SidebarLink 
                href="/" 
                icon={<Home className="h-5 w-5" />} 
                label="Dashboard" 
                isMobile={isMobile} 
              />
            </li>
            <li className="mb-1">
              <SidebarLink 
                href="/case-management" 
                icon={<FileText className="h-5 w-5" />} 
                label="Case Management" 
                isMobile={isMobile} 
              />
            </li>
            <li className="mb-1">
              <SidebarLink 
                href="/case-filing" 
                icon={<FileCheck className="h-5 w-5" />} 
                label="Case Filing" 
                isMobile={isMobile} 
              />
            </li>
            <li className="mb-1">
              <SidebarLink 
                href="/analytics" 
                icon={<BarChart2 className="h-5 w-5" />} 
                label="Analytics" 
                isMobile={isMobile} 
              />
            </li>
            <li className="mb-1">
              <SidebarLink 
                href="/wallet-check" 
                icon={<Info className="h-5 w-5" />} 
                label="Wallet Check" 
                isMobile={isMobile} 
              />
            </li>

            {/* FIU-IND Section */}
            <SidebarSection title="FIU-IND Node" isMobile={isMobile}>
              <li className="mb-1">
                <SidebarLink 
                  href="/pattern-scan" 
                  icon={<Monitor className="h-5 w-5" />} 
                  label="Pattern Scan" 
                  isMobile={isMobile} 
                />
              </li>
              <li className="mb-1">
                <SidebarLink 
                  href="/str-generator" 
                  icon={<SmilePlus className="h-5 w-5" />} 
                  label="STR Generator" 
                  isMobile={isMobile} 
                />
              </li>
            </SidebarSection>

            {/* I4C Portal Section */}
            <SidebarSection title="I4C Portal" isMobile={isMobile}>
              <li className="mb-1">
                <SidebarLink 
                  href="/scam-heatmap" 
                  icon={<Database className="h-5 w-5" />} 
                  label="Scam Heatmap" 
                  isMobile={isMobile} 
                />
              </li>
              <li className="mb-1">
                <SidebarLink 
                  href="/network-graph" 
                  icon={<Users className="h-5 w-5" />} 
                  label="Network Graph" 
                  isMobile={isMobile} 
                />
              </li>
            </SidebarSection>
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t">
          <Link href="/settings">
            <div className="flex items-center text-neutral-medium hover:text-neutral-dark">
              <Settings className="h-5 w-5" />
              <span className={cn("ml-3", isMobile ? "hidden" : "block")}>Settings</span>
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center px-6">
          <div className="flex-1 flex items-center">
            <div className="mr-4">
              <h1 className="text-xl font-semibold text-neutral-dark">
                {getPageTitle()}
              </h1>
            </div>
            <div className={cn("flex-1 max-w-lg", isMobile ? "hidden" : "block")}>
              <div className="relative">
                <Input 
                  type="text"
                  placeholder="Search cases, wallets, or scam patterns..." 
                  className="w-full py-2 pl-10 pr-4" 
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-neutral-medium" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-neutral-light relative" aria-label="Notifications">
              <Bell className="h-5 w-5 text-neutral-medium" />
              <span className="absolute top-1 right-1 bg-status-error w-2 h-2 rounded-full"></span>
            </button>
            {isMobile && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white text-sm">JD</span>
              </div>
            )}
          </div>
        </header>

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto p-6 bg-neutral-lightest">
          {children}
        </main>
      </div>
    </div>
  );
};

// User Profile Component
const UserProfileSection = ({ isMobile }: { isMobile: boolean }) => {
  const { user, logoutMutation } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const getUserInitials = () => {
    if (!user.fullName) return "U";
    return user.fullName
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={cn("items-center space-x-3 p-4 border-b", isMobile ? "hidden" : "flex")}>
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
        <span className="text-white">{getUserInitials()}</span>
      </div>
      <div className="flex-grow">
        <div className="text-sm font-medium text-neutral-dark">{user.fullName}</div>
        <div className="text-xs text-neutral-medium">{
          user.role === "law_enforcement" ? "Law Enforcement" :
          user.role === "fiu_ind" ? "FIU-IND" :
          user.role === "i4c" ? "I4C" :
          user.role === "bank_exchange" ? "Bank/Exchange" :
          user.role === "court" ? "Judiciary" :
          user.role
        }</div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

function getPageTitle() {
  const [location] = useLocation();
  switch (location) {
    case "/":
      return "Dashboard";
    case "/case-management":
      return "Case Management";
    case "/case-filing":
      return "Case Filing";
    case "/analytics":
      return "Analytics";
    case "/wallet-check":
      return "Wallet Check";
    case "/pattern-scan":
      return "Pattern Scan";
    case "/str-generator":
      return "STR Generator";
    case "/scam-heatmap":
      return "Scam Heatmap";
    case "/network-graph":
      return "Network Graph";
    default:
      return "Dashboard";
  }
}

export default AppShell;