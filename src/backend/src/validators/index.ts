import { z } from 'zod';

export const CreateReportSchema = z.object({
  waste_type: z.enum(['CONCRETE', 'BRICKS', 'TILES', 'SOIL', 'MIXED', 'OTHER']),
  estimated_quantity: z.number().positive(),
  quantity_unit: z.enum(['kg', 'tons']).default('kg'),
  description: z.string().optional(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  address: z.string().min(3),
  landmark: z.string().optional(),
  zone_id: z.string().optional(),
  preferred_pickup_date: z.string().optional(),
  preferred_pickup_time_slot: z.string().optional(),
  contact_phone: z.string().optional(),
  pickup_instructions: z.string().optional(),
  images: z.array(
    z.object({
      image_url: z.string().min(5),
      thumbnail_url: z.string().optional(),
      file_size_bytes: z.number().optional()
    })
  ).default([])
});

export const UpdateReportSchema = z.object({
  status: z.enum([
    'SUBMITTED',
    'AI_ANALYZED',
    'VERIFICATION_PENDING',
    'VERIFIED',
    'ASSIGNED',
    'COLLECTED',
    'SORTING',
    'PROCESSING',
    'RECYCLED',
    'REJECTED',
    'DUPLICATE',
    'CANCELLED'
  ]).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).optional(),
  notes: z.string().optional()
});

export const VerifyReportSchema = z.object({
  status: z.enum(['PENDING', 'VERIFIED', 'REJECTED', 'POSSIBLE_DUPLICATE']).default('VERIFIED'),
  notes: z.string().optional(),
  duplicate_of_report_id: z.string().optional()
});

export const AssignReportSchema = z.object({
  collection_team_id: z.string().min(1)
});

export const UpdateCollectionAssignmentSchema = z.object({
  status: z.enum(['PENDING', 'ACCEPTED', 'IN_TRANSIT', 'COLLECTED', 'CANCELLED']),
  notes: z.string().optional()
});

export const SubmitCollectionProofSchema = z.object({
  photo_url: z.string().min(5),
  verified_weight_kg: z.number().positive(),
  gps_latitude: z.number(),
  gps_longitude: z.number(),
  driver_notes: z.string().optional()
});

export const CreateProcessingBatchSchema = z.object({
  source_report_ids: z.array(z.string().min(1)).min(1),
  intake_quantity_kg: z.number().positive(),
  material_type: z.enum(['CONCRETE', 'BRICKS', 'TILES', 'SOIL', 'MIXED', 'OTHER']),
  notes: z.string().optional()
});

export const UpdateProcessingBatchSchema = z.object({
  recovered_quantity_kg: z.number().nonnegative(),
  rejected_quantity_kg: z.number().nonnegative(),
  status: z.enum(['INTAKE', 'SORTING', 'RECOVERY', 'COMPLETED']).optional(),
  notes: z.string().optional()
});

export const CreateRecycledProductSchema = z.object({
  batch_id: z.string().min(1),
  product_name: z.enum(['Recycled Paver', 'Recycled Construction Block', 'Coarse Aggregate', 'Manufactured Sand']),
  units_produced: z.number().positive(),
  unit_of_measure: z.enum(['units', 'sq_meters', 'tons']),
  recycled_content_percentage: z.number().min(0).max(100).default(85),
  dimensions_mm: z.string().optional(),
  prototype_unit_cost_inr: z.number().positive(),
  intended_application: z.string().min(3),
  production_status: z.enum(['PROTOTYPE', 'PILOT', 'COMMERCIAL_READY']).default('PILOT')
});
