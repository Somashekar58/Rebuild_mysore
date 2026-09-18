import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { analyticsRepository } from '../repositories/index.js';

export async function getOverview(req: AuthenticatedRequest, res: Response) {
  try {
    const overview = await analyticsRepository.getOverviewMetrics();
    return res.json({
      success: true,
      data: overview
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'ANALYTICS_FAILED', message: err.message }
    });
  }
}

export async function getWasteDistribution(req: AuthenticatedRequest, res: Response) {
  try {
    const waste = await analyticsRepository.getWasteDistribution();
    return res.json({
      success: true,
      data: waste
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'ANALYTICS_FAILED', message: err.message }
    });
  }
}

export async function getImpact(req: AuthenticatedRequest, res: Response) {
  try {
    const impact = await analyticsRepository.getImpactMetrics();
    return res.json({
      success: true,
      data: impact
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'ANALYTICS_FAILED', message: err.message }
    });
  }
}

export async function getHotspots(req: AuthenticatedRequest, res: Response) {
  try {
    const hotspots = await analyticsRepository.getHotspots();
    return res.json({
      success: true,
      data: hotspots
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'ANALYTICS_FAILED', message: err.message }
    });
  }
}

export async function getTrends(req: AuthenticatedRequest, res: Response) {
  try {
    const trends = await analyticsRepository.getMonthlyTrends();
    return res.json({
      success: true,
      data: trends
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: { code: 'ANALYTICS_FAILED', message: err.message }
    });
  }
}
