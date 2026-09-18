import { v4 as uuidv4 } from 'uuid';
import {
  UserProfile,
  Report,
  TimelineEvent,
  CollectionTeam,
  CollectionAssignment,
  CollectionProof,
  ProcessingBatch,
  RecycledProduct,
  NotificationItem,
  ImpactMetrics,
  JurisdictionZone
} from '../../types/index.js';
import {
  IUserRepository,
  IReportRepository,
  ReportFilterOptions,
  ICollectionRepository,
  IProcessingRepository,
  IAnalyticsRepository,
  INotificationRepository
} from '../interfaces/index.js';
import {
  MOCK_USERS,
  MOCK_REPORTS,
  MOCK_COLLECTION_TEAMS,
  MOCK_COLLECTION_ASSIGNMENTS,
  MOCK_PROCESSING_BATCHES,
  MOCK_RECYCLED_PRODUCTS,
  MOCK_ZONES,
  MOCK_NOTIFICATIONS
} from './mockData.js';

// Central in-memory state
let users: UserProfile[] = [...MOCK_USERS];
let reports: Report[] = JSON.parse(JSON.stringify(MOCK_REPORTS));
let teams: CollectionTeam[] = JSON.parse(JSON.stringify(MOCK_COLLECTION_TEAMS));
let assignments: CollectionAssignment[] = JSON.parse(JSON.stringify(MOCK_COLLECTION_ASSIGNMENTS));
let batches: ProcessingBatch[] = JSON.parse(JSON.stringify(MOCK_PROCESSING_BATCHES));
let products: RecycledProduct[] = JSON.parse(JSON.stringify(MOCK_RECYCLED_PRODUCTS));
let zones: JurisdictionZone[] = JSON.parse(JSON.stringify(MOCK_ZONES));
let notifications: NotificationItem[] = JSON.parse(JSON.stringify(MOCK_NOTIFICATIONS));

export class MockUserRepository implements IUserRepository {
  async findById(id: string): Promise<UserProfile | null> {
    return users.find((u) => u.id === id) || null;
  }

  async findByEmail(email: string): Promise<UserProfile | null> {
    return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  async findAll(): Promise<UserProfile[]> {
    return [...users];
  }
}

export class MockReportRepository implements IReportRepository {
  async findById(id: string): Promise<Report | null> {
    const report = reports.find((r) => r.id === id);
    return report ? JSON.parse(JSON.stringify(report)) : null;
  }

  async findAll(filters?: ReportFilterOptions): Promise<Report[]> {
    let result = [...reports];

    if (filters) {
      if (filters.status) {
        result = result.filter((r) => r.status === filters.status);
      }
      if (filters.waste_type) {
        result = result.filter((r) => r.waste_type === filters.waste_type);
      }
      if (filters.priority) {
        result = result.filter((r) => r.priority === filters.priority);
      }
      if (filters.zone_id) {
        result = result.filter((r) => r.zone_id === filters.zone_id);
      }
      if (filters.citizen_id) {
        result = result.filter((r) => r.citizen_id === filters.citizen_id);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(
          (r) =>
            r.id.toLowerCase().includes(q) ||
            r.address.toLowerCase().includes(q) ||
            r.citizen_name.toLowerCase().includes(q) ||
            (r.description && r.description.toLowerCase().includes(q))
        );
      }
    }

    // Sort descending by created_at
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return JSON.parse(JSON.stringify(result));
  }

  async create(reportData: Omit<Report, 'id' | 'created_at' | 'updated_at' | 'timeline'>): Promise<Report> {
    const count = reports.length + 121;
    const padded = String(count).padStart(6, '0');
    const newId = `RBL-MYS-${padded}`;
    const now = new Date().toISOString();

    const initialTimeline: TimelineEvent = {
      id: `tl-${uuidv4().substring(0, 8)}`,
      report_id: newId,
      status: reportData.status || 'SUBMITTED',
      actor_id: reportData.citizen_id,
      actor_name: reportData.citizen_name,
      actor_role: 'CITIZEN',
      note: 'Report submitted by citizen/builder with photographic evidence.',
      timestamp: now
    };

    const newReport: Report = {
      ...reportData,
      id: newId,
      created_at: now,
      updated_at: now,
      timeline: [initialTimeline]
    };

    reports.unshift(newReport);
    return JSON.parse(JSON.stringify(newReport));
  }

  async update(id: string, updates: Partial<Report>): Promise<Report | null> {
    const index = reports.findIndex((r) => r.id === id);
    if (index === -1) return null;

    const current = reports[index];
    const now = new Date().toISOString();

    const updated: Report = {
      ...current,
      ...updates,
      updated_at: now
    };

    reports[index] = updated;
    return JSON.parse(JSON.stringify(updated));
  }

  async addTimelineEvent(
    reportId: string,
    eventData: Omit<TimelineEvent, 'id' | 'report_id' | 'timestamp'>
  ): Promise<TimelineEvent> {
    const report = reports.find((r) => r.id === reportId);
    if (!report) {
      throw new Error(`Report ${reportId} not found`);
    }

    const now = new Date().toISOString();
    const event: TimelineEvent = {
      id: `tl-${uuidv4().substring(0, 8)}`,
      report_id: reportId,
      timestamp: now,
      ...eventData
    };

    report.timeline.push(event);
    report.updated_at = now;
    return event;
  }

  async delete(id: string): Promise<boolean> {
    const idx = reports.findIndex((r) => r.id === id);
    if (idx === -1) return false;
    reports.splice(idx, 1);
    return true;
  }
}

export class MockCollectionRepository implements ICollectionRepository {
  async findAllTeams(): Promise<CollectionTeam[]> {
    return JSON.parse(JSON.stringify(teams));
  }

  async findTeamById(id: string): Promise<CollectionTeam | null> {
    const team = teams.find((t) => t.id === id);
    return team ? JSON.parse(JSON.stringify(team)) : null;
  }

  async findAllAssignments(teamId?: string): Promise<CollectionAssignment[]> {
    let list = [...assignments];
    if (teamId) {
      list = list.filter((a) => a.collection_team_id === teamId);
    }
    // Attach report data if available
    const hydrated = list.map((a) => {
      const rep = reports.find((r) => r.id === a.report_id);
      return {
        ...a,
        report: rep ? JSON.parse(JSON.stringify(rep)) : undefined
      };
    });
    return JSON.parse(JSON.stringify(hydrated));
  }

  async findAssignmentById(id: string): Promise<CollectionAssignment | null> {
    const item = assignments.find((a) => a.id === id);
    if (!item) return null;
    const rep = reports.find((r) => r.id === item.report_id);
    return {
      ...item,
      report: rep ? JSON.parse(JSON.stringify(rep)) : undefined
    };
  }

  async findAssignmentByReportId(reportId: string): Promise<CollectionAssignment | null> {
    const item = assignments.find((a) => a.report_id === reportId);
    if (!item) return null;
    const rep = reports.find((r) => r.id === item.report_id);
    return {
      ...item,
      report: rep ? JSON.parse(JSON.stringify(rep)) : undefined
    };
  }

  async createAssignment(
    assignmentData: Omit<CollectionAssignment, 'id' | 'assigned_at'>
  ): Promise<CollectionAssignment> {
    const count = assignments.length + 45;
    const newId = `ASG-MYS-${String(count).padStart(4, '0')}`;
    const now = new Date().toISOString();

    const newAssignment: CollectionAssignment = {
      ...assignmentData,
      id: newId,
      assigned_at: now
    };

    assignments.unshift(newAssignment);

    // Update team active assignments count
    const team = teams.find((t) => t.id === assignmentData.collection_team_id);
    if (team) {
      team.current_active_assignments += 1;
    }

    return JSON.parse(JSON.stringify(newAssignment));
  }

  async updateAssignment(id: string, updates: Partial<CollectionAssignment>): Promise<CollectionAssignment | null> {
    const index = assignments.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const current = assignments[index];
    const updated = {
      ...current,
      ...updates
    };

    assignments[index] = updated;
    return JSON.parse(JSON.stringify(updated));
  }

  async submitProof(
    assignmentId: string,
    proofData: Omit<CollectionProof, 'id' | 'assignment_id' | 'recorded_at'>
  ): Promise<CollectionProof> {
    const assignment = assignments.find((a) => a.id === assignmentId);
    if (!assignment) {
      throw new Error(`Assignment ${assignmentId} not found`);
    }

    const proof: CollectionProof = {
      id: `prf-${uuidv4().substring(0, 8)}`,
      assignment_id: assignmentId,
      recorded_at: new Date().toISOString(),
      ...proofData
    };

    assignment.proof = proof;
    assignment.status = 'COLLECTED';
    assignment.completed_at = new Date().toISOString();

    // Decrement team active load
    const team = teams.find((t) => t.id === assignment.collection_team_id);
    if (team && team.current_active_assignments > 0) {
      team.current_active_assignments -= 1;
    }

    return proof;
  }

  async findAllZones(): Promise<JurisdictionZone[]> {
    return JSON.parse(JSON.stringify(zones));
  }

  async findZoneById(id: string): Promise<JurisdictionZone | null> {
    const zone = zones.find((z) => z.id === id);
    return zone ? JSON.parse(JSON.stringify(zone)) : null;
  }
}

export class MockProcessingRepository implements IProcessingRepository {
  async findAllBatches(): Promise<ProcessingBatch[]> {
    return JSON.parse(JSON.stringify(batches));
  }

  async findBatchById(id: string): Promise<ProcessingBatch | null> {
    const batch = batches.find((b) => b.id === id);
    return batch ? JSON.parse(JSON.stringify(batch)) : null;
  }

  async createBatch(
    batchData: Omit<ProcessingBatch, 'id' | 'created_at' | 'updated_at' | 'recovery_rate_percentage'>
  ): Promise<ProcessingBatch> {
    const count = batches.length + 8;
    const newId = `RB-BATCH-${String(count).padStart(4, '0')}`;
    const now = new Date().toISOString();
    const rate = batchData.intake_quantity_kg > 0
      ? Number(((batchData.recovered_quantity_kg / batchData.intake_quantity_kg) * 100).toFixed(1))
      : 0;

    const newBatch: ProcessingBatch = {
      ...batchData,
      id: newId,
      recovery_rate_percentage: rate,
      created_at: now,
      updated_at: now
    };

    batches.unshift(newBatch);
    return JSON.parse(JSON.stringify(newBatch));
  }

  async updateBatch(id: string, updates: Partial<ProcessingBatch>): Promise<ProcessingBatch | null> {
    const index = batches.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const current = batches[index];
    const now = new Date().toISOString();
    const updated: ProcessingBatch = {
      ...current,
      ...updates,
      updated_at: now
    };

    if (updated.intake_quantity_kg > 0) {
      updated.recovery_rate_percentage = Number(
        ((updated.recovered_quantity_kg / updated.intake_quantity_kg) * 100).toFixed(1)
      );
    }

    batches[index] = updated;
    return JSON.parse(JSON.stringify(updated));
  }

  async findAllProducts(): Promise<RecycledProduct[]> {
    return JSON.parse(JSON.stringify(products));
  }

  async createProduct(productData: Omit<RecycledProduct, 'id' | 'manufactured_at'>): Promise<RecycledProduct> {
    const newId = `prod-${uuidv4().substring(0, 8)}`;
    const newProduct: RecycledProduct = {
      ...productData,
      id: newId,
      manufactured_at: new Date().toISOString()
    };
    products.unshift(newProduct);
    return JSON.parse(JSON.stringify(newProduct));
  }
}

export class MockAnalyticsRepository implements IAnalyticsRepository {
  async getOverviewMetrics(): Promise<Record<string, any>> {
    const totalReports = reports.length;
    const pendingVerification = reports.filter((r) => r.status === 'SUBMITTED' || r.status === 'VERIFICATION_PENDING').length;
    const highPriority = reports.filter((r) => r.priority === 'HIGH' || r.priority === 'CRITICAL').length;
    const collectedReports = reports.filter((r) =>
      ['COLLECTED', 'SORTING', 'PROCESSING', 'RECYCLED'].includes(r.status)
    ).length;
    const recycledReports = reports.filter((r) => r.status === 'RECYCLED').length;
    const activeCollections = assignments.filter((a) => ['PENDING', 'ACCEPTED', 'IN_TRANSIT'].includes(a.status)).length;

    let totalCollectedKg = 0;
    reports.forEach((r) => {
      if (['COLLECTED', 'SORTING', 'PROCESSING', 'RECYCLED'].includes(r.status)) {
        const kg = r.quantity_unit === 'tons' ? r.estimated_quantity * 1000 : r.estimated_quantity;
        totalCollectedKg += kg;
      }
    });

    let totalRecycledKg = 0;
    batches.forEach((b) => {
      totalRecycledKg += b.recovered_quantity_kg;
    });

    return {
      totalReports,
      pendingVerification,
      highPriority,
      collectedReports,
      recycledReports,
      activeCollections,
      totalCollectedTons: Number((totalCollectedKg / 1000).toFixed(1)),
      totalRecycledTons: Number((totalRecycledKg / 1000).toFixed(1))
    };
  }

  async getWasteDistribution(): Promise<Record<string, number>> {
    const map: Record<string, number> = {
      CONCRETE: 0,
      BRICKS: 0,
      TILES: 0,
      SOIL: 0,
      MIXED: 0,
      OTHER: 0
    };

    reports.forEach((r) => {
      const kg = r.quantity_unit === 'tons' ? r.estimated_quantity * 1000 : r.estimated_quantity;
      if (map[r.waste_type] !== undefined) {
        map[r.waste_type] += kg;
      } else {
        map.OTHER += kg;
      }
    });

    return map;
  }

  async getStatusDistribution(): Promise<Record<string, number>> {
    const map: Record<string, number> = {};
    reports.forEach((r) => {
      map[r.status] = (map[r.status] || 0) + 1;
    });
    return map;
  }

  async getHotspots(): Promise<any[]> {
    return zones.map((z) => {
      const zoneReports = reports.filter((r) => r.zone_id === z.id);
      let totalWasteKg = 0;
      zoneReports.forEach((r) => {
        const kg = r.quantity_unit === 'tons' ? r.estimated_quantity * 1000 : r.estimated_quantity;
        totalWasteKg += kg;
      });

      return {
        zone_id: z.id,
        zone_name: z.zone_name,
        zone_code: z.zone_code,
        center_lat: z.center_lat,
        center_lng: z.center_lng,
        report_count: zoneReports.length,
        total_waste_tons: Number((totalWasteKg / 1000).toFixed(1)),
        avg_resolution_hours: 18.5,
        status: zoneReports.length > 3 ? 'HIGH_DENSITY' : 'NORMAL'
      };
    });
  }

  async getImpactMetrics(): Promise<ImpactMetrics> {
    let totalDivertedKg = 0;
    batches.forEach((b) => {
      totalDivertedKg += b.recovered_quantity_kg;
    });

    // Environmental formulas based on CPWD / CPCB C&D Waste Reuse Guidelines
    // 1 ton of C&D waste diverted saves approx 0.65 m3 of landfill volume
    // 1 ton of recycled aggregate offsets approx 240 kg of CO2 equivalent
    const tons = totalDivertedKg / 1000;
    const landfillM3 = Number((tons * 0.65).toFixed(1));
    const co2OffsetKg = Math.round(tons * 240);

    let totalPavers = 0;
    let totalBlocks = 0;
    products.forEach((p) => {
      if (p.product_name === 'Recycled Paver') totalPavers += p.units_produced;
      if (p.product_name === 'Recycled Construction Block') totalBlocks += p.units_produced;
    });

    return {
      total_waste_diverted_kg: totalDivertedKg,
      total_waste_diverted_tons: Number(tons.toFixed(1)),
      total_landfill_saved_cubic_meters: landfillM3,
      total_co2_offset_kg: co2OffsetKg,
      total_recycled_pavers_produced: totalPavers,
      total_recycled_blocks_produced: totalBlocks,
      active_reports_count: reports.filter((r) => !['RECYCLED', 'REJECTED', 'DUPLICATE', 'CANCELLED'].includes(r.status)).length,
      completed_reports_count: reports.filter((r) => r.status === 'RECYCLED').length,
      citizen_participation_count: 86,
      avg_resolution_time_hours: 22.4,
      last_updated: new Date().toISOString()
    };
  }

  async getMonthlyTrends(): Promise<any[]> {
    return [
      { month: 'Apr', reportedTons: 18.2, recycledTons: 14.5, paversProduced: 650 },
      { month: 'May', reportedTons: 24.6, recycledTons: 19.8, paversProduced: 890 },
      { month: 'Jun', reportedTons: 31.0, recycledTons: 25.1, paversProduced: 1120 },
      { month: 'Jul', reportedTons: 28.4, recycledTons: 22.9, paversProduced: 980 },
      { month: 'Aug', reportedTons: 36.8, recycledTons: 31.2, paversProduced: 1390 },
      { month: 'Sep', reportedTons: 42.5, recycledTons: 37.6, paversProduced: 1680 }
    ];
  }
}

export class MockNotificationRepository implements INotificationRepository {
  async findByUserId(userId: string): Promise<NotificationItem[]> {
    return notifications
      .filter((n) => n.user_id === userId || n.user_id === 'all')
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async create(notificationData: Omit<NotificationItem, 'id' | 'created_at'>): Promise<NotificationItem> {
    const item: NotificationItem = {
      ...notificationData,
      id: `notif-${uuidv4().substring(0, 8)}`,
      created_at: new Date().toISOString()
    };
    notifications.unshift(item);
    return item;
  }

  async markAsRead(id: string): Promise<boolean> {
    const item = notifications.find((n) => n.id === id);
    if (!item) return false;
    item.read = true;
    return true;
  }

  async markAllAsRead(userId: string): Promise<boolean> {
    notifications
      .filter((n) => n.user_id === userId || n.user_id === 'all')
      .forEach((n) => (n.read = true));
    return true;
  }
}
