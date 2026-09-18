import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../api/client';
import { ImpactMetrics } from '../../types';
import {
  Recycle,
  Leaf,
  Scale,
  Building,
  CheckCircle2,
  Users,
  Info,
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const ImpactDashboard: React.FC = () => {
  const [impact, setImpact] = useState<ImpactMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsApi
      .getImpact()
      .then(setImpact)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-forest-800">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-700/80 text-forest-200 border border-forest-600/50 text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5 text-forest-300" />
            <span>Mysuru Environmental Performance Index</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-display text-white">
            Circular Impact & Resource Preservation
          </h1>
          <p className="text-forest-200 text-sm sm:text-base leading-relaxed">
            Quantifying municipal construction and demolition waste diversion across Mysuru. Transforming heavy rubble into sustainable civic infrastructure.
          </p>
        </div>
      </div>

      {/* Core Impact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-forest-700">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Waste Diverted (Est.)
            </span>
            <Scale className="w-5 h-5 text-forest-700" />
          </div>
          <div className="text-3xl font-extrabold text-charcoal-900 font-display">
            {impact ? impact.total_waste_diverted_tons : '42.5'} Tons
          </div>
          <p className="text-xs text-charcoal-500">Diverted from Vidyaranyapuram dump yard</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-terracotta-700">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Recycled Pavers Produced
            </span>
            <Recycle className="w-5 h-5 text-terracotta-600" />
          </div>
          <div className="text-3xl font-extrabold text-charcoal-900 font-display">
            {impact ? impact.total_recycled_pavers_produced.toLocaleString() : '2,850'}
          </div>
          <p className="text-xs text-charcoal-500">Interlocking blocks for park walkways</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-purple-700">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              CO₂ Mitigated (Est.)
            </span>
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-charcoal-900 font-display">
            {impact ? impact.total_co2_offset_kg.toLocaleString() : '10,200'} kg
          </div>
          <p className="text-xs text-charcoal-500">Avoided quarrying & cement extraction</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold uppercase tracking-wider text-charcoal-500">
              Landfill Volume Saved (Est.)
            </span>
            <Building className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-charcoal-900 font-display">
            {impact ? impact.total_landfill_saved_cubic_meters : '27.6'} m³
          </div>
          <p className="text-xs text-charcoal-500">Precious municipal airspace conserved</p>
        </div>
      </div>

      {/* Operational Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-2">
          <span className="text-xs text-charcoal-500 font-semibold uppercase tracking-wider block">
            Completed Circular Cycles
          </span>
          <div className="text-2xl font-bold text-forest-800">
            {impact ? impact.completed_reports_count : 12} Reports Cleared
          </div>
          <p className="text-xs text-charcoal-500">
            From citizen report submission to final paver production.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-2">
          <span className="text-xs text-charcoal-500 font-semibold uppercase tracking-wider block">
            Active Citizen Participation
          </span>
          <div className="text-2xl font-bold text-terracotta-700">
            {impact ? impact.citizen_participation_count : 86} Civic Reporters
          </div>
          <p className="text-xs text-charcoal-500">
            Active residents and commercial contractors in Mysuru.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-sand-200 shadow-sm space-y-2">
          <span className="text-xs text-charcoal-500 font-semibold uppercase tracking-wider block">
            Average Turnaround Time
          </span>
          <div className="text-2xl font-bold text-charcoal-800">
            {impact ? impact.avg_resolution_time_hours : 22.4} Hours
          </div>
          <p className="text-xs text-charcoal-500">
            Time from initial verification to physical haul completion.
          </p>
        </div>
      </div>

      {/* Methodology Note */}
      <div className="bg-sand-50 rounded-2xl p-6 border border-sand-200 space-y-3">
        <div className="flex items-center gap-2 text-charcoal-900 font-bold text-sm">
          <Info className="w-5 h-5 text-forest-700 shrink-0" />
          <h3>Environmental Calculation Methodology & Standards</h3>
        </div>
        <div className="text-xs text-charcoal-600 leading-relaxed space-y-2">
          <p>
            <strong>Tonnage & Landfill Calculations:</strong> Based on Central Public Works Department (CPWD) Guidelines for Construction and Demolition Waste Management (2020) and CPCB empirical factors. Average uncompacted C&D debris density is approximated at 1.45 to 1.55 tons/m³, with diversion saving approximately 0.65 m³ of municipal landfill airspace per metric ton diverted.
          </p>
          <p>
            <strong>Embodied Carbon Offset:</strong> Secondary coarse aggregate substitution offsets approximately 240 kg CO₂e per metric ton compared to virgin granite quarrying, diesel crushing, and long-distance transport.
          </p>
          <p className="italic text-charcoal-500">
            *All calculations represent model-based estimates for hackathon demonstration purposes and will be calibrated with certified Mysuru City Corporation weighbridge sensor feeds in production.
          </p>
        </div>
      </div>
    </div>
  );
};
