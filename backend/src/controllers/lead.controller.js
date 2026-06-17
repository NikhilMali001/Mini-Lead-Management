import {
  createLead as createLeadService,
  deleteLead as deleteLeadService,
  getLeadById as getLeadByIdService,
  listLeads as listLeadsService,
  updateLead as updateLeadService,
} from '../services/lead.service.js';

export const listLeads = async (req, res, next) => {
  try {
    const result = await listLeadsService(req.user, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req, res, next) => {
  try {
    const lead = await getLeadByIdService(req.user, Number(req.params.id));
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req, res, next) => {
  try {
    const lead = await createLeadService(req.user, req.body);
    res.status(201).json(lead);
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const lead = await updateLeadService(req.user, Number(req.params.id), req.body);
    res.json(lead);
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    await deleteLeadService(req.user, Number(req.params.id));
    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    next(error);
  }
};
