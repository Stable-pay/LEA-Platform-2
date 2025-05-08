import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatWalletAddress = (address: string) => {
  if (!address) return '';
  if (address.length < 10) return address;
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date) => {
  const d = new Date(date);
  return d.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const getRiskLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'critical':
    case 'high risk':
      return 'text-status-error';
    case 'high':
    case 'medium risk':
      return 'text-status-warning';
    case 'medium':
    case 'low risk':
      return 'text-status-info';
    case 'low':
    case 'safe':
      return 'text-status-success';
    default:
      return 'text-muted-foreground';
  }
};

export const getRiskLevelBgColor = (level: string) => {
  switch (level.toLowerCase()) {
    case 'critical':
    case 'high risk':
      return 'bg-status-error/10';
    case 'high':
    case 'medium risk':
      return 'bg-status-warning/10';
    case 'medium':
    case 'low risk':
      return 'bg-status-info/10';
    case 'low':
    case 'safe':
      return 'bg-status-success/10';
    default:
      return 'bg-muted';
  }
};

export const getCaseStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'in progress':
      return 'text-status-info';
    case 'completed':
    case 'resolved':
      return 'text-status-success';
    case 'critical':
    case 'urgent':
      return 'text-status-error';
    default:
      return 'text-muted-foreground';
  }
};

export const getCaseStatusBgColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
    case 'in progress':
      return 'bg-status-info/10';
    case 'completed':
    case 'resolved':
      return 'bg-status-success/10';
    case 'critical':
    case 'urgent':
      return 'bg-status-error/10';
    default:
      return 'bg-muted';
  }
};
