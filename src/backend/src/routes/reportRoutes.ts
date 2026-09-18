import { Router } from 'express';
import {
  getReports,
  createReport,
  getReportById,
  updateReport,
  analyzeReport,
  getReportAnalysis,
  verifyReport,
  calculatePriority,
  getReportRouting,
  assignReport
} from '../controllers/reportController.js';

const router = Router();

router.get('/', getReports);
router.post('/', createReport);
router.get('/:id', getReportById);
router.patch('/:id', updateReport);

router.post('/:id/analyze', analyzeReport);
router.get('/:id/analysis', getReportAnalysis);

router.post('/:id/verify', verifyReport);
router.post('/:id/calculate-priority', calculatePriority);

router.get('/:id/routing', getReportRouting);
router.post('/:id/assign', assignReport);

export default router;
