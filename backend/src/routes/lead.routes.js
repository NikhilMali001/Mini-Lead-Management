import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { authorizeRoles } from '../middleware/roles.js';
import {
  createLead,
  deleteLead,
  getLeadById,
  listLeads,
  updateLead,
} from '../controllers/lead.controller.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/', listLeads);
router.get('/:id', getLeadById);
router.post('/', authorizeRoles('admin', 'manager'), createLead);
router.put('/:id', updateLead);
router.delete('/:id', authorizeRoles('admin', 'manager'), deleteLead);

export default router;
