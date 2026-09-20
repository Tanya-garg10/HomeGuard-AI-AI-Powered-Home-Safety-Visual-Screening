import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { HazardSeverity } from '../types';

interface SeverityBadgeProps {
  severity: HazardSeverity;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const norm = severity.toLowerCase() as HazardSeverity;

  const config = {
    high: {
      label: 'High Risk',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/30',
      dotColor: 'bg-red-500',
      Icon: AlertCircle,
    },
    medium: {
      label: 'Medium Risk',
      bgColor: 'bg-amber-500/10',
      textColor: 'text-amber-400',
      borderColor: 'border-amber-500/30',
      dotColor: 'bg-amber-500',
      Icon: AlertTriangle,
    },
    low: {
      label: 'Low Risk',
      bgColor: 'bg-[#c4ff00]/8',
      textColor: 'text-[#c4ff00]',
      borderColor: 'border-[#c4ff00]/15',
      dotColor: 'bg-[#c4ff00]',
      Icon: CheckCircle2,
    },
  }[norm] || {
    label: 'Low Risk',
    bgColor: 'bg-[#c4ff00]/8',
    textColor: 'text-[#c4ff00]',
    borderColor: 'border-[#c4ff00]/15',
    dotColor: 'bg-[#c4ff00]',
    Icon: CheckCircle2,
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-xs sm:text-sm px-3 py-1.5 gap-2 font-medium',
  }[size];

  const iconSizes = {
    sm: 11,
    md: 13,
    lg: 15,
  }[size];

  const { label, bgColor, textColor, borderColor, dotColor, Icon } = config;

  return (
    <span
      className={`inline-flex items-center rounded border font-tech font-bold uppercase tracking-wider ${bgColor} ${textColor} ${borderColor} ${sizeClasses} ${className}`}
    >
      {showIcon && <Icon size={iconSizes} className="shrink-0" />}
      <span>{label}</span>
    </span>
  );
};
