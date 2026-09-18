import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { reportsApi, collectionsApi } from '../../api/client';
import { Report, CollectionTeam } from '../../types';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { PriorityBadge } from '../../components/ui/PriorityBadge';
import { Button } from '../../components/ui/Button';
import { AIAnalysisCard } from '../../components/shared/AIAnalysisCard';
import { TimelineView } from '../../components/shared/TimelineView';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Phone,
  Truck,
  Shield,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  UserCheck
} from 'lucide-react';

const pinIcon = L.divIcon({
  html: `<div style="background-color: #c86d51; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.3); border: 2px solid white;">
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
  </div>`,
  className: 'custom-pin',
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { activeRole } = useAuth();

  const [report, setReport] = useState<Report | null>(null);
  const [teams, setTeams] = useState<CollectionTeam[]>([]);
  const [routingInfo, setRoutingInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [verifyNotes, setVerifyNotes] = useState('');
  const [verifyStatus, setVerifyStatus] = useState('VERIFIED');

  const fetchReport = async () => {
    if (!id) return;
    try {
      const data = await reportsApi.getById(id);
      setReport(data);

      if (data.status === 'VERIFIED' || activeRole === 'ADMIN') {
        const [routeData, allTeams] = await Promise.all([
          reportsApi.getRouting(id).catch(() => null),
          collectionsApi.getTeams().catch(() => [])
        ]);
        setRoutingInfo(routeData);
        setTeams(allTeams);
        if (routeData?.suggested_team?.id) {
          setSelectedTeamId(routeData.suggested_team.id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [id, activeRole]);

  const handleReanalyze = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await reportsApi.analyze(id);
      await fetchReport();
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecalculatePriority = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await reportsApi.calculatePriority(id);
      await fetchReport();
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifySubmit = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await reportsApi.verify(id, {
        status: verifyStatus,
        notes: verifyNotes || `Verified by administrator.`
      });
      setShowVerifyModal(false);
      await fetchReport();
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssignSubmit = async () => {
    if (!id || !selectedTeamId) return;
    setActionLoading(true);
    try {
      await reportsApi.assign(id, selectedTeamId);
      setShowAssignModal(false);
      await fetchReport();
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-forest-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-charcoal-500">Loading report details...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-charcoal-900">Report Not Found</h2>
        <p className="text-sm text-charcoal-500">
          The requested construction waste report could not be found.
        </p>
        <Link to="/citizen">
          <Button variant="primary" size="sm">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            to="/citizen"
            className="inline-flex items-center gap-1.5 text-xs text-forest-700 hover:text-forest-900 font-semibold mb-1"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Reports</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 font-mono">
              {report.id}
            </h1>
            <StatusBadge status={report.status} />
            <PriorityBadge priority={report.priority} score={report.priority_score} showScore />
          </div>
          <p className="text-xs text-charcoal-500">
            Registered on {new Date(report.created_at).toLocaleString()} by {report.citizen_name}
          </p>
        </div>

        {/* Quick Operational Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReanalyze}
            isLoading={actionLoading}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-purple-600" />}
          >
            Re-run AI
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRecalculatePriority}
            isLoading={actionLoading}
            leftIcon={<RefreshCw className="w-3.5 h-3.5 text-amber-600" />}
          >
            Re-score Priority
          </Button>

          {/* Admin Verification & Dispatch Controls */}
          {activeRole === 'ADMIN' && (
            <>
              {['SUBMITTED', 'AI_ANALYZED', 'VERIFICATION_PENDING'].includes(report.status) && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowVerifyModal(true)}
                  leftIcon={<Shield className="w-3.5 h-3.5 text-forest-700" />}
                >
                  Verify Report
                </Button>
              )}

              {report.status === 'VERIFIED' && (
                <Button
                  variant="terracotta"
                  size="sm"
                  onClick={() => setShowAssignModal(true)}
                  leftIcon={<Truck className="w-3.5 h-3.5" />}
                >
                  Assign Fleet
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Evidence, Map, Timeline */}
        <div className="lg:col-span-2 space-y-8">
          {/* Photos Card */}
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
              Photographic Evidence
            </h3>
            {report.images.length === 0 ? (
              <p className="text-xs text-charcoal-400 italic">No photographs attached.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {report.images.map((img) => (
                  <div
                    key={img.id}
                    className="rounded-xl overflow-hidden border border-sand-200 shadow-sm aspect-video bg-sand-100"
                  >
                    <img
                      src={img.image_url}
                      alt="Waste Evidence"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location & Map Card */}
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
                Site Location & Coordinates
              </h3>
              <span className="text-xs font-mono text-charcoal-500">
                {report.latitude.toFixed(4)}° N, {report.longitude.toFixed(4)}° E
              </span>
            </div>

            <div className="h-64 rounded-xl overflow-hidden border border-sand-200 shadow-inner">
              <MapContainer
                center={[report.latitude, report.longitude]}
                zoom={14}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[report.latitude, report.longitude]} icon={pinIcon}>
                  <Popup>
                    <div className="text-xs font-sans">
                      <strong className="block text-forest-800">{report.id}</strong>
                      <span>{report.address}</span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="space-y-1 text-xs">
              <p className="font-semibold text-charcoal-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-terracotta-600 shrink-0" />
                <span>{report.address}</span>
              </p>
              {report.landmark && (
                <p className="text-charcoal-600 pl-5">Landmark: {report.landmark}</p>
              )}
            </div>
          </div>

          {/* Lifecycle Timeline */}
          <div className="bg-white p-6 rounded-2xl border border-sand-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-charcoal-900 uppercase tracking-wider">
              Traceable Workflow Lifecycle
            </h3>
            <TimelineView timeline={report.timeline} currentStatus={report.status} />
          </div>
        </div>

        {/* Right Column: AI Analysis, Verification, Assignment Info */}
        <div className="space-y-6">
          {/* AI Analysis Card */}
          <AIAnalysisCard
            analysis={report.ai_analysis}
            onReanalyze={handleReanalyze}
            isLoading={actionLoading}
          />

          {/* Details Overview Card */}
          <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-4 text-xs">
            <h4 className="font-bold text-charcoal-900 uppercase tracking-wider border-b border-sand-100 pb-2">
              Report Parameters
            </h4>

            <div className="space-y-2.5">
              <div className="flex justify-between py-1 border-b border-sand-100">
                <span className="text-charcoal-500">Material Type</span>
                <span className="font-bold text-charcoal-900">{report.waste_type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand-100">
                <span className="text-charcoal-500">Estimated Volume</span>
                <span className="font-bold font-mono text-charcoal-900">
                  {report.estimated_quantity.toLocaleString()} {report.quantity_unit}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand-100">
                <span className="text-charcoal-500">Target Pickup</span>
                <span className="font-medium text-charcoal-800">
                  {report.preferred_pickup_date || 'Standard Queue'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-sand-100">
                <span className="text-charcoal-500">Contact Number</span>
                <span className="font-mono text-charcoal-800">
                  {report.contact_phone || 'Registered Phone'}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-charcoal-500">Assigned Team</span>
                <span className="font-semibold text-forest-800">
                  {report.assigned_collection_team_name || 'Not yet dispatched'}
                </span>
              </div>
            </div>

            {report.description && (
              <div className="pt-2 border-t border-sand-100">
                <span className="text-charcoal-400 font-semibold block mb-1">Site Notes</span>
                <p className="text-charcoal-700 leading-relaxed italic bg-sand-50 p-2.5 rounded-lg border border-sand-200">
                  "{report.description}"
                </p>
              </div>
            )}
          </div>

          {/* Priority Breakdown Card */}
          <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-sand-100 pb-2">
              <h4 className="font-bold text-charcoal-900 uppercase tracking-wider">
                Priority Engine Factors
              </h4>
              <span className="font-mono font-bold text-terracotta-700 bg-terracotta-50 px-2 py-0.5 rounded border border-terracotta-200">
                {report.priority_score}/100 pts
              </span>
            </div>

            {report.priority_reasons && report.priority_reasons.length > 0 ? (
              <ul className="space-y-2">
                {report.priority_reasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-charcoal-700 leading-snug">
                    <span className="w-1.5 h-1.5 rounded-full bg-terracotta-500 mt-1.5 shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-charcoal-400 italic">Standard scoring applied.</p>
            )}
          </div>

          {/* Verification Status Card */}
          {report.verification && (
            <div className="bg-white p-5 rounded-2xl border border-sand-200 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-sand-100 pb-2">
                <h4 className="font-bold text-charcoal-900 uppercase tracking-wider">
                  MCC Verification Audit
                </h4>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    report.verification.status === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : report.verification.status === 'POSSIBLE_DUPLICATE'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {report.verification.status}
                </span>
              </div>
              <p className="text-charcoal-700">
                Verified by:{' '}
                <strong>{report.verification.verifier_name || 'Municipal Desk'}</strong>
              </p>
              {report.verification.notes && (
                <p className="text-charcoal-600 bg-sand-50 p-2 rounded border border-sand-200">
                  {report.verification.notes}
                </p>
              )}
              {report.verification.flags && report.verification.flags.length > 0 && (
                <div className="flex flex-wrap gap-1 pt-1">
                  {report.verification.flags.map((flg) => (
                    <span
                      key={flg}
                      className="px-1.5 py-0.5 rounded bg-sand-100 text-[10px] font-mono text-charcoal-600"
                    >
                      {flg}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      <Modal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        title="Verify Demolition Waste Report"
      >
        <div className="space-y-4 text-xs">
          <p className="text-charcoal-600">
            Confirm whether this site represents valid C&D debris, an obstruction hazard, or a duplicate record.
          </p>

          <div className="space-y-1.5">
            <label className="font-semibold text-charcoal-800">Verification Decision</label>
            <div className="grid grid-cols-3 gap-2">
              {['VERIFIED', 'POSSIBLE_DUPLICATE', 'REJECTED'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setVerifyStatus(st)}
                  className={`p-2 rounded-xl border text-center font-bold transition ${
                    verifyStatus === st
                      ? 'bg-forest-700 text-white border-forest-800'
                      : 'bg-sand-50 text-charcoal-700 hover:bg-sand-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-charcoal-800">Municipal Verification Notes</label>
            <textarea
              rows={3}
              value={verifyNotes}
              onChange={(e) => setVerifyNotes(e.target.value)}
              placeholder="e.g. Geotag verified. Walkway encroachment confirmed near public school..."
              className="w-full px-3 py-2 rounded-xl border border-sand-300 focus:outline-none focus:ring-2 focus:ring-forest-600"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowVerifyModal(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={actionLoading}
              onClick={handleVerifySubmit}
            >
              Submit Verification
            </Button>
          </div>
        </div>
      </Modal>

      {/* Collection Assignment Modal */}
      <Modal
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        title="Dispatch Collection Fleet"
      >
        <div className="space-y-4 text-xs">
          {routingInfo && (
            <div className="p-3 rounded-xl bg-forest-50 border border-forest-200 text-forest-900 leading-relaxed">
              <strong className="block mb-1">Routing Recommendation:</strong>
              <p>{routingInfo.routing_note}</p>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="font-semibold text-charcoal-800">Select Collection Unit</label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {teams.map((t) => (
                <label
                  key={t.id}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    selectedTeamId === t.id
                      ? 'border-forest-700 bg-forest-50/60 ring-2 ring-forest-600/20'
                      : 'border-sand-200 hover:bg-sand-50'
                  }`}
                >
                  <div>
                    <span className="font-bold text-charcoal-900 block">{t.team_name}</span>
                    <span className="text-charcoal-500">
                      Driver: {t.lead_driver_name} • {t.vehicle_number}
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="team"
                    value={t.id}
                    checked={selectedTeamId === t.id}
                    onChange={() => setSelectedTeamId(t.id)}
                    className="text-forest-700 focus:ring-forest-600"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowAssignModal(false)}>
              Cancel
            </Button>
            <Button
              variant="terracotta"
              size="sm"
              isLoading={actionLoading}
              onClick={handleAssignSubmit}
            >
              Confirm Dispatch
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
