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
    <div className={cn("bg-white rounded-lg shadow p-5", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-neutral-medium text-sm font-medium">{title}</h3>
          <p className="text-2xl font-semibold text-neutral-dark mt-1">{value}</p>
        </div>
        <div className={cn("rounded-full p-3", iconBgColor)}>
          {icon}
        </div>
      </div>
      {changePercentage !== undefined && (
        <div className="mt-4 flex items-center text-xs">
          <span 
            className={cn(
              "font-medium flex items-center",
              isPositiveChange ? "text-status-success" : "text-status-error"
            )}
          >
            {isPositiveChange ? (
              <ArrowUp className="h-3 w-3 mr-1" />
            ) : (
              <ArrowDown className="h-3 w-3 mr-1" />
            )}
            {Math.abs(changePercentage)}% {isPositiveChange ? "increase" : "decrease"}
          </span>
          <span className="text-neutral-medium ml-2">{changeText}</span>
        </div>
      )}
    </div>
  );
};

export default StatsCard;
