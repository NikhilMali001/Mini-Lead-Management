import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import { listActivities } from '../controllers/activity.controller.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/', authorizeRoles('admin'), listActivities);

export default router;
