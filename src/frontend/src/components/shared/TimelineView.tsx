import React from 'react';
import { TimelineEvent, ReportStatus } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { Check, Clock, User, Shield, Truck, Cog } from 'lucide-react';

interface TimelineViewProps {
  timeline: TimelineEvent[];
  currentStatus: ReportStatus;
}

const LIFECYCLE_STEPS: { status: ReportStatus; label: string }[] = [
  { status: 'SUBMITTED', label: 'Submitted' },
  { status: 'AI_ANALYZED', label: 'AI Analyzed' },
  { status: 'VERIFIED', label: 'Verified' },
  { status: 'ASSIGNED', label: 'Collection Assigned' },
  { status: 'COLLECTED', label: 'Collected' },
  { status: 'SORTING', label: 'Sorting' },
  { status: 'PROCESSING', label: 'Processing' },
  { status: 'RECYCLED', label: 'Recycled' }
];

export const TimelineView: React.FC<TimelineViewProps> = ({ timeline, currentStatus }) => {
  // Determine progress index in lifecycle
  const currentStepIndex = LIFECYCLE_STEPS.findIndex((s) => s.status === currentStatus);

  const getActorIcon = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return <Shield className="w-3.5 h-3.5 text-forest-700" />;
      case 'COLLECTION_TEAM':
        return <Truck className="w-3.5 h-3.5 text-blue-700" />;
      case 'PROCESSING_TEAM':
        return <Cog className="w-3.5 h-3.5 text-orange-700" />;
      default:
        return <User className="w-3.5 h-3.5 text-charcoal-700" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Pipeline Progress Tracker */}
      <div className="bg-sand-50/70 p-4 rounded-xl border border-sand-200">
        <h4 className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-4">
          Lifecycle Progression
        </h4>
        <div className="relative">
          <div className="hidden sm:block absolute top-1/2 left-4 right-4 h-0.5 bg-sand-300 -translate-y-1/2 z-0" />
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2 relative z-10">
            {LIFECYCLE_STEPS.map((step, idx) => {
              const isDone = currentStepIndex >= idx && currentStatus !== 'REJECTED' && currentStatus !== 'DUPLICATE' && currentStatus !== 'CANCELLED';
              const isCurrent = currentStatus === step.status;

              return (
                <div key={step.status} className="flex flex-col items-center text-center">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition shadow-sm ${
                      isDone
                        ? 'bg-forest-700 text-white'
                        : isCurrent
                        ? 'bg-amber-500 text-white ring-4 ring-amber-100'
                        : 'bg-white border border-sand-300 text-charcoal-400'
                    }`}
                  >
                    {isDone ? <Check className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span
                    className={`text-[11px] mt-2 font-medium leading-tight ${
                      isDone || isCurrent ? 'text-charcoal-900 font-semibold' : 'text-charcoal-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chronological Event Log */}
      <div>
        <h4 className="text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-3">
          Chronological Audit Log
        </h4>
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-sand-200">
          {timeline.map((event, index) => (
            <div key={event.id || index} className="relative group">
              {/* Bullet Node */}
              <div className="absolute -left-6 top-1.5 w-5 h-5 rounded-full bg-white border-2 border-forest-600 flex items-center justify-center shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-forest-600" />
              </div>

              {/* Event Content Card */}
              <div className="bg-white p-3.5 rounded-xl border border-sand-200 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={event.status} size="sm" />
                    <span className="text-xs text-charcoal-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(event.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1 text-xs font-medium text-charcoal-700 bg-sand-100 px-2 py-0.5 rounded">
                    {getActorIcon(event.actor_role)}
                    <span>{event.actor_name}</span>
                  </div>
                </div>
                <p className="text-xs text-charcoal-700 leading-relaxed font-sans">{event.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
