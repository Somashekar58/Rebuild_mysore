import React from 'react';
import { AIAnalysis } from '../../types';
import { Sparkles, Info, ShieldAlert, CheckCircle2, Award } from 'lucide-react';

interface AIAnalysisCardProps {
  analysis?: AIAnalysis;
  onReanalyze?: () => void;
  isLoading?: boolean;
}

export const AIAnalysisCard: React.FC<AIAnalysisCardProps> = ({
  analysis,
  onReanalyze,
  isLoading = false
}) => {
  if (!analysis) {
    return (
      <div className="bg-purple-50/50 border border-purple-200 p-6 rounded-2xl text-center">
        <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-purple-950">AI Analysis Pending</h4>
        <p className="text-xs text-purple-700 mt-1 max-w-sm mx-auto">
          Waste classification model is queued to analyze composition and recyclability potential.
        </p>
        {onReanalyze && (
          <button
            onClick={onReanalyze}
            disabled={isLoading}
            className="mt-4 px-4 py-2 rounded-lg bg-purple-600 text-white text-xs font-semibold hover:bg-purple-700 transition"
          >
            {isLoading ? 'Running Inference...' : 'Run Prototype AI Analysis'}
          </button>
        )}
      </div>
    );
  }

  const comp = analysis.waste_composition;

  return (
    <div className="bg-white rounded-2xl border border-purple-200/80 shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-950 text-white px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-white/10 text-purple-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-200">
                AI Waste Analysis
              </span>
              <span className="text-[10px] bg-purple-500/30 text-purple-200 px-2 py-0.2 rounded-full border border-purple-400/30 font-medium">
                Prototype Inference
              </span>
            </div>
            <p className="text-[11px] text-purple-300">Model: {analysis.model_version}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-extrabold text-white">
            {Math.round(analysis.confidence * 100)}%
          </div>
          <p className="text-[10px] text-purple-300">Confidence</p>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* Composition Bar */}
        <div>
          <div className="flex justify-between items-center text-xs font-semibold text-charcoal-800 mb-2">
            <span>Predicted Waste Composition</span>
            <span className="text-forest-700">Class: {analysis.suggested_waste_type}</span>
          </div>
          <div className="h-4 w-full bg-sand-200 rounded-full overflow-hidden flex shadow-inner">
            <div
              style={{ width: `${comp.concrete_percentage}%` }}
              className="bg-charcoal-700 h-full transition-all"
              title={`Concrete: ${comp.concrete_percentage}%`}
            />
            <div
              style={{ width: `${comp.bricks_percentage}%` }}
              className="bg-terracotta-600 h-full transition-all"
              title={`Bricks: ${comp.bricks_percentage}%`}
            />
            <div
              style={{ width: `${comp.tiles_percentage}%` }}
              className="bg-amber-500 h-full transition-all"
              title={`Tiles: ${comp.tiles_percentage}%`}
            />
            <div
              style={{ width: `${comp.soil_percentage}%` }}
              className="bg-sand-500 h-full transition-all"
              title={`Soil: ${comp.soil_percentage}%`}
            />
            <div
              style={{ width: `${comp.other_percentage}%` }}
              className="bg-purple-400 h-full transition-all"
              title={`Other: ${comp.other_percentage}%`}
            />
          </div>

          {/* Breakdown Pills */}
          <div className="grid grid-cols-5 gap-1.5 mt-2.5 text-center text-[11px]">
            <div className="p-1.5 rounded bg-sand-100/80 border border-sand-200">
              <span className="font-bold text-charcoal-900 block">{comp.concrete_percentage}%</span>
              <span className="text-charcoal-600">Concrete</span>
            </div>
            <div className="p-1.5 rounded bg-terracotta-50 border border-terracotta-200">
              <span className="font-bold text-terracotta-900 block">{comp.bricks_percentage}%</span>
              <span className="text-terracotta-700">Bricks</span>
            </div>
            <div className="p-1.5 rounded bg-amber-50 border border-amber-200">
              <span className="font-bold text-amber-900 block">{comp.tiles_percentage}%</span>
              <span className="text-amber-700">Tiles</span>
            </div>
            <div className="p-1.5 rounded bg-sand-50 border border-sand-200">
              <span className="font-bold text-sand-900 block">{comp.soil_percentage}%</span>
              <span className="text-sand-700">Soil</span>
            </div>
            <div className="p-1.5 rounded bg-purple-50 border border-purple-200">
              <span className="font-bold text-purple-900 block">{comp.other_percentage}%</span>
              <span className="text-purple-700">Other</span>
            </div>
          </div>
        </div>

        {/* Quality, Recyclability & Contamination Grid */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-sand-100 text-xs">
          <div className="bg-sand-50 p-3 rounded-xl border border-sand-200">
            <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block font-semibold">
              Recyclability
            </span>
            <span
              className={`font-bold mt-1 inline-flex items-center gap-1 ${
                analysis.recyclability === 'HIGH'
                  ? 'text-emerald-700'
                  : analysis.recyclability === 'MEDIUM'
                  ? 'text-blue-700'
                  : 'text-amber-700'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              {analysis.recyclability}
            </span>
          </div>

          <div className="bg-sand-50 p-3 rounded-xl border border-sand-200">
            <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block font-semibold">
              Image Quality
            </span>
            <span className="font-bold text-charcoal-800 mt-1 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
              {analysis.image_quality}
            </span>
          </div>

          <div className="bg-sand-50 p-3 rounded-xl border border-sand-200">
            <span className="text-[10px] text-charcoal-500 uppercase tracking-wider block font-semibold">
              Contamination
            </span>
            <span
              className={`font-bold mt-1 inline-flex items-center gap-1 ${
                analysis.contamination === 'LOW'
                  ? 'text-emerald-700'
                  : analysis.contamination === 'MODERATE'
                  ? 'text-amber-700'
                  : 'text-red-700'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              {analysis.contamination}
            </span>
          </div>
        </div>

        {/* Prototype Disclaimer Badge */}
        <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900 leading-snug">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <span>
            <strong>Prototype Notice:</strong> AI values are simulated demo predictions based on input metadata and visual heuristics.
          </span>
        </div>
      </div>
    </div>
  );
};
