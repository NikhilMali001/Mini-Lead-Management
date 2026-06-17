import { listAgents as listAgentsModel, findAgentById } from '../models/user.model.js';

export const listAgents = async () => {
  return listAgentsModel();
};

export const getAgentById = async (id) => {
  return findAgentById(id);
};
