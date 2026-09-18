import { v4 as uuidv4 } from 'uuid';
import { AIAnalysis, WasteType, WasteComposition } from '../../types/index.js';

export class AIAnalysisService {
  /**
   * Prototype AI Waste Analysis Engine
   * Provides compositional breakdown, recyclability potential, and image quality assessment.
   * Can be swapped with multimodal Gemini/Vision API in production.
   */
  public analyzeReport(params: {
    reportId: string;
    wasteType: WasteType;
    description?: string;
    imageCount: number;
  }): AIAnalysis {
    const { reportId, wasteType, description = '', imageCount } = params;
    const lowerDesc = description.toLowerCase();

    let comp: WasteComposition = {
      concrete_percentage: 20,
      bricks_percentage: 20,
      tiles_percentage: 20,
      soil_percentage: 20,
      other_percentage: 20
    };

    let recyclability: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
    let suggestedType: WasteType = wasteType;
    let contamination: 'LOW' | 'MODERATE' | 'HIGH' = 'LOW';
    let confidence = 0.88;

    switch (wasteType) {
      case 'CONCRETE':
        comp = {
          concrete_percentage: 70,
          bricks_percentage: 15,
          tiles_percentage: 5,
          soil_percentage: 5,
          other_percentage: 5
        };
        recyclability = 'HIGH';
        confidence = 0.94;
        break;
      case 'BRICKS':
        comp = {
          concrete_percentage: 12,
          bricks_percentage: 74,
          tiles_percentage: 8,
          soil_percentage: 4,
          other_percentage: 2
        };
        recyclability = 'HIGH';
        confidence = 0.92;
        break;
      case 'TILES':
        comp = {
          concrete_percentage: 8,
          bricks_percentage: 12,
          tiles_percentage: 72,
          soil_percentage: 3,
          other_percentage: 5
        };
        recyclability = 'MEDIUM';
        confidence = 0.89;
        break;
      case 'SOIL':
        comp = {
          concrete_percentage: 5,
          bricks_percentage: 5,
          tiles_percentage: 2,
          soil_percentage: 82,
          other_percentage: 6
        };
        recyclability = 'MEDIUM';
        confidence = 0.91;
        break;
      case 'MIXED':
        comp = {
          concrete_percentage: 42,
          bricks_percentage: 30,
          tiles_percentage: 14,
          soil_percentage: 8,
          other_percentage: 6
        };
        recyclability = 'MEDIUM';
        contamination = 'MODERATE';
        confidence = 0.85;
        break;
      default:
        comp = {
          concrete_percentage: 20,
          bricks_percentage: 20,
          tiles_percentage: 15,
          soil_percentage: 15,
          other_percentage: 30
        };
        recyclability = 'LOW';
        contamination = 'HIGH';
        confidence = 0.78;
        break;
    }

    if (lowerDesc.includes('clean') || lowerDesc.includes('demolition')) {
      confidence = Math.min(0.98, confidence + 0.04);
    }
    if (lowerDesc.includes('garbage') || lowerDesc.includes('plastic')) {
      contamination = 'HIGH';
      recyclability = 'LOW';
    }

    const imageQuality: 'EXCELLENT' | 'GOOD' | 'FAIR' | 'POOR' =
      imageCount >= 2 ? 'EXCELLENT' : imageCount === 1 ? 'GOOD' : 'FAIR';

    return {
      id: `ai-${uuidv4().substring(0, 8)}`,
      report_id: reportId,
      waste_composition: comp,
      recyclability,
      image_quality: imageQuality,
      contamination,
      duplicate_probability: 0.04,
      confidence: Number(confidence.toFixed(2)),
      suggested_waste_type: suggestedType,
      model_version: 'ReBuild-CV-v1.4-Prototype',
      analyzed_at: new Date().toISOString()
    };
  }
}

export const aiAnalysisService = new AIAnalysisService();
