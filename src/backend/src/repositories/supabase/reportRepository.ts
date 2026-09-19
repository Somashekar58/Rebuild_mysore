import { supabase } from '../../lib/supabase.js';
import {
  IReportRepository,
  ReportFilterOptions
} from '../interfaces/index.js';
import {
  Report,
  ReportStatus,
  TimelineEvent
} from '../../types/index.js';

export class SupabaseReportRepository implements IReportRepository {
  async findById(id: string): Promise<Report | null> {
    const { data, error } = await supabase
      .from('reports')
      .select(`
        *,
        images:report_images(*),
        ai_analysis:ai_analysis(*),
        verification:report_verification!report_verification_report_id_fkey(*),
        timeline:report_timeline(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to find report: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.mapReport(data);
  }

  async findAll(filters?: ReportFilterOptions): Promise<Report[]> {
    let query = supabase
      .from('reports')
      .select(`
        *,
        images:report_images(*),
        ai_analysis:ai_analysis(*),
        verification:report_verification!report_verification_report_id_fkey(*),
        timeline:report_timeline(*)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.waste_type) {
      query = query.eq('waste_type', filters.waste_type);
    }

    if (filters?.priority) {
      query = query.eq('priority', filters.priority);
    }

    if (filters?.zone_id) {
      query = query.eq('zone_id', filters.zone_id);
    }

    if (filters?.citizen_id) {
      query = query.eq('citizen_id', filters.citizen_id);
    }

    if (filters?.search) {
      query = query.or(
        `id.ilike.%${filters.search}%,` +
        `citizen_name.ilike.%${filters.search}%,` +
        `address.ilike.%${filters.search}%,` +
        `description.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query.order(
      'created_at',
      { ascending: false }
    );

    if (error) {
      throw new Error(`Failed to find reports: ${error.message}`);
    }

    return (data ?? []).map((row) => this.mapReport(row));
  }

  async create(
    report: Omit<
      Report,
      'id' | 'created_at' | 'updated_at' | 'timeline'
    >
  ): Promise<Report> {
    const {
      images,
      ai_analysis,
      verification,
      ...reportData
    } = report;

    const id = `RBL-MYS-${Date.now()}`;

    const { data, error } = await supabase
      .from('reports')
      .insert({
        ...reportData,
        id
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create report: ${error.message}`);
    }

    return {
      ...(data as Report),
      images: images ?? [],
      ai_analysis: ai_analysis ?? undefined,
      verification: verification ?? undefined,
      timeline: []
    };
  }

  async update(
    id: string,
    updates: Partial<Report>
  ): Promise<Report | null> {
    const {
      images,
      ai_analysis,
      verification,
      timeline,
      ...reportUpdates
    } = updates;

    const { data, error } = await supabase
      .from('reports')
      .update({
        ...reportUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to update report: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return this.findById(id);
  }

  async addTimelineEvent(
    reportId: string,
    event: Omit<
      TimelineEvent,
      'id' | 'report_id' | 'timestamp'
    >
  ): Promise<TimelineEvent> {
    const timelineEvent = {
      id: crypto.randomUUID(),
      report_id: reportId,
      ...event,
      timestamp: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('report_timeline')
      .insert(timelineEvent)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to add timeline event: ${error.message}`
      );
    }

    return data as TimelineEvent;
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete report: ${error.message}`);
    }

    return true;
  }

  private mapReport(row: any): Report {
    const ai = Array.isArray(row.ai_analysis)
      ? row.ai_analysis[0]
      : row.ai_analysis;

    const verification = Array.isArray(row.verification)
      ? row.verification[0]
      : row.verification;

    return {
      ...row,

      images: row.images ?? [],

      ai_analysis: ai
        ? {
            id: ai.id,
            report_id: ai.report_id,
            waste_composition: {
              concrete_percentage:
                ai.concrete_percentage,
              bricks_percentage:
                ai.bricks_percentage,
              tiles_percentage:
                ai.tiles_percentage,
              soil_percentage:
                ai.soil_percentage,
              other_percentage:
                ai.other_percentage
            },
            recyclability: ai.recyclability,
            image_quality: ai.image_quality,
            contamination: ai.contamination,
            duplicate_probability:
              ai.duplicate_probability,
            confidence: ai.confidence,
            suggested_waste_type:
              ai.suggested_waste_type,
            model_version: ai.model_version,
            analyzed_at: ai.analyzed_at
          }
        : undefined,

      verification: verification
        ? {
            id: verification.id,
            report_id: verification.report_id,
            status: verification.status,
            verified_by: verification.verified_by,
            verifier_name: verification.verifier_name,
            notes: verification.notes,
            flags: verification.flags ?? [],
            duplicate_of_report_id:
              verification.duplicate_of_report_id,
            verified_at: verification.verified_at
          }
        : undefined,

      timeline: row.timeline ?? []
    };
  }
}