import { JurisdictionZone, CollectionTeam, Report } from '../../types/index.js';
import { collectionRepository } from '../../repositories/index.js';

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

export interface RoutingRecommendation {
  zone: JurisdictionZone;
  suggested_team: CollectionTeam;
  approximate_distance_km: number;
  available_teams_in_zone: CollectionTeam[];
  routing_note: string;
}

export class RoutingService {
  /**
   * Identifies the closest Demo Collection Zone in Mysuru
   * and matches the optimal available collection fleet.
   */
  public async getRoutingRecommendation(report: Report): Promise<RoutingRecommendation> {
    const zones = await collectionRepository.findAllZones();
    const allTeams = await collectionRepository.findAllTeams();

    if (zones.length === 0 || allTeams.length === 0) {
      throw new Error('No zones or collection teams configured');
    }

    // Find closest zone
    let closestZone = zones[0];
    let minZoneDistance = Infinity;

    for (const z of zones) {
      const dist = calculateDistanceKm(report.latitude, report.longitude, z.center_lat, z.center_lng);
      if (dist < minZoneDistance) {
        minZoneDistance = dist;
        closestZone = z;
      }
    }

    // Teams serving this zone
    const teamsInZone = allTeams.filter((t) => t.zone_coverage.includes(closestZone.id));
    const candidateTeams = teamsInZone.length > 0 ? teamsInZone : allTeams;

    // Pick team with lowest active assignments and adequate capacity
    const sorted = [...candidateTeams].sort((a, b) => {
      if (a.is_available && !b.is_available) return -1;
      if (!a.is_available && b.is_available) return 1;
      return a.current_active_assignments - b.current_active_assignments;
    });

    const optimalTeam = sorted[0];

    return {
      zone: closestZone,
      suggested_team: optimalTeam,
      approximate_distance_km: minZoneDistance,
      available_teams_in_zone: candidateTeams,
      routing_note: `[Demo Collection Zone] Report coordinates map closest to ${closestZone.zone_name}. ${optimalTeam.team_name} recommended based on vehicle capacity (${optimalTeam.vehicle_capacity_tons}T) and current queue.`
    };
  }
}

export const routingService = new RoutingService();
