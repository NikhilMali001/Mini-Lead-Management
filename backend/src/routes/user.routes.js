import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import { listAgents } from '../controllers/user.controller.js';

const router = express.Router();

router.use(authenticateToken);
router.get('/agents', authorizeRoles('admin', 'manager'), listAgents);

export default router;
