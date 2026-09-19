import {
  IUserRepository,
  IReportRepository,
  ICollectionRepository,
  IProcessingRepository,
  IAnalyticsRepository,
  INotificationRepository
} from './interfaces/index.js';

import { SupabaseUserRepository } from './supabase/userRepository.js';
import { SupabaseReportRepository } from './supabase/reportRepository.js';
import { SupabaseCollectionRepository } from './supabase/collectionRepository.js';
import { SupabaseProcessingRepository } from './supabase/processingRepository.js';
import { SupabaseAnalyticsRepository } from './supabase/analyticsRepository.js';
import { SupabaseNotificationRepository } from './supabase/notificationRepository.js';

export const userRepository: IUserRepository =
  new SupabaseUserRepository();

export const reportRepository: IReportRepository =
  new SupabaseReportRepository();

export const collectionRepository: ICollectionRepository =
  new SupabaseCollectionRepository();

export const processingRepository: IProcessingRepository =
  new SupabaseProcessingRepository();

export const analyticsRepository: IAnalyticsRepository =
  new SupabaseAnalyticsRepository();

export const notificationRepository: INotificationRepository =
  new SupabaseNotificationRepository();

export * from './interfaces/index.js';