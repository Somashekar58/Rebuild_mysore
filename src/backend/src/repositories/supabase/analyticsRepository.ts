import { supabase } from '../../lib/supabase.js';
import { IAnalyticsRepository } from '../interfaces/index.js';
import { ImpactMetrics } from '../../types/index.js';

export class SupabaseAnalyticsRepository
  implements IAnalyticsRepository
{
  async getOverviewMetrics(): Promise<Record<string, any>> {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('status, priority, waste_type');

    if (error) {
      throw new Error(
        `Failed to get overview metrics: ${error.message}`
      );
    }

    const rows = reports ?? [];

    const totalReports = rows.length;

    const completedReports = rows.filter(
      (report) =>
        report.status === 'RECYCLED'
    ).length;

    const activeReports = rows.filter(
      (report) =>
        ![
          'RECYCLED',
          'REJECTED',
          'DUPLICATE',
          'CANCELLED'
        ].includes(report.status)
    ).length;

    const criticalReports = rows.filter(
      (report) => report.priority === 'CRITICAL'
    ).length;

    const highPriorityReports = rows.filter(
      (report) => report.priority === 'HIGH'
    ).length;

    return {
      total_reports: totalReports,
      active_reports: activeReports,
      completed_reports: completedReports,
      critical_reports: criticalReports,
      high_priority_reports: highPriorityReports
    };
  }

  async getWasteDistribution(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('reports')
      .select('waste_type');

    if (error) {
      throw new Error(
        `Failed to get waste distribution: ${error.message}`
      );
    }

    const distribution: Record<string, number> = {};

    for (const report of data ?? []) {
      const type = report.waste_type;

      distribution[type] =
        (distribution[type] ?? 0) + 1;
    }

    return distribution;
  }

  async getStatusDistribution(): Promise<Record<string, number>> {
    const { data, error } = await supabase
      .from('reports')
      .select('status');

    if (error) {
      throw new Error(
        `Failed to get status distribution: ${error.message}`
      );
    }

    const distribution: Record<string, number> = {};

    for (const report of data ?? []) {
      const status = report.status;

      distribution[status] =
        (distribution[status] ?? 0) + 1;
    }

    return distribution;
  }

  async getHotspots(): Promise<any[]> {
    const { data, error } = await supabase
      .from('reports')
      .select(
        'id, latitude, longitude, address, waste_type, priority, status'
      );

    if (error) {
      throw new Error(
        `Failed to get hotspots: ${error.message}`
      );
    }

    return data ?? [];
  }

  async getImpactMetrics(): Promise<ImpactMetrics> {
    const { data: batches, error: batchError } =
      await supabase
        .from('processing_batches')
        .select(
          'intake_quantity_kg, recovered_quantity_kg'
        );

    if (batchError) {
      throw new Error(
        `Failed to get impact batch data: ${batchError.message}`
      );
    }

    const { data: products, error: productError } =
      await supabase
        .from('recycled_products')
        .select(
          'product_name, units_produced'
        );

    if (productError) {
      throw new Error(
        `Failed to get impact product data: ${productError.message}`
      );
    }

    const { data: reports, error: reportError } =
      await supabase
        .from('reports')
        .select(
          'id, citizen_id, status, created_at, updated_at'
        );

    if (reportError) {
      throw new Error(
        `Failed to get impact report data: ${reportError.message}`
      );
    }

    const totalWasteDivertedKg = (batches ?? []).reduce(
      (sum, batch) =>
        sum + Number(batch.recovered_quantity_kg ?? 0),
      0
    );

    const totalWasteDivertedTons =
      totalWasteDivertedKg / 1000;

    const paversProduced = (products ?? [])
      .filter(
        (product) =>
          product.product_name ===
          'Recycled Paver'
      )
      .reduce(
        (sum, product) =>
          sum + Number(product.units_produced ?? 0),
        0
      );

    const blocksProduced = (products ?? [])
      .filter(
        (product) =>
          product.product_name ===
          'Recycled Construction Block'
      )
      .reduce(
        (sum, product) =>
          sum + Number(product.units_produced ?? 0),
        0
      );

    const activeReportsCount = (reports ?? []).filter(
      (report) =>
        ![
          'RECYCLED',
          'REJECTED',
          'DUPLICATE',
          'CANCELLED'
        ].includes(report.status)
    ).length;

    const completedReports = (reports ?? []).filter(
      (report) => report.status === 'RECYCLED'
    );

    const citizenIds = new Set(
      (reports ?? []).map(
        (report) => report.citizen_id
      )
    );

    let totalResolutionHours = 0;

    for (const report of completedReports) {
      const created = new Date(
        report.created_at
      ).getTime();

      const updated = new Date(
        report.updated_at
      ).getTime();

      totalResolutionHours +=
        (updated - created) /
        (1000 * 60 * 60);
    }

    const avgResolutionTimeHours =
      completedReports.length > 0
        ? totalResolutionHours /
          completedReports.length
        : 0;

    return {
      total_waste_diverted_kg:
        totalWasteDivertedKg,

      total_waste_diverted_tons:
        totalWasteDivertedTons,

      total_landfill_saved_cubic_meters:
        totalWasteDivertedKg / 1000,

      total_co2_offset_kg:
        totalWasteDivertedKg * 0.15,

      total_recycled_pavers_produced:
        paversProduced,

      total_recycled_blocks_produced:
        blocksProduced,

      active_reports_count:
        activeReportsCount,

      completed_reports_count:
        completedReports.length,

      citizen_participation_count:
        citizenIds.size,

      avg_resolution_time_hours:
        Number(
          avgResolutionTimeHours.toFixed(2)
        ),

      last_updated:
        new Date().toISOString()
    };
  }

  async getMonthlyTrends(): Promise<any[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('created_at, status');

    if (error) {
      throw new Error(
        `Failed to get monthly trends: ${error.message}`
      );
    }

    const trends: Record<
      string,
      {
        month: string;
        reports: number;
        completed: number;
      }
    > = {};

    for (const report of data ?? []) {
      const date = new Date(report.created_at);

      const month = `${date.getUTCFullYear()}-${String(
        date.getUTCMonth() + 1
      ).padStart(2, '0')}`;

      if (!trends[month]) {
        trends[month] = {
          month,
          reports: 0,
          completed: 0
        };
      }

      trends[month].reports += 1;

      if (report.status === 'RECYCLED') {
        trends[month].completed += 1;
      }
    }

    return Object.values(trends).sort(
      (a, b) =>
        a.month.localeCompare(b.month)
    );
  }
}