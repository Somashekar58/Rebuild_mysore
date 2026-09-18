import { Router } from 'express';
import {
  getAssignments,
  getAssignmentById,
  updateAssignment,
  submitCollectionProof,
  getTeams,
  getZones
} from '../controllers/collectionController.js';

const router = Router();

router.get('/', getAssignments);
router.get('/teams', getTeams);
router.get('/zones', getZones);
router.get('/:id', getAssignmentById);
router.patch('/:id', updateAssignment);
router.post('/:id/proof', submitCollectionProof);

export default router;
