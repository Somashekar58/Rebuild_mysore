import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../api/client';
import { Flame, AlertTriangle, Clock, Scale, MapPin, Info } from 'lucide-react';

export const HotspotsPage: React.FC = () => {
  const [hotspots, setHotspots] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    analyticsApi
      .getHotspots()
      .then(setHotspots)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-sand-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-charcoal-900 font-display">
              Mysuru Waste Hotspot Analytics
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
              Zone Density Heatmap
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Ward-level accumulation concentration, turnaround latency, and recurring illegal dumping detection.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Demo Geospatial Aggregation</span>
        </div>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-xs text-charcoal-400">
          <div className="w-8 h-8 border-3 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <span>Analyzing ward hotspot concentrations...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotspots.map((spot) => (
            <div
              key={spot.zone_id}
              className={`bg-white rounded-2xl border p-6 shadow-sm space-y-4 transition ${
                spot.status === 'HIGH_DENSITY'
                  ? 'border-amber-300 ring-1 ring-amber-300/40'
                  : 'border-sand-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-[10px] text-charcoal-400 font-semibold block">
                    {spot.zone_code}
                  </span>
                  <h3 className="text-base font-bold text-charcoal-900">{spot.zone_name}</h3>
                </div>
                {spot.status === 'HIGH_DENSITY' ? (
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-[10px] font-extrabold flex items-center gap-1">
                    <Flame className="w-3 h-3 text-red-600" />
                    High Concentration
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    Normal Flow
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-sand-50 border border-sand-200">
                  <span className="text-charcoal-400 uppercase tracking-wider text-[10px] font-semibold block">
                    Active Incidents
                  </span>
                  <span className="text-xl font-extrabold text-charcoal-900 font-display">
                    {spot.report_count}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-sand-50 border border-sand-200">
                  <span className="text-charcoal-400 uppercase tracking-wider text-[10px] font-semibold block">
                    Total Tonnage
                  </span>
                  <span className="text-xl font-extrabold text-terracotta-600 font-display">
                    {spot.total_waste_tons} T
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-sand-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-charcoal-600">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-forest-700" />
                    Avg. Resolution Time:
                  </span>
                  <span className="font-mono font-bold">{spot.avg_resolution_hours} hrs</span>
                </div>

                <div className="flex items-center justify-between text-charcoal-600">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-terracotta-600" />
                    Centerpoint:
                  </span>
                  <span className="font-mono text-[11px]">
                    {spot.center_lat.toFixed(3)}°, {spot.center_lng.toFixed(3)}°
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
