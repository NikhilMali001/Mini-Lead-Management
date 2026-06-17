import { listActivities as listActivitiesModel } from '../models/activity.model.js';

export const listActivities = async (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const offset = (page - 1) * limit;
  return listActivitiesModel({ page, limit, offset, leadId: query.leadId });
};
