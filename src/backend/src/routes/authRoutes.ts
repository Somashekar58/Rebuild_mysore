import { Router } from 'express';
import { getMe, getAllDemoUsers, switchDemoUser } from '../controllers/authController.js';

const router = Router();

router.get('/me', getMe);
router.get('/users', getAllDemoUsers);
router.post('/switch-demo-user', switchDemoUser);

export default router;
