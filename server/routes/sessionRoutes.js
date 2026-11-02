import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { listSessions, createSession } from '../controllers/sessionController.js';
const router = Router();
router.use(protect);
router.get('/', listSessions);
router.post('/', createSession);
export default router;
