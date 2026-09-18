import { PriorityLevel, Report } from '../../types/index.js';

export interface PriorityCalculationResult {
  priority: PriorityLevel;
  priority_score: number;
  priority_reasons: string[];
}

export class PriorityService {
  /**
   * Transparent Multi-Factor Priority Calculation Engine
   * Scores from 0 to 100 based on quantifiable environmental and logistical factors.
   */
  public calculatePriority(report: Report): PriorityCalculationResult {
    let score = 20; // Base score
    const reasons: string[] = [];

    // Factor 1: Quantity
    const weightKg = report.quantity_unit === 'tons' ? report.estimated_quantity * 1000 : report.estimated_quantity;
    if (weightKg >= 8000) {
      score += 25;
      reasons.push(`Massive bulk deposit (${(weightKg / 1000).toFixed(1)} tons) requiring immediate multi-axle dispatch`);
    } else if (weightKg >= 4000) {
      score += 18;
      reasons.push(`High volume deposit (${(weightKg / 1000).toFixed(1)} tons)`);
    } else if (weightKg >= 1500) {
      score += 10;
      reasons.push(`Medium commercial volume (${(weightKg / 1000).toFixed(1)} tons)`);
    } else {
      score += 4;
      reasons.push(`Small scale residential volume (<1.5 tons)`);
    }

    // Factor 2: Waste Type & Recyclability
    switch (report.waste_type) {
      case 'CONCRETE':
        score += 20;
        reasons.push('High value structural concrete with >85% direct secondary aggregate recyclability');
        break;
      case 'BRICKS':
        score += 18;
        reasons.push('Clean clay brick stream with immediate conversion potential to interlocking pavers');
        break;
      case 'TILES':
        score += 12;
        reasons.push('Ceramic tile debris with public safety sharp hazard; requires controlled crushing');
        break;
      case 'MIXED':
        score += 10;
        reasons.push('Mixed demolition rubble; requires mechanical screening before recovery');
        break;
      case 'SOIL':
        score += 8;
        reasons.push('Excavated earth suitable for subgrade leveling');
        break;
      default:
        score += 5;
        reasons.push('Unsorted/other construction debris');
        break;
    }

    // Factor 3: Report Age (Hours pending)
    const hoursOld = (Date.now() - new Date(report.created_at).getTime()) / (1000 * 60 * 60);
    if (hoursOld > 48) {
      score += 20;
      reasons.push(`Overdue turnaround: pending collection for ${Math.round(hoursOld)} hours`);
    } else if (hoursOld > 24) {
      score += 12;
      reasons.push(`Aging report: pending collection for ${Math.round(hoursOld)} hours`);
    } else if (hoursOld > 6) {
      score += 5;
      reasons.push('Standard queue age (<24h)');
    }

    // Factor 4: Sensitive Zone Proximity in Mysuru
    const desc = (report.address + ' ' + (report.landmark || '') + ' ' + (report.description || '')).toLowerCase();
    if (
      desc.includes('hospital') ||
      desc.includes('school') ||
      desc.includes('palace') ||
      desc.includes('nazarbad') ||
      desc.includes('temple') ||
      desc.includes('drain')
    ) {
      score += 15;
      reasons.push('Location Sensitivity: Located in heritage corridor, school, hospital, or storm-drain buffer zone');
    }

    // Factor 5: Duplicate or Quality penalty
    if (report.verification?.status === 'POSSIBLE_DUPLICATE' || report.status === 'DUPLICATE') {
      score = Math.max(10, score - 40);
      reasons.unshift('Priority suppressed due to potential duplicate flags');
    }

    // Cap score at 100
    score = Math.min(100, Math.max(5, score));

    // Determine level
    let priority: PriorityLevel = 'LOW';
    if (score >= 85) {
      priority = 'CRITICAL';
    } else if (score >= 65) {
      priority = 'HIGH';
    } else if (score >= 45) {
      priority = 'MEDIUM';
    } else {
      priority = 'LOW';
    }

    return {
      priority,
      priority_score: score,
      priority_reasons: reasons
    };
  }
}

export const priorityService = new PriorityService();
