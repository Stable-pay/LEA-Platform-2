import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus, Upload, Search, FilePlus2 } from "lucide-react";

interface QuickActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const QuickActionButton = ({ icon, label, onClick }: QuickActionButtonProps) => {
  return (
    <button 
      className="flex flex-col items-center justify-center p-3 bg-neutral-light rounded-md hover:bg-neutral-light/80 transition-colors"
      onClick={onClick}
    >
      <div className="mb-2">
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
};

const QuickActions = () => {
  const handleNewCase = () => {
    console.log("New case action clicked");
    // Add implementation for creating a new case
  };
  
  const handleUpload = () => {
    console.log("Upload action clicked");
    // Add implementation for file upload
  };
  
  const handleScanWallet = () => {
    console.log("Scan wallet action clicked");
    // Add implementation for wallet scanning
  };
  
  const handleGenerateStr = () => {
    console.log("Generate STR action clicked");
    // Add implementation for STR generation
  };
  
  return (
    <Card className="shadow">
      <CardHeader className="py-4 px-6 border-b border-gray-100">
        <CardTitle className="font-semibold text-neutral-dark">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <QuickActionButton 
            icon={<FilePlus className="h-6 w-6 text-primary" />}
            label="New Case"
            onClick={handleNewCase}
          />
          
          <QuickActionButton 
            icon={<Upload className="h-6 w-6 text-primary" />}
            label="Upload"
            onClick={handleUpload}
          />
          
          <QuickActionButton 
            icon={<Search className="h-6 w-6 text-primary" />}
            label="Scan Wallet"
            onClick={handleScanWallet}
          />
          
          <QuickActionButton 
            icon={<FilePlus2 className="h-6 w-6 text-primary" />}
            label="Generate STR"
            onClick={handleGenerateStr}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
