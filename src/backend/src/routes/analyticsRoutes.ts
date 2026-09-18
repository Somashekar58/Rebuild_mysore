import { Router } from 'express';
import {
  getOverview,
  getWasteDistribution,
  getImpact,
  getHotspots,
  getTrends
} from '../controllers/analyticsController.js';

const router = Router();

router.get('/overview', getOverview);
router.get('/waste', getWasteDistribution);
router.get('/impact', getImpact);
router.get('/hotspots', getHotspots);
router.get('/trends', getTrends);

export default router;
