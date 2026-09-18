import { ProcessingBatch, RecycledProduct, WasteType } from '../../types/index.js';
import { processingRepository, reportRepository } from '../../repositories/index.js';

export class ProcessingService {
  /**
   * Creates a processing batch linking back to one or more source reports
   * and updates source reports to 'PROCESSING' status.
   */
  public async createBatchWithReports(params: {
    sourceReportIds: string[];
    intakeQuantityKg: number;
    materialType: WasteType;
    processedByName: string;
    notes?: string;
  }): Promise<ProcessingBatch> {
    const { sourceReportIds, intakeQuantityKg, materialType, processedByName, notes } = params;

    // Calculate initial estimated recovery (e.g. 88-92% for clean streams)
    const estimatedRecovered = Math.round(intakeQuantityKg * 0.9);
    const estimatedRejected = intakeQuantityKg - estimatedRecovered;

    const batch = await processingRepository.createBatch({
      source_report_ids: sourceReportIds,
      intake_quantity_kg: intakeQuantityKg,
      material_type: materialType,
      status: 'SORTING',
      recovered_quantity_kg: estimatedRecovered,
      rejected_quantity_kg: estimatedRejected,
      processed_by_name: processedByName,
      notes: notes || `Batch initiated with ${sourceReportIds.length} source report(s)`
    });

    // Update each source report status to 'SORTING' then 'PROCESSING'
    for (const repId of sourceReportIds) {
      await reportRepository.update(repId, { status: 'PROCESSING' });
      await reportRepository.addTimelineEvent(repId, {
        status: 'PROCESSING',
        actor_id: 'usr-prc-01',
        actor_name: processedByName,
        actor_role: 'PROCESSING_TEAM',
        note: `Material integrated into Batch ${batch.id} for sorting and recovery.`
      });
    }

    return batch;
  }

  /**
   * Finalizes recovery and creates recycled product(s) from the batch
   */
  public async recordRecoveryAndProduct(params: {
    batchId: string;
    recoveredKg: number;
    rejectedKg: number;
    productName: 'Recycled Paver' | 'Recycled Construction Block' | 'Coarse Aggregate' | 'Manufactured Sand';
    unitsProduced: number;
    unitOfMeasure: 'units' | 'sq_meters' | 'tons';
    dimensions?: string;
    prototypeCostInr: number;
    intendedApplication: string;
  }): Promise<{ batch: ProcessingBatch; product: RecycledProduct }> {
    const updatedBatch = await processingRepository.updateBatch(params.batchId, {
      recovered_quantity_kg: params.recoveredKg,
      rejected_quantity_kg: params.rejectedKg,
      status: 'COMPLETED',
      completed_at: new Date().toISOString()
    });

    if (!updatedBatch) {
      throw new Error(`Batch ${params.batchId} not found`);
    }

    // Create recycled product
    const product = await processingRepository.createProduct({
      batch_id: updatedBatch.id,
      product_name: params.productName,
      units_produced: params.unitsProduced,
      unit_of_measure: params.unitOfMeasure,
      recycled_content_percentage: 85,
      dimensions_mm: params.dimensions,
      prototype_unit_cost_inr: params.prototypeCostInr,
      intended_application: params.intendedApplication,
      production_status: 'PILOT'
    });

    // Update all source reports to 'RECYCLED'
    for (const repId of updatedBatch.source_report_ids) {
      await reportRepository.update(repId, { status: 'RECYCLED' });
      await reportRepository.addTimelineEvent(repId, {
        status: 'RECYCLED',
        actor_id: 'usr-prc-01',
        actor_name: updatedBatch.processed_by_name,
        actor_role: 'PROCESSING_TEAM',
        note: `Material recovery complete in Batch ${updatedBatch.id}. Transformed into ${params.unitsProduced} units of ${params.productName}.`
      });
    }

    return { batch: updatedBatch, product };
  }
}

export const processingService = new ProcessingService();
