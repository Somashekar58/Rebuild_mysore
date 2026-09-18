import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { Users, Shield, Truck, Cog, Home, HardHat } from 'lucide-react';

export const DemoUserBar: React.FC = () => {
  const { activeRole, switchRole, currentUser } = useAuth();

  const roles: { role: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      role: 'CITIZEN',
      label: 'Citizen',
      icon: <Home className="w-3.5 h-3.5" />,
      desc: 'Report & Track Waste'
    },
    {
      role: 'BUILDER',
      label: 'Builder',
      icon: <HardHat className="w-3.5 h-3.5" />,
      desc: 'Bulk Commercial Demolition'
    },
    {
      role: 'COLLECTION_TEAM',
      label: 'Collection Crew',
      icon: <Truck className="w-3.5 h-3.5" />,
      desc: 'Field Pickups & Proof'
    },
    {
      role: 'PROCESSING_TEAM',
      label: 'Processing Plant',
      icon: <Cog className="w-3.5 h-3.5" />,
      desc: 'Sorting & Paver Creation'
    },
    {
      role: 'ADMIN',
      label: 'MCC Admin Desk',
      icon: <Shield className="w-3.5 h-3.5" />,
      desc: 'Verification & Dispatch'
    }
  ];

  return (
    <div className="bg-charcoal-900 text-white text-xs py-1.5 px-4 border-b border-charcoal-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono text-sand-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-forest-400" />
            Active Role:
          </span>
          <span className="font-semibold text-white bg-charcoal-800 px-2 py-0.5 rounded border border-charcoal-700">
            {currentUser?.name || activeRole} ({activeRole})
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <span className="text-sand-400 text-[11px] mr-1 hidden sm:inline">Switch Demo User:</span>
          {roles.map((r) => {
            const isActive = activeRole === r.role;
            return (
              <button
                key={r.role}
                onClick={() => switchRole(r.role)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs transition font-medium ${
                  isActive
                    ? 'bg-forest-600 text-white shadow-sm ring-1 ring-forest-400'
                    : 'bg-charcoal-800 text-sand-200 hover:bg-charcoal-700 hover:text-white border border-charcoal-700/60'
                }`}
                title={r.desc}
              >
                {r.icon}
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
