import { listAgents as listAgentsService } from '../services/user.service.js';

export const listAgents = async (req, res, next) => {
  try {
    const agents = await listAgentsService();
    res.json({ agents });
  } catch (error) {
    next(error);
  }
};
