import {
  UserProfile,
  Report,
  ReportStatus,
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

export interface IUserRepository {
  findById(id: string): Promise<UserProfile | null>;
  findByEmail(email: string): Promise<UserProfile | null>;
  findAll(): Promise<UserProfile[]>;
}

export interface ReportFilterOptions {
  status?: ReportStatus;
  waste_type?: string;
  priority?: string;
  zone_id?: string;
  citizen_id?: string;
  search?: string;
}

export interface IReportRepository {
  findById(id: string): Promise<Report | null>;
  findAll(filters?: ReportFilterOptions): Promise<Report[]>;
  create(report: Omit<Report, 'id' | 'created_at' | 'updated_at' | 'timeline'>): Promise<Report>;
  update(id: string, updates: Partial<Report>): Promise<Report | null>;
  addTimelineEvent(reportId: string, event: Omit<TimelineEvent, 'id' | 'report_id' | 'timestamp'>): Promise<TimelineEvent>;
  delete(id: string): Promise<boolean>;
}

export interface ICollectionRepository {
  findAllTeams(): Promise<CollectionTeam[]>;
  findTeamById(id: string): Promise<CollectionTeam | null>;
  findAllAssignments(teamId?: string): Promise<CollectionAssignment[]>;
  findAssignmentById(id: string): Promise<CollectionAssignment | null>;
  findAssignmentByReportId(reportId: string): Promise<CollectionAssignment | null>;
  createAssignment(assignment: Omit<CollectionAssignment, 'id' | 'assigned_at'>): Promise<CollectionAssignment>;
  updateAssignment(id: string, updates: Partial<CollectionAssignment>): Promise<CollectionAssignment | null>;
  submitProof(assignmentId: string, proof: Omit<CollectionProof, 'id' | 'assignment_id' | 'recorded_at'>): Promise<CollectionProof>;
  findAllZones(): Promise<JurisdictionZone[]>;
  findZoneById(id: string): Promise<JurisdictionZone | null>;
}

export interface IProcessingRepository {
  findAllBatches(): Promise<ProcessingBatch[]>;
  findBatchById(id: string): Promise<ProcessingBatch | null>;
  createBatch(batch: Omit<ProcessingBatch, 'id' | 'created_at' | 'updated_at' | 'recovery_rate_percentage'>): Promise<ProcessingBatch>;
  updateBatch(id: string, updates: Partial<ProcessingBatch>): Promise<ProcessingBatch | null>;
  findAllProducts(): Promise<RecycledProduct[]>;
  createProduct(product: Omit<RecycledProduct, 'id' | 'manufactured_at'>): Promise<RecycledProduct>;
}

export interface IAnalyticsRepository {
  getOverviewMetrics(): Promise<Record<string, any>>;
  getWasteDistribution(): Promise<Record<string, number>>;
  getStatusDistribution(): Promise<Record<string, number>>;
  getHotspots(): Promise<any[]>;
  getImpactMetrics(): Promise<ImpactMetrics>;
  getMonthlyTrends(): Promise<any[]>;
}

export interface INotificationRepository {
  findByUserId(userId: string): Promise<NotificationItem[]>;
  create(notification: Omit<NotificationItem, 'id' | 'created_at'>): Promise<NotificationItem>;
  markAsRead(id: string): Promise<boolean>;
  markAllAsRead(userId: string): Promise<boolean>;
}
