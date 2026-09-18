import React from 'react';
import {
  FileText,
  Sparkles,
  Clock,
  CheckCircle2,
  Truck,
  CheckCheck,
  Filter,
  Cog,
  Recycle,
  XCircle,
  Copy,
  Ban
} from 'lucide-react';
import { ReportStatus } from '../../types';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config: Record<
    ReportStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    SUBMITTED: {
      label: 'Submitted',
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
      icon: <FileText className="w-3.5 h-3.5" />
    },
    AI_ANALYZED: {
      label: 'AI Analyzed',
      bg: 'bg-purple-50',
      text: 'text-purple-800',
      border: 'border-purple-200',
      icon: <Sparkles className="w-3.5 h-3.5" />
    },
    VERIFICATION_PENDING: {
      label: 'Pending Verification',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      icon: <Clock className="w-3.5 h-3.5" />
    },
    VERIFIED: {
      label: 'Verified',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />
    },
    ASSIGNED: {
      label: 'Collection Assigned',
      bg: 'bg-cyan-50',
      text: 'text-cyan-800',
      border: 'border-cyan-200',
      icon: <Truck className="w-3.5 h-3.5" />
    },
    COLLECTED: {
      label: 'Collected',
      bg: 'bg-teal-50',
      text: 'text-teal-800',
      border: 'border-teal-200',
      icon: <CheckCheck className="w-3.5 h-3.5" />
    },
    SORTING: {
      label: 'Sorting & Screening',
      bg: 'bg-indigo-50',
      text: 'text-indigo-800',
      border: 'border-indigo-200',
      icon: <Filter className="w-3.5 h-3.5" />
    },
    PROCESSING: {
      label: 'Processing Batch',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      icon: <Cog className="w-3.5 h-3.5" />
    },
    RECYCLED: {
      label: 'Recycled to Product',
      bg: 'bg-forest-100',
      text: 'text-forest-900',
      border: 'border-forest-300',
      icon: <Recycle className="w-3.5 h-3.5" />
    },
    REJECTED: {
      label: 'Rejected',
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: <XCircle className="w-3.5 h-3.5" />
    },
    DUPLICATE: {
      label: 'Duplicate Flag',
      bg: 'bg-stone-100',
      text: 'text-stone-700',
      border: 'border-stone-300',
      icon: <Copy className="w-3.5 h-3.5" />
    },
    CANCELLED: {
      label: 'Cancelled',
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-300',
      icon: <Ban className="w-3.5 h-3.5" />
    }
  };

  const item = config[status] || config.SUBMITTED;
  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-2.5 py-1 text-xs gap-1.5';

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${item.bg} ${item.text} ${item.border} ${sizeClass}`}
    >
      {item.icon}
      <span>{item.label}</span>
    </span>
  );
};
