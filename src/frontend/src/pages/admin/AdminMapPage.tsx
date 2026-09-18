import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { reportsApi } from '../../api/client';
import { Report } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { Filter, Layers, MapPin, ArrowRight } from 'lucide-react';

const createCustomMarker = (priority: string) => {
  let color = '#245b41'; // low
  if (priority === 'CRITICAL') color = '#dc2626';
  else if (priority === 'HIGH') color = '#ea580c';
  else if (priority === 'MEDIUM') color = '#2563eb';

  return L.divIcon({
    html: `<div style="background-color: ${color}; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.35); border: 2.5px solid white;">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    </div>`,
    className: 'custom-leaflet-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
};

export const AdminMapPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [wasteTypeFilter, setWasteTypeFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    reportsApi
      .getAll({
        status: statusFilter || undefined,
        waste_type: wasteTypeFilter || undefined,
        priority: priorityFilter || undefined
      })
      .then(setReports)
      .finally(() => setIsLoading(false));
  }, [statusFilter, wasteTypeFilter, priorityFilter]);

  const mysoreCenter: [number, number] = [12.305, 76.64];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-sand-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-charcoal-900 font-display">
              Mysuru GIS Waste Accumulation Map
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 font-bold">
              Spatial Intelligence
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Real-time geospatial distribution of demolition debris, road obstructions, and municipal collection zones.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-sand-300 bg-white font-medium"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="VERIFIED">Verified</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="COLLECTED">Collected</option>
            <option value="PROCESSING">Processing</option>
            <option value="RECYCLED">Recycled</option>
          </select>

          <select
            value={wasteTypeFilter}
            onChange={(e) => setWasteTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-sand-300 bg-white font-medium"
          >
            <option value="">All Waste Streams</option>
            <option value="CONCRETE">Concrete</option>
            <option value="BRICKS">Bricks</option>
            <option value="TILES">Tiles</option>
            <option value="SOIL">Soil</option>
            <option value="MIXED">Mixed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-sand-300 bg-white font-medium"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Fullscreen Style Map Container */}
      <div className="h-[600px] w-full rounded-2xl overflow-hidden border border-sand-300 shadow-md relative">
        <MapContainer
          center={mysoreCenter}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {reports.map((rep) => (
            <Marker
              key={rep.id}
              position={[rep.latitude, rep.longitude]}
              icon={createCustomMarker(rep.priority)}
            >
              <Popup>
                <div className="p-1 space-y-2 text-xs font-sans min-w-[200px]">
                  <div className="flex justify-between items-center border-b border-sand-200 pb-1">
                    <span className="font-mono font-bold text-forest-800">{rep.id}</span>
                    <span className="font-bold text-charcoal-700">{rep.waste_type}</span>
                  </div>
                  <p className="text-charcoal-700 font-medium leading-snug">{rep.address}</p>
                  <div className="flex justify-between items-center text-[11px] text-charcoal-500 font-mono">
                    <span>{rep.estimated_quantity.toLocaleString()} {rep.quantity_unit}</span>
                    <span className="font-bold text-terracotta-700">{rep.priority}</span>
                  </div>
                  <div className="pt-1 border-t border-sand-200 flex items-center justify-between">
                    <StatusBadge status={rep.status} size="sm" />
                    <Link
                      to={`/reports/${rep.id}`}
                      className="inline-flex items-center gap-1 font-bold text-forest-700 hover:text-forest-900"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Legend */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-sand-200 z-[400] text-xs space-y-2">
          <span className="font-bold text-charcoal-900 block uppercase tracking-wider text-[10px]">
            Priority Legend
          </span>
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-600 inline-block" />
              <span>Critical Emergency</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-600 inline-block" />
              <span>High Priority Haul</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
              <span>Medium Commercial</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-forest-700 inline-block" />
              <span>Low Residential</span>
            </div>
          </div>
          <div className="pt-1.5 border-t border-sand-200 text-[10px] text-charcoal-500 font-mono">
            Showing {reports.length} locations
          </div>
        </div>
      </div>
    </div>
  );
};
