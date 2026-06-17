import { listActivities as listActivitiesService } from '../services/activity.service.js';

export const listActivities = async (req, res, next) => {
  try {
    const data = await listActivitiesService(req.query);
    res.json(data);
  } catch (error) {
    next(error);
  }
};
