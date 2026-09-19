import 'dotenv/config';
import { supabase } from '../../lib/supabase.js';

import {
  MOCK_USERS,
  MOCK_ZONES,
  MOCK_COLLECTION_TEAMS,
  MOCK_REPORTS,
  MOCK_COLLECTION_ASSIGNMENTS,
  MOCK_PROCESSING_BATCHES,
  MOCK_RECYCLED_PRODUCTS,
  MOCK_NOTIFICATIONS
} from '../../repositories/mock/mockData.js';

async function seedUsers() {
  console.log('Seeding users...');

  const { error } = await supabase
    .from('users')
    .upsert(MOCK_USERS);

  if (error) {
    console.error('Failed to seed users:', error);
    process.exit(1);
  }

  console.log(`Seeded ${MOCK_USERS.length} users successfully.`);
}

async function seedZones() {
  console.log('Seeding zones...');

  const { error } = await supabase
    .from('jurisdiction_zones')
    .upsert(MOCK_ZONES);

  if (error) {
    console.error('Failed to seed zones:', error);
    process.exit(1);
  }

  console.log(`Seeded ${MOCK_ZONES.length} zones successfully.`);
}

async function seedCollectionTeams() {
  console.log('Seeding collection teams...');

  const { error } = await supabase
    .from('collection_teams')
    .upsert(MOCK_COLLECTION_TEAMS);

  if (error) {
    console.error('Failed to seed collection teams:', error);
    process.exit(1);
  }

  console.log(
    `Seeded ${MOCK_COLLECTION_TEAMS.length} collection teams successfully.`
  );
}

async function seedReports() {
  console.log('Seeding reports...');

  const reports = MOCK_REPORTS.map((report) => {
    const {
      images,
      ai_analysis,
      verification,
      timeline,
      ...reportData
    } = report;

    return reportData;
  });

  const { error } = await supabase
    .from('reports')
    .upsert(reports);

  if (error) {
    console.error('Failed to seed reports:', error);
    process.exit(1);
  }

  console.log(`Seeded ${reports.length} reports successfully.`);
}

async function seedReportImages() {
  console.log('Seeding report images...');

  const images = MOCK_REPORTS.flatMap((report) =>
    (report.images ?? []).map((image) => ({
      id: image.id,
      report_id: report.id,
      image_url: image.image_url,
      thumbnail_url: image.thumbnail_url,
      file_size_bytes: image.file_size_bytes,
      uploaded_at: image.uploaded_at
    }))
  );

  if (images.length === 0) {
    console.log('No report images found.');
    return;
  }

  const { error } = await supabase
    .from('report_images')
    .upsert(images);

  if (error) {
    console.error('Failed to seed report images:', error);
    process.exit(1);
  }

  console.log(
    `Seeded ${images.length} report images successfully.`
  );
}

async function seedAIAnalysis() {
  console.log('Seeding AI analysis...');

  const analyses = MOCK_REPORTS
    .filter((report) => report.ai_analysis)
    .map((report) => {
      const analysis = report.ai_analysis!;

      return {
        id: analysis.id,
        report_id: report.id,
        concrete_percentage:
          analysis.waste_composition.concrete_percentage,
        bricks_percentage:
          analysis.waste_composition.bricks_percentage,
        tiles_percentage:
          analysis.waste_composition.tiles_percentage,
        soil_percentage:
          analysis.waste_composition.soil_percentage,
        other_percentage:
          analysis.waste_composition.other_percentage,
        recyclability: analysis.recyclability,
        image_quality: analysis.image_quality,
        contamination: analysis.contamination,
        duplicate_probability:
          analysis.duplicate_probability,
        confidence: analysis.confidence,
        suggested_waste_type:
          analysis.suggested_waste_type,
        model_version: analysis.model_version,
        analyzed_at: analysis.analyzed_at
      };
    });

  if (analyses.length === 0) {
    console.log('No AI analysis data found.');
    return;
  }

  const { error } = await supabase
    .from('ai_analysis')
    .upsert(analyses);

  if (error) {
    console.error('Failed to seed AI analysis:', error);
    process.exit(1);
  }

  console.log(
    `Seeded ${analyses.length} AI analysis records successfully.`
  );
}

async function seedVerifications() {
  console.log('Seeding report verifications...');

  const verifications = MOCK_REPORTS
    .filter((report) => report.verification)
    .map((report) => {
      const verification = report.verification!;

      return {
        id: verification.id,
        report_id: report.id,
        status: verification.status,
        verified_by: verification.verified_by,
        verifier_name: verification.verifier_name,
        notes: verification.notes,
        flags: verification.flags ?? [],
        duplicate_of_report_id:
          verification.duplicate_of_report_id,
        verified_at: verification.verified_at
      };
    });

  if (verifications.length === 0) {
    console.log('No verification data found.');
    return;
  }

  const { error } = await supabase
    .from('report_verification')
    .upsert(verifications);

  if (error) {
    console.error(
      'Failed to seed report verifications:',
      error
    );
    process.exit(1);
  }

  console.log(
    `Seeded ${verifications.length} report verifications successfully.`
  );
}

async function seedTimelines() {
  console.log('Seeding report timelines...');

  const timelines = MOCK_REPORTS.flatMap((report) =>
    (report.timeline ?? []).map((event) => ({
      id: event.id,
      report_id: report.id,
      status: event.status,
      actor_id: event.actor_id,
      actor_name: event.actor_name,
      actor_role: event.actor_role,
      note: event.note,
      timestamp: event.timestamp
    }))
  );

  if (timelines.length === 0) {
    console.log('No timeline data found.');
    return;
  }

  const { error } = await supabase
    .from('report_timeline')
    .upsert(timelines);

  if (error) {
    console.error(
      'Failed to seed report timelines:',
      error
    );
    process.exit(1);
  }

  console.log(
    `Seeded ${timelines.length} report timeline events successfully.`
  );
}

async function seedCollectionAssignments() {
  console.log('Seeding collection assignments...');

  const assignments = MOCK_COLLECTION_ASSIGNMENTS.map(
    (assignment) => {
      const {
        report,
        proof,
        ...assignmentData
      } = assignment;

      return assignmentData;
    }
  );

  if (assignments.length === 0) {
    console.log('No collection assignments found.');
    return;
  }

  const { error } = await supabase
    .from('collection_assignments')
    .upsert(assignments);

  if (error) {
    console.error(
      'Failed to seed collection assignments:',
      error
    );
    process.exit(1);
  }

  console.log(
    `Seeded ${assignments.length} collection assignments successfully.`
  );
}

async function seedCollectionProofs() {
  console.log('Seeding collection proofs...');

  const proofs = MOCK_COLLECTION_ASSIGNMENTS
    .filter((assignment) => assignment.proof)
    .map((assignment) => {
      const proof = assignment.proof!;

      return {
        id: proof.id,
        assignment_id: assignment.id,
        photo_url: proof.photo_url,
        verified_weight_kg: proof.verified_weight_kg,
        gps_latitude: proof.gps_latitude,
        gps_longitude: proof.gps_longitude,
        driver_notes: proof.driver_notes,
        recorded_at: proof.recorded_at
      };
    });

  if (proofs.length === 0) {
    console.log('No collection proofs found.');
    return;
  }

  const { error } = await supabase
    .from('collection_proofs')
    .upsert(proofs);

  if (error) {
    console.error(
      'Failed to seed collection proofs:',
      error
    );
    process.exit(1);
  }

  console.log(
    `Seeded ${proofs.length} collection proofs successfully.`
  );
}

async function seedProcessingBatches() {
  console.log('Seeding processing batches...');

  const { error } = await supabase
    .from('processing_batches')
    .upsert(MOCK_PROCESSING_BATCHES);

  if (error) {
    console.error(
      'Failed to seed processing batches:',
      error
    );
    process.exit(1);
  }

  console.log(
    `Seeded ${MOCK_PROCESSING_BATCHES.length} processing batches successfully.`
  );
}

async function seedRecycledProducts() {
  console.log('Seeding recycled products...');

  const { error } = await supabase
    .from('recycled_products')
    .upsert(MOCK_RECYCLED_PRODUCTS);

  if (error) {
    console.error(
      'Failed to seed recycled products:',
      error
    );
    process.exit(1);
  }

  console.log(
    `Seeded ${MOCK_RECYCLED_PRODUCTS.length} recycled products successfully.`
  );
}

async function seedNotifications() {
  console.log('Seeding notifications...');

  const { error } = await supabase
    .from('notifications')
    .upsert(MOCK_NOTIFICATIONS);

  if (error) {
    console.error(
      'Failed to seed notifications:',
      error
    );
    process.exit(1);
  }

  console.log(
    `Seeded ${MOCK_NOTIFICATIONS.length} notifications successfully.`
  );
}

async function main() {
  await seedUsers();
  await seedZones();
  await seedCollectionTeams();
  await seedReports();
  await seedReportImages();
  await seedAIAnalysis();
  await seedVerifications();
  await seedTimelines();
  await seedCollectionAssignments();
  await seedCollectionProofs();
  await seedProcessingBatches();
  await seedRecycledProducts();
  await seedNotifications();
}

main().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});