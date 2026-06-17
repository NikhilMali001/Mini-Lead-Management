import {
  createLead as createLeadModel,
  deleteLead as deleteLeadModel,
  getLeadById as getLeadByIdModel,
  listLeads as listLeadsModel,
  updateLead as updateLeadModel,
} from '../models/lead.model.js';
import { findAgentById } from '../models/user.model.js';
import { createActivity } from '../models/activity.model.js';
import { fetchCompanyEnrichment } from './external.service.js';

const ROLE_ADMIN = 'admin';
const ROLE_MANAGER = 'manager';
const ROLE_AGENT = 'agent';

export const listLeads = async (user, query) => {
  return listLeadsModel(user, query);
};

export const getLeadById = async (user, leadId) => {
  const lead = await getLeadByIdModel(leadId);
  if (!lead) {
    const error = new Error('Lead not found');
    error.status = 404;
    throw error;
  }

  if (user.role === ROLE_AGENT && Number(lead.assigned_to) !== Number(user.id)) {
    const error = new Error('Forbidden: not assigned to this lead');
    error.status = 403;
    throw error;
  }

  return lead;
};

export const createLead = async (user, data) => {
  if (![ROLE_ADMIN, ROLE_MANAGER].includes(user.role)) {
    const error = new Error('Forbidden: only managers or admins can create leads');
    error.status = 403;
    throw error;
  }

  const enrichment = await fetchCompanyEnrichment();
  const notesWithEnrichment = `${data.notes || ''}\nCompany: ${enrichment.companyName}\nIndustry: ${enrichment.industry}\nCity: ${enrichment.city}`.trim();

  let assignedTo = data.assigned_to;
  if (assignedTo !== undefined && assignedTo !== null) {
    const agent = await findAgentById(assignedTo);
    if (!agent || agent.role !== ROLE_AGENT) {
      const error = new Error('Invalid agent assignment');
      error.status = 400;
      throw error;
    }
  }

  const lead = await createLeadModel({ ...data, notes: notesWithEnrichment, assigned_to: assignedTo });
  await createActivity({
    leadId: lead.id,
    action: 'Lead Created',
    performedBy: user.id,
    notes: `Lead created and assigned to user ${lead.assigned_to}`,
  });
  return lead;
};

export const updateLead = async (user, leadId, data) => {
  const lead = await getLeadByIdModel(leadId);
  if (!lead) {
    const error = new Error('Lead not found');
    error.status = 404;
    throw error;
  }

  if (user.role === ROLE_AGENT && Number(lead.assigned_to) !== Number(user.id)) {
    const error = new Error('Forbidden: agents can only update their assigned leads');
    error.status = 403;
    throw error;
  }

  if (data.assigned_to !== undefined && data.assigned_to !== null) {
    if (user.role === ROLE_AGENT) {
      const error = new Error('Forbidden: agents cannot reassign leads');
      error.status = 403;
      throw error;
    }
    const agent = await findAgentById(data.assigned_to);
    if (!agent || agent.role !== ROLE_AGENT) {
      const error = new Error('Invalid agent assignment');
      error.status = 400;
      throw error;
    }
  }

  const updatedLead = await updateLeadModel(leadId, data);
  await createActivity({
    leadId,
    action: 'Lead Updated',
    performedBy: user.id,
    notes: `Lead updated by ${user.role}`,
  });
  return updatedLead;
};

export const deleteLead = async (user, leadId) => {
  const lead = await getLeadByIdModel(leadId);
  if (!lead) {
    const error = new Error('Lead not found');
    error.status = 404;
    throw error;
  }

  await createActivity({
    leadId,
    action: 'Lead Deleted',
    performedBy: user.id,
    notes: `Deleted by ${user.role}`,
  });
  await deleteLeadModel(leadId);
};
