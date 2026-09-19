import { supabase } from '../../lib/supabase.js';
import { IProcessingRepository } from '../interfaces/index.js';
import {
  ProcessingBatch,
  RecycledProduct
} from '../../types/index.js';

export class SupabaseProcessingRepository
  implements IProcessingRepository
{
  async findAllBatches(): Promise<ProcessingBatch[]> {
    const { data, error } = await supabase
      .from('processing_batches')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(
        `Failed to find processing batches: ${error.message}`
      );
    }

    return (data ?? []) as ProcessingBatch[];
  }

  async findBatchById(
    id: string
  ): Promise<ProcessingBatch | null> {
    const { data, error } = await supabase
      .from('processing_batches')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to find processing batch: ${error.message}`
      );
    }

    return data as ProcessingBatch | null;
  }

  async createBatch(
    batch: Omit<
      ProcessingBatch,
      'id' | 'created_at' | 'updated_at' | 'recovery_rate_percentage'
    >
  ): Promise<ProcessingBatch> {
    const id = `RB-BATCH-${Date.now()}`;

    const recoveryRate =
      batch.intake_quantity_kg > 0
        ? (batch.recovered_quantity_kg /
            batch.intake_quantity_kg) *
          100
        : 0;

    const { data, error } = await supabase
      .from('processing_batches')
      .insert({
        ...batch,
        id,
        recovery_rate_percentage: Number(
          recoveryRate.toFixed(1)
        )
      })
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to create processing batch: ${error.message}`
      );
    }

    return data as ProcessingBatch;
  }

  async updateBatch(
    id: string,
    updates: Partial<ProcessingBatch>
  ): Promise<ProcessingBatch | null> {
    const {
      id: ignoredId,
      created_at,
      updated_at,
      recovery_rate_percentage,
      ...batchUpdates
    } = updates;

    const finalUpdates: Record<string, any> = {
      ...batchUpdates,
      updated_at: new Date().toISOString()
    };

    if (
      batchUpdates.intake_quantity_kg !== undefined ||
      batchUpdates.recovered_quantity_kg !== undefined
    ) {
      const currentBatch = await this.findBatchById(id);

      if (!currentBatch) {
        return null;
      }

      const intakeQuantity =
        batchUpdates.intake_quantity_kg ??
        currentBatch.intake_quantity_kg;

      const recoveredQuantity =
        batchUpdates.recovered_quantity_kg ??
        currentBatch.recovered_quantity_kg;

      finalUpdates.recovery_rate_percentage =
        intakeQuantity > 0
          ? Number(
              (
                (recoveredQuantity / intakeQuantity) *
                100
              ).toFixed(1)
            )
          : 0;
    }

    const { data, error } = await supabase
      .from('processing_batches')
      .update(finalUpdates)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      throw new Error(
        `Failed to update processing batch: ${error.message}`
      );
    }

    if (!data) {
      return null;
    }

    return data as ProcessingBatch;
  }

  async findAllProducts(): Promise<RecycledProduct[]> {
    const { data, error } = await supabase
      .from('recycled_products')
      .select('*')
      .order('manufactured_at', { ascending: false });

    if (error) {
      throw new Error(
        `Failed to find recycled products: ${error.message}`
      );
    }

    return (data ?? []) as RecycledProduct[];
  }

  async createProduct(
    product: Omit<
      RecycledProduct,
      'id' | 'manufactured_at'
    >
  ): Promise<RecycledProduct> {
    const id = `prod-${Date.now()}`;

    const { data, error } = await supabase
      .from('recycled_products')
      .insert({
        ...product,
        id
      })
      .select()
      .single();

    if (error) {
      throw new Error(
        `Failed to create recycled product: ${error.message}`
      );
    }

    return data as RecycledProduct;
  }
}