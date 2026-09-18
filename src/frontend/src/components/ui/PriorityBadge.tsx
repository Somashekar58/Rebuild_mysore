import React from 'react';
import { PriorityLevel } from '../../types';
import { AlertCircle, AlertTriangle, Flame, Info } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  score?: number;
  showScore?: boolean;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, score, showScore = false }) => {
  const config = {
    LOW: {
      label: 'Low Priority',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      icon: <Info className="w-3.5 h-3.5" />
    },
    MEDIUM: {
      label: 'Medium Priority',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      icon: <AlertCircle className="w-3.5 h-3.5" />
    },
    HIGH: {
      label: 'High Priority',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-300',
      icon: <AlertTriangle className="w-3.5 h-3.5" />
    },
    CRITICAL: {
      label: 'Critical Priority',
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-300',
      icon: <Flame className="w-3.5 h-3.5 text-red-600" />
    }
  };

  const item = config[priority] || config.LOW;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${item.bg} ${item.text} ${item.border}`}
    >
      {item.icon}
      <span>{item.label}</span>
      {showScore && score !== undefined && (
        <span className="ml-1 px-1.5 py-0.2 rounded bg-white/70 text-[10px] font-mono border">
          {score} pts
        </span>
      )}
    </span>
  );
};
