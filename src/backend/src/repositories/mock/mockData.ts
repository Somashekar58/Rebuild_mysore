import {
  UserProfile,
  Report,
  CollectionTeam,
  CollectionAssignment,
  ProcessingBatch,
  RecycledProduct,
  JurisdictionZone,
  NotificationItem
} from '../../types/index.js';

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'usr-cit-01',
    email: 'citizen@rebuildmysore.org',
    name: 'Aarav Sharma',
    role: 'CITIZEN',
    phone: '+91 98450 12345',
    organization: 'Resident, Kuvempunagar',
    created_at: '2026-08-01T09:00:00Z',
    updated_at: '2026-08-01T09:00:00Z'
  },
  {
    id: 'usr-bld-01',
    email: 'builder@rebuildmysore.org',
    name: 'Cauvery Infra & Constructions',
    role: 'BUILDER',
    phone: '+91 94480 67890',
    organization: 'Cauvery Infra Ltd, Vijayanagar',
    created_at: '2026-08-05T10:30:00Z',
    updated_at: '2026-08-05T10:30:00Z'
  },
  {
    id: 'usr-col-01',
    email: 'collection@rebuildmysore.org',
    name: 'Somesh Gowda (Lead Driver)',
    role: 'COLLECTION_TEAM',
    phone: '+91 99001 22334',
    organization: 'Mysuru CleanOps Crew 1',
    created_at: '2026-08-10T08:00:00Z',
    updated_at: '2026-08-10T08:00:00Z'
  },
  {
    id: 'usr-prc-01',
    email: 'processing@rebuildmysore.org',
    name: 'Dr. Ramesh Rao (Plant Supervisor)',
    role: 'PROCESSING_TEAM',
    phone: '+91 98860 44556',
    organization: 'Hebbal Eco-Aggregates Center',
    created_at: '2026-08-12T11:00:00Z',
    updated_at: '2026-08-12T11:00:00Z'
  },
  {
    id: 'usr-adm-01',
    email: 'admin@rebuildmysore.org',
    name: 'Pooja Kulkarni (MCC Waste Nodal Officer)',
    role: 'ADMIN',
    phone: '+91 821 2418000',
    organization: 'Mysuru City Corporation (Civic Nodal Desk)',
    created_at: '2026-07-15T09:00:00Z',
    updated_at: '2026-07-15T09:00:00Z'
  }
];

export const MOCK_ZONES: JurisdictionZone[] = [
  {
    id: 'zone-01',
    zone_name: 'Zone 1: Chamundi & Nazarbad Heritage Belt',
    zone_code: 'Z1-HERITAGE',
    description: 'Covers Nazarbad, Chamundipuram, Palace surroundings, and foothills.',
    center_lat: 12.3025,
    center_lng: 76.6640,
    radius_km: 4.5,
    assigned_team_ids: ['team-01', 'team-02']
  },
  {
    id: 'zone-02',
    zone_name: 'Zone 2: Kuvempunagar & Saraswathipuram',
    zone_code: 'Z2-SOUTH',
    description: 'Covers Kuvempunagar, Saraswathipuram, TK Layout, and Bogadi road.',
    center_lat: 12.2890,
    center_lng: 76.6280,
    radius_km: 5.0,
    assigned_team_ids: ['team-02', 'team-03']
  },
  {
    id: 'zone-03',
    zone_name: 'Zone 3: Vijayanagar & Gokulam',
    zone_code: 'Z3-WEST',
    description: 'Covers Vijayanagar Stages 1-4, Gokulam, Jayalakshmipuram, and Yadavagiri.',
    center_lat: 12.3275,
    center_lng: 76.6210,
    radius_km: 5.2,
    assigned_team_ids: ['team-01', 'team-03']
  },
  {
    id: 'zone-04',
    zone_name: 'Zone 4: Hebbal Industrial & Metagalli',
    zone_code: 'Z4-NORTH',
    description: 'Heavy construction, manufacturing, Metagalli, and outer ring road bypass.',
    center_lat: 12.3550,
    center_lng: 76.6120,
    radius_km: 6.0,
    assigned_team_ids: ['team-03', 'team-04']
  },
  {
    id: 'zone-05',
    zone_name: 'Zone 5: Bannimantap & Mandi Mohalla',
    zone_code: 'Z5-CENTRAL',
    description: 'Dense commercial, transit corridors, and old trade markets.',
    center_lat: 12.3320,
    center_lng: 76.6540,
    radius_km: 4.0,
    assigned_team_ids: ['team-02', 'team-04']
  }
];

export const MOCK_COLLECTION_TEAMS: CollectionTeam[] = [
  {
    id: 'team-01',
    team_name: 'Mysuru CleanOps Unit 1 (Heritage & East)',
    lead_driver_name: 'Somesh Gowda',
    contact_number: '+91 99001 22334',
    vehicle_number: 'KA-09-EA-4412 (10-Ton Tipper)',
    vehicle_capacity_tons: 10,
    zone_coverage: ['zone-01', 'zone-03'],
    is_available: true,
    current_active_assignments: 1
  },
  {
    id: 'team-02',
    team_name: 'Kuvempunagar Eco-Haulers Unit 2',
    lead_driver_name: 'Manjunath Swamy',
    contact_number: '+91 98455 77119',
    vehicle_number: 'KA-09-GA-8920 (8-Ton Dumper)',
    vehicle_capacity_tons: 8,
    zone_coverage: ['zone-01', 'zone-02', 'zone-05'],
    is_available: true,
    current_active_assignments: 2
  },
  {
    id: 'team-03',
    team_name: 'Hebbal Heavy Haul Unit 3',
    lead_driver_name: 'Basavaraj Patil',
    contact_number: '+91 97410 99432',
    vehicle_number: 'KA-09-D-3156 (16-Ton Multi-axle)',
    vehicle_capacity_tons: 16,
    zone_coverage: ['zone-02', 'zone-03', 'zone-04'],
    is_available: true,
    current_active_assignments: 1
  },
  {
    id: 'team-04',
    team_name: 'Chamundi Green Fleet Unit 4',
    lead_driver_name: 'Raghuveer Murthy',
    contact_number: '+91 96112 33887',
    vehicle_number: 'KA-09-F-7801 (6-Ton Flatbed)',
    vehicle_capacity_tons: 6,
    zone_coverage: ['zone-04', 'zone-05'],
    is_available: true,
    current_active_assignments: 0
  }
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'RBL-MYS-000120',
    citizen_id: 'usr-cit-01',
    citizen_name: 'Aarav Sharma',
    citizen_phone: '+91 98450 12345',
    waste_type: 'CONCRETE',
    estimated_quantity: 4500,
    quantity_unit: 'kg',
    description: 'Demolition residue of broken boundary wall, pavement slabs and RCC blocks dumped near park corner.',
    latitude: 12.2865,
    longitude: 76.6272,
    address: 'Near Anikethana Road, 8th Main, Kuvempunagar, Mysuru',
    landmark: 'Adjacent to Kuvempunagar Public Library',
    zone_id: 'zone-02',
    preferred_pickup_date: '2026-09-19',
    preferred_pickup_time_slot: '09:00 - 12:00',
    contact_phone: '+91 98450 12345',
    pickup_instructions: 'Gate open. Street accessible for medium tipper trucks.',
    status: 'SUBMITTED',
    priority: 'HIGH',
    priority_score: 78,
    priority_reasons: [
      'High quantity (4.5 tons)',
      'Pedestrian walkway encroachment near public park',
      'High concrete recyclability (>85%)'
    ],
    images: [
      {
        id: 'img-120-1',
        report_id: 'RBL-MYS-000120',
        image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-18T10:15:00Z'
      }
    ],
    ai_analysis: {
      id: 'ai-120',
      report_id: 'RBL-MYS-000120',
      waste_composition: {
        concrete_percentage: 65,
        bricks_percentage: 20,
        tiles_percentage: 8,
        soil_percentage: 5,
        other_percentage: 2
      },
      recyclability: 'HIGH',
      image_quality: 'GOOD',
      contamination: 'LOW',
      duplicate_probability: 0.05,
      confidence: 0.92,
      suggested_waste_type: 'CONCRETE',
      model_version: 'ReBuild-CV-v1.4',
      analyzed_at: '2026-09-18T10:15:30Z'
    },
    verification: {
      id: 'ver-120',
      report_id: 'RBL-MYS-000120',
      status: 'PENDING',
      flags: ['HIGH_VOLUME', 'RESIDENTIAL_PROXIMITY']
    },
    timeline: [
      {
        id: 'tl-120-1',
        report_id: 'RBL-MYS-000120',
        status: 'SUBMITTED',
        actor_id: 'usr-cit-01',
        actor_name: 'Aarav Sharma',
        actor_role: 'CITIZEN',
        note: 'Waste report registered via citizen portal with 1 photo evidence.',
        timestamp: '2026-09-18T10:15:00Z'
      },
      {
        id: 'tl-120-2',
        report_id: 'RBL-MYS-000120',
        status: 'AI_ANALYZED',
        actor_id: 'sys-ai',
        actor_name: 'AI Analysis Service (v1.4)',
        actor_role: 'ADMIN',
        note: 'AI classified 65% concrete, 20% bricks. High recyclability score.',
        timestamp: '2026-09-18T10:15:30Z'
      }
    ],
    created_at: '2026-09-18T10:15:00Z',
    updated_at: '2026-09-18T10:15:30Z'
  },
  {
    id: 'RBL-MYS-000121',
    citizen_id: 'usr-bld-01',
    citizen_name: 'Cauvery Infra & Constructions',
    citizen_phone: '+91 94480 67890',
    waste_type: 'BRICKS',
    estimated_quantity: 8200,
    quantity_unit: 'kg',
    description: 'Dismantled red brick masonry, plaster fragments, and clay rubble from commercial retrofit.',
    latitude: 12.3292,
    longitude: 76.6185,
    address: 'Ring Road Service Lane, Vijayanagar 2nd Stage, Mysuru',
    landmark: 'Opposite High Tension Road Substation',
    zone_id: 'zone-03',
    status: 'VERIFIED',
    priority: 'CRITICAL',
    priority_score: 92,
    priority_reasons: [
      'Heavy bulk volume (>8 tons)',
      'Potential rain washout into storm-water drain',
      'Verified municipal right-of-way obstruction'
    ],
    images: [
      {
        id: 'img-121-1',
        report_id: 'RBL-MYS-000121',
        image_url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-17T14:20:00Z'
      }
    ],
    ai_analysis: {
      id: 'ai-121',
      report_id: 'RBL-MYS-000121',
      waste_composition: {
        concrete_percentage: 15,
        bricks_percentage: 70,
        tiles_percentage: 10,
        soil_percentage: 3,
        other_percentage: 2
      },
      recyclability: 'HIGH',
      image_quality: 'EXCELLENT',
      contamination: 'LOW',
      duplicate_probability: 0.02,
      confidence: 0.94,
      suggested_waste_type: 'BRICKS',
      model_version: 'ReBuild-CV-v1.4',
      analyzed_at: '2026-09-17T14:21:00Z'
    },
    verification: {
      id: 'ver-121',
      report_id: 'RBL-MYS-000121',
      status: 'VERIFIED',
      verified_by: 'usr-adm-01',
      verifier_name: 'Pooja Kulkarni',
      notes: 'Site verified via geotagged image. Clear obstruction of service road drain path.',
      flags: ['STORMWATER_RISK', 'COMMERCIAL_SCALE'],
      verified_at: '2026-09-17T15:00:00Z'
    },
    timeline: [
      {
        id: 'tl-121-1',
        report_id: 'RBL-MYS-000121',
        status: 'SUBMITTED',
        actor_id: 'usr-bld-01',
        actor_name: 'Cauvery Infra & Constructions',
        actor_role: 'BUILDER',
        note: 'Commercial retrofit demolition waste logged.',
        timestamp: '2026-09-17T14:20:00Z'
      },
      {
        id: 'tl-121-2',
        report_id: 'RBL-MYS-000121',
        status: 'AI_ANALYZED',
        actor_id: 'sys-ai',
        actor_name: 'AI Analysis Service',
        actor_role: 'ADMIN',
        note: 'AI detected 70% clay bricks. High suitability for recycled pavers.',
        timestamp: '2026-09-17T14:21:00Z'
      },
      {
        id: 'tl-121-3',
        report_id: 'RBL-MYS-000121',
        status: 'VERIFIED',
        actor_id: 'usr-adm-01',
        actor_name: 'Pooja Kulkarni',
        actor_role: 'ADMIN',
        note: 'Report officially verified by MCC Nodal Desk.',
        timestamp: '2026-09-17T15:00:00Z'
      }
    ],
    created_at: '2026-09-17T14:20:00Z',
    updated_at: '2026-09-17T15:00:00Z'
  },
  {
    id: 'RBL-MYS-000122',
    citizen_id: 'usr-cit-01',
    citizen_name: 'Dr. Girish Prabhu',
    citizen_phone: '+91 98451 99887',
    waste_type: 'TILES',
    estimated_quantity: 1800,
    quantity_unit: 'kg',
    description: 'Chipped ceramic floor tiles, vitrified tile off-cuts, and adhesive mortar from hospital renovation.',
    latitude: 12.3090,
    longitude: 76.6695,
    address: 'Shalivahana Road, Nazarbad, Mysuru',
    landmark: 'Behind Zoo Gardens South Gate',
    zone_id: 'zone-01',
    status: 'ASSIGNED',
    priority: 'MEDIUM',
    priority_score: 64,
    priority_reasons: [
      'Sharp edges posing hazard to stray animals',
      'Moderate quantity (~1.8 tons)',
      'Ideal additive for secondary aggregate processing'
    ],
    images: [
      {
        id: 'img-122-1',
        report_id: 'RBL-MYS-000122',
        image_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-16T11:00:00Z'
      }
    ],
    assigned_collection_team_id: 'team-01',
    assigned_collection_team_name: 'Mysuru CleanOps Unit 1 (Heritage & East)',
    ai_analysis: {
      id: 'ai-122',
      report_id: 'RBL-MYS-000122',
      waste_composition: {
        concrete_percentage: 10,
        bricks_percentage: 8,
        tiles_percentage: 75,
        soil_percentage: 2,
        other_percentage: 5
      },
      recyclability: 'MEDIUM',
      image_quality: 'GOOD',
      contamination: 'LOW',
      duplicate_probability: 0.08,
      confidence: 0.89,
      suggested_waste_type: 'TILES',
      model_version: 'ReBuild-CV-v1.4',
      analyzed_at: '2026-09-16T11:01:00Z'
    },
    verification: {
      id: 'ver-122',
      report_id: 'RBL-MYS-000122',
      status: 'VERIFIED',
      verified_by: 'usr-adm-01',
      verifier_name: 'Pooja Kulkarni',
      notes: 'Verified. Located on edge of heritage buffer zone.',
      flags: ['PUBLIC_SAFETY_HAZARD'],
      verified_at: '2026-09-16T11:45:00Z'
    },
    timeline: [
      {
        id: 'tl-122-1',
        report_id: 'RBL-MYS-000122',
        status: 'SUBMITTED',
        actor_id: 'usr-cit-01',
        actor_name: 'Dr. Girish Prabhu',
        actor_role: 'CITIZEN',
        note: 'Ceramic tile waste logged.',
        timestamp: '2026-09-16T11:00:00Z'
      },
      {
        id: 'tl-122-2',
        report_id: 'RBL-MYS-000122',
        status: 'VERIFIED',
        actor_id: 'usr-adm-01',
        actor_name: 'Pooja Kulkarni',
        actor_role: 'ADMIN',
        note: 'Report approved for collection dispatch.',
        timestamp: '2026-09-16T11:45:00Z'
      },
      {
        id: 'tl-122-3',
        report_id: 'RBL-MYS-000122',
        status: 'ASSIGNED',
        actor_id: 'usr-adm-01',
        actor_name: 'Pooja Kulkarni',
        actor_role: 'ADMIN',
        note: 'Assigned to Mysuru CleanOps Unit 1 for pickup.',
        timestamp: '2026-09-16T14:30:00Z'
      }
    ],
    created_at: '2026-09-16T11:00:00Z',
    updated_at: '2026-09-16T14:30:00Z'
  },
  {
    id: 'RBL-MYS-000123',
    citizen_id: 'usr-cit-01',
    citizen_name: 'Sunita Nayak',
    citizen_phone: '+91 98452 33441',
    waste_type: 'MIXED',
    estimated_quantity: 3400,
    quantity_unit: 'kg',
    description: 'Mixed excavation soil, concrete chunks, and plaster scrapings from basement foundation work.',
    latitude: 12.3315,
    longitude: 76.6360,
    address: '3rd Stage, Gokulam, Mysuru',
    landmark: 'Near Yoga Kendra Circle',
    zone_id: 'zone-03',
    status: 'COLLECTED',
    priority: 'HIGH',
    priority_score: 72,
    priority_reasons: [
      'High dust dispersion in quiet residential neighborhood',
      'Assigned priority due to citizen escalations',
      'Successfully collected and routed to Hebbal facility'
    ],
    images: [
      {
        id: 'img-123-1',
        report_id: 'RBL-MYS-000123',
        image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-15T09:30:00Z'
      }
    ],
    assigned_collection_team_id: 'team-03',
    assigned_collection_team_name: 'Hebbal Heavy Haul Unit 3',
    timeline: [
      {
        id: 'tl-123-1',
        report_id: 'RBL-MYS-000123',
        status: 'SUBMITTED',
        actor_id: 'usr-cit-01',
        actor_name: 'Sunita Nayak',
        actor_role: 'CITIZEN',
        note: 'Report submitted.',
        timestamp: '2026-09-15T09:30:00Z'
      },
      {
        id: 'tl-123-2',
        report_id: 'RBL-MYS-000123',
        status: 'VERIFIED',
        actor_id: 'usr-adm-01',
        actor_name: 'Pooja Kulkarni',
        actor_role: 'ADMIN',
        note: 'Verified for collection.',
        timestamp: '2026-09-15T11:00:00Z'
      },
      {
        id: 'tl-123-3',
        report_id: 'RBL-MYS-000123',
        status: 'ASSIGNED',
        actor_id: 'usr-adm-01',
        actor_name: 'Pooja Kulkarni',
        actor_role: 'ADMIN',
        note: 'Assigned to Unit 3.',
        timestamp: '2026-09-15T12:00:00Z'
      },
      {
        id: 'tl-123-4',
        report_id: 'RBL-MYS-000123',
        status: 'COLLECTED',
        actor_id: 'usr-col-01',
        actor_name: 'Basavaraj Patil',
        actor_role: 'COLLECTION_TEAM',
        note: 'Site cleared. 3,380 kg weighed at weighbridge. Photo proof uploaded.',
        timestamp: '2026-09-15T16:40:00Z'
      }
    ],
    created_at: '2026-09-15T09:30:00Z',
    updated_at: '2026-09-15T16:40:00Z'
  },
  {
    id: 'RBL-MYS-000124',
    citizen_id: 'usr-bld-01',
    citizen_name: 'Cauvery Infra Developers',
    citizen_phone: '+91 94480 67890',
    waste_type: 'CONCRETE',
    estimated_quantity: 6200,
    quantity_unit: 'kg',
    description: 'Excavated grade-slab concrete pieces and footing cores from bridge approach road.',
    latitude: 12.3580,
    longitude: 76.6090,
    address: 'Hebbal 2nd Stage Industrial Main Road, Mysuru',
    landmark: 'Behind KIADB Industrial Office',
    zone_id: 'zone-04',
    status: 'PROCESSING',
    priority: 'HIGH',
    priority_score: 84,
    priority_reasons: [
      'Very high structural density concrete',
      'Batch-fed into secondary jaw crusher for 20mm aggregate recovery',
      'Linked to RB-BATCH-0007'
    ],
    images: [
      {
        id: 'img-124-1',
        report_id: 'RBL-MYS-000124',
        image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-14T08:00:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-124-1',
        report_id: 'RBL-MYS-000124',
        status: 'SUBMITTED',
        actor_id: 'usr-bld-01',
        actor_name: 'Cauvery Infra Developers',
        actor_role: 'BUILDER',
        note: 'Industrial slab concrete logged.',
        timestamp: '2026-09-14T08:00:00Z'
      },
      {
        id: 'tl-124-2',
        report_id: 'RBL-MYS-000124',
        status: 'VERIFIED',
        actor_id: 'usr-adm-01',
        actor_name: 'Pooja Kulkarni',
        actor_role: 'ADMIN',
        note: 'Direct industrial intake verification.',
        timestamp: '2026-09-14T09:00:00Z'
      },
      {
        id: 'tl-124-3',
        report_id: 'RBL-MYS-000124',
        status: 'COLLECTED',
        actor_id: 'usr-col-01',
        actor_name: 'Hebbal Fleet',
        actor_role: 'COLLECTION_TEAM',
        note: '6,200 kg hauled into yard.',
        timestamp: '2026-09-14T14:15:00Z'
      },
      {
        id: 'tl-124-4',
        report_id: 'RBL-MYS-000124',
        status: 'PROCESSING',
        actor_id: 'usr-prc-01',
        actor_name: 'Dr. Ramesh Rao',
        actor_role: 'PROCESSING_TEAM',
        note: 'Assigned to active batch RB-BATCH-0007. Jaw crushing in progress.',
        timestamp: '2026-09-15T10:00:00Z'
      }
    ],
    created_at: '2026-09-14T08:00:00Z',
    updated_at: '2026-09-15T10:00:00Z'
  },
  {
    id: 'RBL-MYS-000125',
    citizen_id: 'usr-cit-01',
    citizen_name: 'Vinayaka Traders',
    citizen_phone: '+91 98865 11223',
    waste_type: 'BRICKS',
    estimated_quantity: 4000,
    quantity_unit: 'kg',
    description: 'Clean red clay brick demolition from old warehouse wall.',
    latitude: 12.3340,
    longitude: 76.6510,
    address: 'Sayyaji Rao Road, Mandi Mohalla, Mysuru',
    landmark: 'Near Bamboo Bazaar junction',
    zone_id: 'zone-05',
    status: 'RECYCLED',
    priority: 'HIGH',
    priority_score: 80,
    priority_reasons: [
      'High purity single-stream clay bricks',
      'Fully crushed and converted to 1,200 interlock paving blocks'
    ],
    images: [
      {
        id: 'img-125-1',
        report_id: 'RBL-MYS-000125',
        image_url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-10T09:00:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-125-1',
        report_id: 'RBL-MYS-000125',
        status: 'SUBMITTED',
        actor_id: 'usr-cit-01',
        actor_name: 'Vinayaka Traders',
        actor_role: 'CITIZEN',
        note: 'Logged.',
        timestamp: '2026-09-10T09:00:00Z'
      },
      {
        id: 'tl-125-2',
        report_id: 'RBL-MYS-000125',
        status: 'COLLECTED',
        actor_id: 'usr-col-01',
        actor_name: 'Somesh Gowda',
        actor_role: 'COLLECTION_TEAM',
        note: 'Collected.',
        timestamp: '2026-09-11T11:00:00Z'
      },
      {
        id: 'tl-125-3',
        report_id: 'RBL-MYS-000125',
        status: 'PROCESSING',
        actor_id: 'usr-prc-01',
        actor_name: 'Dr. Ramesh Rao',
        actor_role: 'PROCESSING_TEAM',
        note: 'Processed in batch RB-BATCH-0004.',
        timestamp: '2026-09-12T10:00:00Z'
      },
      {
        id: 'tl-125-4',
        report_id: 'RBL-MYS-000125',
        status: 'RECYCLED',
        actor_id: 'usr-prc-01',
        actor_name: 'Dr. Ramesh Rao',
        actor_role: 'PROCESSING_TEAM',
        note: 'Transformed into ReBuild Recycled Interlocking Pavers (Batch RB-BATCH-0004).',
        timestamp: '2026-09-13T16:00:00Z'
      }
    ],
    created_at: '2026-09-10T09:00:00Z',
    updated_at: '2026-09-13T16:00:00Z'
  },
  {
    id: 'RBL-MYS-000126',
    citizen_id: 'usr-cit-01',
    citizen_name: 'Mahesh Kumar',
    citizen_phone: '+91 97400 55443',
    waste_type: 'SOIL',
    estimated_quantity: 5000,
    quantity_unit: 'kg',
    description: 'Red murrum and excavation soil from rainwater percolation pit.',
    latitude: 12.3010,
    longitude: 76.6340,
    address: 'Kantharaj Urs Road, Saraswathipuram, Mysuru',
    landmark: 'Near Fire Brigade station',
    zone_id: 'zone-02',
    status: 'VERIFICATION_PENDING',
    priority: 'MEDIUM',
    priority_score: 55,
    priority_reasons: [
      'Excavation soil suitable for subgrade leveling',
      'No hazardous contaminants reported'
    ],
    images: [
      {
        id: 'img-126-1',
        report_id: 'RBL-MYS-000126',
        image_url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-18T08:30:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-126-1',
        report_id: 'RBL-MYS-000126',
        status: 'SUBMITTED',
        actor_id: 'usr-cit-01',
        actor_name: 'Mahesh Kumar',
        actor_role: 'CITIZEN',
        note: 'Excavation soil report submitted.',
        timestamp: '2026-09-18T08:30:00Z'
      }
    ],
    created_at: '2026-09-18T08:30:00Z',
    updated_at: '2026-09-18T08:30:00Z'
  },
  {
    id: 'RBL-MYS-000127',
    citizen_id: 'usr-cit-01',
    citizen_name: 'Rekha Varma',
    citizen_phone: '+91 98453 88771',
    waste_type: 'OTHER',
    estimated_quantity: 1200,
    quantity_unit: 'kg',
    description: 'Dry gypsum wall board pieces, false ceiling off-cuts and metal studs.',
    latitude: 12.3210,
    longitude: 76.6430,
    address: 'Princess Road, Yadavagiri, Mysuru',
    landmark: 'Near Railway Officers Club',
    zone_id: 'zone-03',
    status: 'VERIFIED',
    priority: 'LOW',
    priority_score: 38,
    priority_reasons: [
      'Low total mass (~1.2 tons)',
      'Low structural recyclability; requires specialized gypsum reclamation'
    ],
    images: [
      {
        id: 'img-127-1',
        report_id: 'RBL-MYS-000127',
        image_url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-17T16:00:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-127-1',
        report_id: 'RBL-MYS-000127',
        status: 'SUBMITTED',
        actor_id: 'usr-cit-01',
        actor_name: 'Rekha Varma',
        actor_role: 'CITIZEN',
        note: 'Report created.',
        timestamp: '2026-09-17T16:00:00Z'
      },
      {
        id: 'tl-127-2',
        report_id: 'RBL-MYS-000127',
        status: 'VERIFIED',
        actor_id: 'usr-adm-01',
        actor_name: 'Pooja Kulkarni',
        actor_role: 'ADMIN',
        note: 'Approved for secondary salvage.',
        timestamp: '2026-09-18T09:15:00Z'
      }
    ],
    created_at: '2026-09-17T16:00:00Z',
    updated_at: '2026-09-18T09:15:00Z'
  },
  {
    id: 'RBL-MYS-000128',
    citizen_id: 'usr-cit-01',
    citizen_name: 'Kishore Chandran',
    citizen_phone: '+91 99011 44552',
    waste_type: 'CONCRETE',
    estimated_quantity: 3800,
    quantity_unit: 'kg',
    description: 'Suspicious duplicate report for boundary wall rubble already cleared yesterday.',
    latitude: 12.2862,
    longitude: 76.6275,
    address: '8th Main, Kuvempunagar, Mysuru',
    landmark: 'Next to Kuvempunagar Library',
    zone_id: 'zone-02',
    status: 'DUPLICATE',
    priority: 'LOW',
    priority_score: 15,
    priority_reasons: [
      'Flagged as duplicate of RBL-MYS-000120 by proximity engine (within 35m)',
      'Identical visual composition detected by AI'
    ],
    images: [
      {
        id: 'img-128-1',
        report_id: 'RBL-MYS-000128',
        image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-18T11:00:00Z'
      }
    ],
    verification: {
      id: 'ver-128',
      report_id: 'RBL-MYS-000128',
      status: 'POSSIBLE_DUPLICATE',
      verified_by: 'usr-adm-01',
      verifier_name: 'Pooja Kulkarni',
      notes: 'Matches active report RBL-MYS-000120. Duplicate marker confirmed.',
      duplicate_of_report_id: 'RBL-MYS-000120',
      flags: ['GEO_PROXIMITY_MATCH', 'VISUAL_SIMILARITY'],
      verified_at: '2026-09-18T11:30:00Z'
    },
    timeline: [
      {
        id: 'tl-128-1',
        report_id: 'RBL-MYS-000128',
        status: 'SUBMITTED',
        actor_id: 'usr-cit-01',
        actor_name: 'Kishore Chandran',
        actor_role: 'CITIZEN',
        note: 'Report submitted.',
        timestamp: '2026-09-18T11:00:00Z'
      },
      {
        id: 'tl-128-2',
        report_id: 'RBL-MYS-000128',
        status: 'DUPLICATE',
        actor_id: 'usr-adm-01',
        actor_name: 'Pooja Kulkarni',
        actor_role: 'ADMIN',
        note: 'Marked as duplicate of RBL-MYS-000120.',
        timestamp: '2026-09-18T11:30:00Z'
      }
    ],
    created_at: '2026-09-18T11:00:00Z',
    updated_at: '2026-09-18T11:30:00Z'
  },
  {
    id: 'RBL-MYS-000129',
    citizen_id: 'usr-bld-01',
    citizen_name: 'Mysuru Urban Builders Guild',
    citizen_phone: '+91 94490 22114',
    waste_type: 'MIXED',
    estimated_quantity: 9500,
    quantity_unit: 'kg',
    description: 'Mixed debris, broken granite, cement mortar and hollow blocks dumped on vacant corner plot.',
    latitude: 12.3490,
    longitude: 76.6210,
    address: 'Metagalli Industrial Main, near KRS Road, Mysuru',
    landmark: 'Adjacent to Metagalli Signal',
    zone_id: 'zone-04',
    status: 'SORTING',
    priority: 'HIGH',
    priority_score: 82,
    priority_reasons: [
      'High mass (9.5 tons)',
      'Undergoing mechanical screening to separate coarse concrete from clay bricks'
    ],
    images: [
      {
        id: 'img-129-1',
        report_id: 'RBL-MYS-000129',
        image_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-13T10:00:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-129-1',
        report_id: 'RBL-MYS-000129',
        status: 'SUBMITTED',
        actor_id: 'usr-bld-01',
        actor_name: 'Mysuru Urban Builders Guild',
        actor_role: 'BUILDER',
        note: 'Bulk mixed rubble logged.',
        timestamp: '2026-09-13T10:00:00Z'
      },
      {
        id: 'tl-129-2',
        report_id: 'RBL-MYS-000129',
        status: 'COLLECTED',
        actor_id: 'usr-col-01',
        actor_name: 'Basavaraj Patil',
        actor_role: 'COLLECTION_TEAM',
        note: 'Collected via 16-ton multi-axle.',
        timestamp: '2026-09-14T15:00:00Z'
      },
      {
        id: 'tl-129-3',
        report_id: 'RBL-MYS-000129',
        status: 'SORTING',
        actor_id: 'usr-prc-01',
        actor_name: 'Dr. Ramesh Rao',
        actor_role: 'PROCESSING_TEAM',
        note: 'Vibratory screen sorting in operation.',
        timestamp: '2026-09-16T09:30:00Z'
      }
    ],
    created_at: '2026-09-13T10:00:00Z',
    updated_at: '2026-09-16T09:30:00Z'
  },
  {
    id: 'RBL-MYS-000130',
    citizen_id: 'usr-cit-01',
    citizen_name: 'Shankar Murthy',
    citizen_phone: '+91 94481 00223',
    waste_type: 'CONCRETE',
    estimated_quantity: 5200,
    quantity_unit: 'kg',
    description: 'Chipped roof slab concrete and precast lintel poles from home renovation.',
    latitude: 12.3050,
    longitude: 76.6570,
    address: 'MG Road, Agrahara / Fort Mohalla, Mysuru',
    landmark: 'Behind JSS Hospital Complex',
    zone_id: 'zone-01',
    status: 'VERIFIED',
    priority: 'HIGH',
    priority_score: 85,
    priority_reasons: [
      'Proximity to major hospital arterial road (MG Road)',
      'Severe traffic congestion risk',
      'Direct route for clean recyclability'
    ],
    images: [
      {
        id: 'img-130-1',
        report_id: 'RBL-MYS-000130',
        image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-17T18:00:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-130-1',
        report_id: 'RBL-MYS-000130',
        status: 'SUBMITTED',
        actor_id: 'usr-cit-01',
        actor_name: 'Shankar Murthy',
        actor_role: 'CITIZEN',
        note: 'Submitted.',
        timestamp: '2026-09-17T18:00:00Z'
      },
      {
        id: 'tl-130-2',
        report_id: 'RBL-MYS-000130',
        status: 'VERIFIED',
        actor_id: 'usr-adm-01',
        actor_name: 'Pooja Kulkarni',
        actor_role: 'ADMIN',
        note: 'High sensitivity verification granted due to hospital zone.',
        timestamp: '2026-09-18T08:45:00Z'
      }
    ],
    created_at: '2026-09-17T18:00:00Z',
    updated_at: '2026-09-18T08:45:00Z'
  },
  {
    id: 'RBL-MYS-000131',
    citizen_id: 'usr-cit-01',
    citizen_name: 'Ananya Deshpande',
    citizen_phone: '+91 99800 11992',
    waste_type: 'BRICKS',
    estimated_quantity: 2600,
    quantity_unit: 'kg',
    description: 'Demolished partition walls, mortar scrapings, and terracotta chimney bricks.',
    latitude: 12.2965,
    longitude: 76.6590,
    address: 'Ramanuja Road, 4th Cross, Chamundipuram, Mysuru',
    landmark: 'Near Chamundipuram Circle',
    zone_id: 'zone-01',
    status: 'ASSIGNED',
    priority: 'MEDIUM',
    priority_score: 62,
    priority_reasons: [
      'Dense market area with heavy pedestrian flow',
      'Assigned to Unit 2 for early morning pickup'
    ],
    images: [
      {
        id: 'img-131-1',
        report_id: 'RBL-MYS-000131',
        image_url: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-16T15:00:00Z'
      }
    ],
    assigned_collection_team_id: 'team-02',
    assigned_collection_team_name: 'Kuvempunagar Eco-Haulers Unit 2',
    timeline: [
      {
        id: 'tl-131-1',
        report_id: 'RBL-MYS-000131',
        status: 'SUBMITTED',
        actor_id: 'usr-cit-01',
        actor_name: 'Ananya Deshpande',
        actor_role: 'CITIZEN',
        note: 'Report submitted.',
        timestamp: '2026-09-16T15:00:00Z'
      },
      {
        id: 'tl-131-2',
        report_id: 'RBL-MYS-000131',
        status: 'ASSIGNED',
        actor_id: 'usr-adm-01',
        actor_name: 'Pooja Kulkarni',
        actor_role: 'ADMIN',
        note: 'Assigned to Unit 2 for scheduled pickup.',
        timestamp: '2026-09-17T10:00:00Z'
      }
    ],
    created_at: '2026-09-16T15:00:00Z',
    updated_at: '2026-09-17T10:00:00Z'
  },
  {
    id: 'RBL-MYS-000132',
    citizen_id: 'usr-bld-01',
    citizen_name: 'Heritage Heritage City Builders',
    citizen_phone: '+91 94480 33445',
    waste_type: 'CONCRETE',
    estimated_quantity: 7500,
    quantity_unit: 'kg',
    description: 'Foundation pile head cut-offs and surplus ready-mix concrete washout chunks.',
    latitude: 12.3380,
    longitude: 76.5890,
    address: 'Hootagalli Industrial Main, Outer Ring Road, Mysuru',
    landmark: 'Near Koorgalli BEML Complex',
    zone_id: 'zone-04',
    status: 'COLLECTED',
    priority: 'HIGH',
    priority_score: 79,
    priority_reasons: [
      'High grade industrial concrete',
      'High suitability for 40mm down road base sub-ballast'
    ],
    images: [
      {
        id: 'img-132-1',
        report_id: 'RBL-MYS-000132',
        image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
        uploaded_at: '2026-09-14T11:00:00Z'
      }
    ],
    timeline: [
      {
        id: 'tl-132-1',
        report_id: 'RBL-MYS-000132',
        status: 'SUBMITTED',
        actor_id: 'usr-bld-01',
        actor_name: 'Heritage City Builders',
        actor_role: 'BUILDER',
        note: 'Pile head concrete reported.',
        timestamp: '2026-09-14T11:00:00Z'
      },
      {
        id: 'tl-132-2',
        report_id: 'RBL-MYS-000132',
        status: 'COLLECTED',
        actor_id: 'usr-col-01',
        actor_name: 'Basavaraj Patil',
        actor_role: 'COLLECTION_TEAM',
        note: '7,480 kg hauled into yard.',
        timestamp: '2026-09-15T15:30:00Z'
      }
    ],
    created_at: '2026-09-14T11:00:00Z',
    updated_at: '2026-09-15T15:30:00Z'
  }
];

export const MOCK_COLLECTION_ASSIGNMENTS: CollectionAssignment[] = [
  {
    id: 'ASG-MYS-0041',
    report_id: 'RBL-MYS-000122',
    collection_team_id: 'team-01',
    collection_team_name: 'Mysuru CleanOps Unit 1 (Heritage & East)',
    status: 'ACCEPTED',
    assigned_by: 'usr-adm-01',
    assigned_at: '2026-09-16T14:30:00Z',
    accepted_at: '2026-09-16T15:00:00Z',
    distance_km: 3.4
  },
  {
    id: 'ASG-MYS-0042',
    report_id: 'RBL-MYS-000131',
    collection_team_id: 'team-02',
    collection_team_name: 'Kuvempunagar Eco-Haulers Unit 2',
    status: 'PENDING',
    assigned_by: 'usr-adm-01',
    assigned_at: '2026-09-17T10:00:00Z',
    distance_km: 4.8
  },
  {
    id: 'ASG-MYS-0039',
    report_id: 'RBL-MYS-000123',
    collection_team_id: 'team-03',
    collection_team_name: 'Hebbal Heavy Haul Unit 3',
    status: 'COLLECTED',
    assigned_by: 'usr-adm-01',
    assigned_at: '2026-09-15T12:00:00Z',
    accepted_at: '2026-09-15T12:30:00Z',
    started_at: '2026-09-15T14:00:00Z',
    completed_at: '2026-09-15T16:40:00Z',
    distance_km: 6.2,
    proof: {
      id: 'prf-039',
      assignment_id: 'ASG-MYS-0039',
      photo_url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80',
      verified_weight_kg: 3380,
      gps_latitude: 12.3315,
      gps_longitude: 76.6360,
      driver_notes: 'Site completely swept clean. 3.38 tons offloaded at processing hopper.',
      recorded_at: '2026-09-15T16:40:00Z'
    }
  }
];

export const MOCK_PROCESSING_BATCHES: ProcessingBatch[] = [
  {
    id: 'RB-BATCH-0007',
    source_report_ids: ['RBL-MYS-000124', 'RBL-MYS-000132'],
    intake_quantity_kg: 13680,
    material_type: 'CONCRETE',
    status: 'RECOVERY',
    recovered_quantity_kg: 12450,
    rejected_quantity_kg: 1230,
    recovery_rate_percentage: 91.0,
    created_at: '2026-09-15T10:00:00Z',
    updated_at: '2026-09-17T16:00:00Z',
    processed_by_name: 'Dr. Ramesh Rao (Plant Supervisor)',
    notes: 'Aggregated high-strength structural concrete from Hebbal & Hootagalli. 20mm aggregates recovered.'
  },
  {
    id: 'RB-BATCH-0006',
    source_report_ids: ['RBL-MYS-000125'],
    intake_quantity_kg: 4000,
    material_type: 'BRICKS',
    status: 'COMPLETED',
    recovered_quantity_kg: 3640,
    rejected_quantity_kg: 360,
    recovery_rate_percentage: 91.0,
    created_at: '2026-09-12T10:00:00Z',
    updated_at: '2026-09-13T16:00:00Z',
    completed_at: '2026-09-13T16:00:00Z',
    processed_by_name: 'Dr. Ramesh Rao',
    notes: 'Single-source pure clay brick batch. Yielded 1,450 heavy-duty interlocking pavers.'
  },
  {
    id: 'RB-BATCH-0005',
    source_report_ids: ['RBL-MYS-000123'],
    intake_quantity_kg: 3380,
    material_type: 'MIXED',
    status: 'COMPLETED',
    recovered_quantity_kg: 2870,
    rejected_quantity_kg: 510,
    recovery_rate_percentage: 84.9,
    created_at: '2026-09-15T17:00:00Z',
    updated_at: '2026-09-16T18:00:00Z',
    completed_at: '2026-09-16T18:00:00Z',
    processed_by_name: 'Dr. Ramesh Rao',
    notes: 'Screened subgrade soil diverted for non-structural hollow block manufacture.'
  }
];

export const MOCK_RECYCLED_PRODUCTS: RecycledProduct[] = [
  {
    id: 'prod-001',
    batch_id: 'RB-BATCH-0006',
    product_name: 'Recycled Paver',
    units_produced: 1450,
    unit_of_measure: 'units',
    recycled_content_percentage: 85,
    dimensions_mm: '200 x 100 x 60 mm',
    prototype_unit_cost_inr: 28,
    intended_application: 'Pedestrian footpaths, heritage walkways, park tracks, civic plazas',
    production_status: 'PILOT',
    manufactured_at: '2026-09-13T16:00:00Z'
  },
  {
    id: 'prod-002',
    batch_id: 'RB-BATCH-0007',
    product_name: 'Recycled Construction Block',
    units_produced: 620,
    unit_of_measure: 'units',
    recycled_content_percentage: 75,
    dimensions_mm: '400 x 200 x 200 mm',
    prototype_unit_cost_inr: 65,
    intended_application: 'Boundary walls, non-loadbearing partitions, compound fences',
    production_status: 'PROTOTYPE',
    manufactured_at: '2026-09-17T16:00:00Z'
  },
  {
    id: 'prod-003',
    batch_id: 'RB-BATCH-0007',
    product_name: 'Coarse Aggregate',
    units_produced: 7.2,
    unit_of_measure: 'tons',
    recycled_content_percentage: 100,
    dimensions_mm: '20mm Down Graded',
    prototype_unit_cost_inr: 850,
    intended_application: 'Sub-base for road widening and drainage filter media',
    production_status: 'COMMERCIAL_READY',
    manufactured_at: '2026-09-17T16:00:00Z'
  }
];

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-01',
    user_id: 'usr-cit-01',
    title: 'Report Verified',
    message: 'Your report RBL-MYS-000120 has been verified by the MCC Waste Operations Desk.',
    report_id: 'RBL-MYS-000120',
    type: 'SUCCESS',
    read: false,
    created_at: '2026-09-18T10:20:00Z'
  },
  {
    id: 'notif-02',
    user_id: 'usr-cit-01',
    title: 'Collection Completed',
    message: 'Your construction waste report RBL-MYS-000123 has been collected and cleared.',
    report_id: 'RBL-MYS-000123',
    type: 'INFO',
    read: true,
    created_at: '2026-09-15T16:45:00Z'
  },
  {
    id: 'notif-03',
    user_id: 'usr-col-01',
    title: 'New Assignment Dispatched',
    message: 'High-priority pickup assigned at Shalivahana Road, Nazarbad (RBL-MYS-000122).',
    report_id: 'RBL-MYS-000122',
    type: 'ACTION_REQUIRED',
    read: false,
    created_at: '2026-09-16T14:30:00Z'
  },
  {
    id: 'notif-04',
    user_id: 'usr-prc-01',
    title: 'New Material Received',
    message: 'Hebbal heavy haul delivered 7.48 tons of structural concrete from Hootagalli.',
    report_id: 'RBL-MYS-000132',
    type: 'INFO',
    read: true,
    created_at: '2026-09-15T15:35:00Z'
  }
];
