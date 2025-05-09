
import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  changePercentage?: number;
  changeText?: string;
  className?: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  iconBgColor,
  changePercentage,
  changeText = "from last month",
  className,
}: StatsCardProps) => {
  const isPositiveChange = changePercentage && changePercentage > 0;
  
  return (
    <div className={cn(
      "bg-white rounded-xl shadow-sm border border-neutral-200 p-6 transition-all hover:shadow-md",
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn("rounded-lg p-3", iconBgColor)}>
          {icon}
        </div>
        <div className="flex items-center text-xs">
          {changePercentage !== undefined && (
            <span 
              className={cn(
                "font-medium flex items-center gap-1 px-2 py-1 rounded",
                isPositiveChange ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50"
              )}
            >
              {isPositiveChange ? (
                <ArrowUp className="h-3 w-3" />
              ) : (
                <ArrowDown className="h-3 w-3" />
              )}
              {Math.abs(changePercentage)}%
            </span>
          )}
        </div>
      </div>
      <div>
        <h3 className="text-neutral-600 text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-neutral-900">{value}</p>
        {changePercentage !== undefined && (
          <p className="text-neutral-500 text-xs mt-1">{changeText}</p>
        )}
      </div>
    </div>
  );
};

export default StatsCard;
