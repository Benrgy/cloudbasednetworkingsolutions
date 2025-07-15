import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { HelpCircle, Info, AlertCircle, Zap } from "lucide-react";

interface ProfessionalTooltipProps {
  children: React.ReactNode;
  content: string;
  type?: 'info' | 'warning' | 'advanced' | 'performance';
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const ProfessionalTooltip: React.FC<ProfessionalTooltipProps> = ({
  children,
  content,
  type = 'info',
  side = 'top'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-3 w-3 text-warning" />;
      case 'advanced':
        return <Zap className="h-3 w-3 text-primary" />;
      case 'performance':
        return <Info className="h-3 w-3 text-success" />;
      default:
        return <HelpCircle className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getTooltipClass = () => {
    switch (type) {
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'advanced':
        return 'border-primary/20 bg-primary/5';
      case 'performance':
        return 'border-success/20 bg-success/5';
      default:
        return '';
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="inline-flex items-center gap-1 cursor-help">
          {children}
          {getIcon()}
        </span>
      </TooltipTrigger>
      <TooltipContent side={side} className={`max-w-xs text-sm ${getTooltipClass()}`}>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
};

// Pre-defined tooltips for networking specialists
export const SubnettingTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProfessionalTooltip
    content="CIDR notation determines the subnet size. /24 = 254 hosts, /25 = 126 hosts, /26 = 62 hosts. Choose based on your growth requirements and security segmentation needs."
    type="advanced"
  >
    {children}
  </ProfessionalTooltip>
);

export const CloudCostTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProfessionalTooltip
    content="Data transfer costs vary by provider and region. AWS charges for outbound traffic, Azure has zone-based pricing, GCP offers more generous free tiers. Plan for cross-AZ traffic patterns."
    type="warning"
  >
    {children}
  </ProfessionalTooltip>
);

export const PerformanceTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProfessionalTooltip
    content="Network latency typically increases with geographic distance. Choose regions closest to your users. Consider CDN integration for static content delivery optimization."
    type="performance"
  >
    {children}
  </ProfessionalTooltip>
);

export const SecurityTooltip: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ProfessionalTooltip
    content="Implement network segmentation following Zero Trust principles. Separate application tiers into different subnets with appropriate security groups and NACLs."
    type="advanced"
  >
    {children}
  </ProfessionalTooltip>
);