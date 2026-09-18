import React, { useState, useEffect } from 'react';
import { processingApi } from '../../api/client';
import { RecycledProduct } from '../../types';
import { Button } from '../../components/ui/Button';
import {
  Layers,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  Tag,
  Maximize2,
  Info,
  ArrowRight
} from 'lucide-react';

export const RebuildMaterialsPage: React.FC = () => {
  const [products, setProducts] = useState<RecycledProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    processingApi
      .getProducts()
      .then(setProducts)
      .finally(() => setIsLoading(false));
  }, []);

  const catalogSpecs = [
    {
      name: 'ReBuild Recycled Paver',
      tag: 'Heavy-Duty Interlocking Paver',
      recycledContent: '85% Secondary Demolition Aggregate',
      dimensions: '200 mm x 100 mm x 60 mm',
      cost: '₹28 per block (Prototype)',
      compressiveStrength: '35 MPa (Target Laboratory Grade)',
      applications: [
        'Pedestrian footpaths along Mysore Palace corridors',
        'Kukkarahalli Lake jogging tracks and park benches',
        'Residential permeable driveways and rainwater drainage margins',
        'Civic plaza landscaping and university walkways'
      ],
      description:
        'Manufactured by hydraulic pressing of reclaimed crushed red clay brick fines and graded concrete aggregate with a low-carbon binder matrix.',
      status: 'PILOT PRODUCT',
      image:
        'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'ReBuild Recycled Construction Block',
      tag: 'Hollow Masonry Compound Block',
      recycledContent: '75% Recycled Concrete Rubble',
      dimensions: '400 mm x 200 mm x 200 mm',
      cost: '₹65 per unit (Prototype)',
      compressiveStrength: '7.5 MPa (Non-Loadbearing Masonry)',
      applications: [
        'Perimeter compound boundary walls',
        'Non-loadbearing interior dividing partitions',
        'Substation acoustic and fire containment barriers',
        'Civic garden raised-bed planters'
      ],
      description:
        'Produced from screened demolition grade-slab concrete rubble mixed with fly ash and cured in high-humidity chambers to minimize embodied cement usage.',
      status: 'PROTOTYPE',
      image:
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80'
    },
    {
      name: 'ReBuild 20mm Coarse Aggregate',
      tag: 'Graded Road Sub-Base Media',
      recycledContent: '100% Recycled Structural Concrete',
      dimensions: '20 mm Down Uniformly Graded',
      cost: '₹850 per ton (Pilot)',
      compressiveStrength: 'Crushing Value < 28%',
      applications: [
        'Water-bound macadam road sub-base',
        'Stormwater percolation pit filter media',
        'Foundation hardcore backfill',
        'French drains and earth retaining structures'
      ],
      description:
        'Triple-stage jaw and impact crushed reinforced concrete from Mysuru bridge and road widening projects with magnetic rebar separation.',
      status: 'COMMERCIAL READY',
      image:
        'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-sand-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-charcoal-900 font-display">
              Circular ReBuild Materials Catalog
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-800 font-bold">
              Secondary Mineral Upcycling
            </span>
          </div>
          <p className="text-xs text-charcoal-500 mt-1">
            Engineered construction products manufactured from verified Mysuru demolition debris streams.
          </p>
        </div>

        {/* Prototype Disclaimer Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Prototype / Pilot Materials • Not Loadbearing Certified</span>
        </div>
      </div>

      {/* Products Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {catalogSpecs.map((item) => (
          <div
            key={item.name}
            className="bg-white rounded-3xl border border-sand-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-forest-600/60 hover:shadow-md transition"
          >
            <div>
              {/* Product Photo */}
              <div className="h-48 w-full overflow-hidden bg-sand-100 relative">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover hover:scale-105 transition duration-500"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-charcoal-900/80 text-white backdrop-blur-md text-[10px] font-bold tracking-wider uppercase border border-white/20">
                  {item.status}
                </span>
              </div>

              {/* Body */}
              <div className="p-6 space-y-4 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-terracotta-600 uppercase tracking-wider block">
                    {item.tag}
                  </span>
                  <h3 className="text-lg font-bold text-charcoal-900 mt-0.5">{item.name}</h3>
                </div>

                <p className="text-charcoal-600 leading-relaxed">{item.description}</p>

                {/* Specs Grid */}
                <div className="p-3.5 rounded-xl bg-sand-50/80 border border-sand-200 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Recycled Content:</span>
                    <span className="font-bold text-forest-800">{item.recycledContent}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Dimensions:</span>
                    <span className="font-mono font-bold text-charcoal-800">{item.dimensions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Estimated Cost:</span>
                    <span className="font-bold text-charcoal-900">{item.cost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal-500">Strength Rating:</span>
                    <span className="font-semibold text-charcoal-700">{item.compressiveStrength}</span>
                  </div>
                </div>

                {/* Applications */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-bold text-charcoal-800 uppercase tracking-wider text-[10px] block">
                    Intended Municipal Applications
                  </span>
                  <ul className="space-y-1 text-charcoal-600">
                    {item.applications.map((app, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 leading-snug">
                        <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 shrink-0 mt-0.5" />
                        <span>{app}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="p-4 bg-sand-50 border-t border-sand-200/80 text-[11px] text-charcoal-500 italic flex items-center justify-between">
              <span>Batch Lineage Tracked in ReBuild DB</span>
              <span className="text-forest-700 font-semibold font-mono">IS: 15658 Pending</span>
            </div>
          </div>
        ))}
      </div>

      {/* Safety Notice Callout */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold">Important Structural Specification Notice</h4>
          <p className="leading-relaxed">
            All ReBuild materials catalog items are manufactured under pilot research batch protocols for non-structural and landscaping use cases. Products are not certified for load-bearing columns, multi-story structural foundations, or high-velocity arterial roadway pavements without specific BIS laboratory compliance testing.
          </p>
        </div>
      </div>
    </div>
  );
};
