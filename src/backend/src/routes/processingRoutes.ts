import { Router } from 'express';
import {
  getBatches,
  getBatchById,
  createBatch,
  updateBatch,
  getProducts,
  createProduct
} from '../controllers/processingController.js';

const router = Router();

router.get('/', getBatches);
router.post('/', createBatch);
router.get('/products', getProducts);
router.post('/products', createProduct);
router.get('/:id', getBatchById);
router.patch('/:id', updateBatch);

export default router;
