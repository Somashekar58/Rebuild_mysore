import { supabase } from '../../lib/supabase.js';
import { ICollectionRepository } from '../interfaces/index.js';
import {
  CollectionTeam,
  CollectionAssignment,
  CollectionProof,
  JurisdictionZone
} from '../../types/index.js';

export class SupabaseCollectionRepository
  implements ICollectionRepository
{
  async findAllTeams(): Promise<CollectionTeam[]> {
    const { data, error } = await supabase
      .from('collection_teams')
      .select('*')
      .order('id');

    if (error) {
      throw new Error(
        `Failed to find collection teams: ${error.message}`
      );
    }

    return (data ?? []) as CollectionTeam[];
  }

  async findTeamById(
    id: string
  ): Promise<CollectionTeam | null> {
    const { data, error } = await supabase
      .from('collection_teams')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to find collection team: ${error.message}`
      );
    }

    return data as CollectionTeam | null;
  }

  async findAllAssignments(
    teamId?: string
  ): Promise<CollectionAssignment[]> {
    let query = supabase
      .from('collection_assignments')
      .select(`
        *,
        proof:collection_proofs(*)
      `);

    if (teamId) {
      query = query.eq('collection_team_id', teamId);
    }

    const { data, error } = await query.order(
      'assigned_at',
      { ascending: false }
    );

    if (error) {
      throw new Error(
        `Failed to find collection assignments: ${error.message}`
      );
    }

    return (data ?? []).map((row) =>
      this.mapAssignment(row)
    );
  }

  async findAssignmentById(
    id: string
  ): Promise<CollectionAssignment | null> {
    const { data, error } = await supabase
      .from('collection_assignments')
      .select(`
        *,
        proof:collection_proofs(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to find collection assignment: ${error.message}`
      );
    }

    if (!data) {
      return null;
    }

    return this.mapAssignment(data);
  }

  async findAssignmentByReportId(
    reportId: string
  ): Promise<CollectionAssignment | null> {
    const { data, error } = await supabase
      .from('collection_assignments')
      .select(`
        *,
        proof:collection_proofs(*)
      `)
      .eq('report_id', reportId)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to find assignment by report: ${error.message}`
      );
    }

    if (!data) {
      return null;
    }

    return this.mapAssignment(data);
  }

  async createAssignment(
    assignment: Omit<
      CollectionAssignment,
      'id' | 'assigned_at'
    >
  ): Promise<CollectionAssignment> {
    const {
      report,
      proof,
      ...assignmentData
    } = assignment;

    const id = `ASG-MYS-${Date.now()}`;

    const { data, error } = await supabase
      .from('collection_assignments')
      .insert({
        ...assignmentData,
        id
      })
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to create collection assignment: ${error.message}`
      );
    }

    return {
      ...(data as CollectionAssignment),
      report: report ?? undefined,
      proof: proof ?? undefined
    };
  }

  async updateAssignment(
    id: string,
    updates: Partial<CollectionAssignment>
  ): Promise<CollectionAssignment | null> {
    const {
      report,
      proof,
      ...assignmentUpdates
    } = updates;

    const { data, error } = await supabase
      .from('collection_assignments')
      .update(assignmentUpdates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to update collection assignment: ${error.message}`
      );
    }

    if (!data) {
      return null;
    }

    return this.findAssignmentById(id);
  }

  async submitProof(
    assignmentId: string,
    proof: Omit<
      CollectionProof,
      'id' | 'assignment_id' | 'recorded_at'
    >
  ): Promise<CollectionProof> {
    const proofData = {
      id: crypto.randomUUID(),
      assignment_id: assignmentId,
      ...proof,
      recorded_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('collection_proofs')
      .insert(proofData)
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to submit collection proof: ${error.message}`
      );
    }

    return data as CollectionProof;
  }

  async findAllZones(): Promise<JurisdictionZone[]> {
    const { data, error } = await supabase
      .from('jurisdiction_zones')
      .select('*')
      .order('id');

    if (error) {
      throw new Error(
        `Failed to find jurisdiction zones: ${error.message}`
      );
    }

    return (data ?? []) as JurisdictionZone[];
  }

  async findZoneById(
    id: string
  ): Promise<JurisdictionZone | null> {
    const { data, error } = await supabase
      .from('jurisdiction_zones')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to find jurisdiction zone: ${error.message}`
      );
    }

    return data as JurisdictionZone | null;
  }

  private mapAssignment(row: any): CollectionAssignment {
    const proof = Array.isArray(row.proof)
      ? row.proof[0]
      : row.proof;

    return {
      ...row,
      proof: proof
        ? (proof as CollectionProof)
        : undefined
    };
  }
}