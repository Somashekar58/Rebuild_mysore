import {
  IUserRepository,
  IReportRepository,
  ICollectionRepository,
  IProcessingRepository,
  IAnalyticsRepository,
  INotificationRepository
} from './interfaces/index.js';
import {
  MockUserRepository,
  MockReportRepository,
  MockCollectionRepository,
  MockProcessingRepository,
  MockAnalyticsRepository,
  MockNotificationRepository
} from './mock/index.js';

// Central Repository Container
// In the current Hackathon build, Mock implementations provide realistic in-memory state.
// When Developer 2 connects Supabase, this container will instantiate SupabaseUserRepository,
// SupabaseReportRepository, etc., without requiring any changes to Controllers or Services.
export const userRepository: IUserRepository = new MockUserRepository();
export const reportRepository: IReportRepository = new MockReportRepository();
export const collectionRepository: ICollectionRepository = new MockCollectionRepository();
export const processingRepository: IProcessingRepository = new MockProcessingRepository();
export const analyticsRepository: IAnalyticsRepository = new MockAnalyticsRepository();
export const notificationRepository: INotificationRepository = new MockNotificationRepository();

export * from './interfaces/index.js';
