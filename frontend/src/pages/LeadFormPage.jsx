import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get, post, put } from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const initialState = {
  name: '',
  email: '',
  phone: '',
  source: '',
  status: 'new',
  notes: '',
  assigned_to: '',
};

const LeadFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(initialState);
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const loadLead = async () => {
      try {
        const data = await get(`/leads/${id}`);
        setForm({
          name: data.name,
          email: data.email,
          phone: data.phone,
          source: data.source,
          status: data.status,
          notes: data.notes,
          assigned_to: data.assigned_to === null ? 'none' : data.assigned_to ?? '',
        });
      } catch (err) {
        setError(err.message);
      }
    };
    loadLead();
  }, [id, isEdit]);

  useEffect(() => {
    if (!user || !['manager', 'admin'].includes(user.role)) return;

    const loadAgents = async () => {
      try {
        const data = await get('/users/agents');
        setAgents(data.agents);
      } catch (err) {
        setError(err.message);
      }
    };

    loadAgents();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (payload.assigned_to === '') {
        delete payload.assigned_to;
      } else if (payload.assigned_to === 'none') {
        payload.assigned_to = null;
      } else if (payload.assigned_to !== undefined) {
        payload.assigned_to = Number(payload.assigned_to);
      }

      if (isEdit) {
        await put(`/leads/${id}`, payload);
      } else {
        await post('/leads', payload);
      }
      navigate('/leads');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="card-title mb-4">{isEdit ? 'Edit Lead' : 'Create Lead'}</h3>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input name="name" className="form-control" value={form.name} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input name="phone" className="form-control" value={form.phone} onChange={handleChange} />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Source</label>
                  <input name="source" className="form-control" value={form.source} onChange={handleChange} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Status</label>
                  <select name="status" className="form-select" value={form.status} onChange={handleChange}>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="lost">Lost</option>
                    <option value="won">Won</option>
                  </select>
                </div>
                {user && ['manager', 'admin'].includes(user.role) && (
                  <div className="col-md-6">
                    <label className="form-label">Assign To Agent</label>
                    <select
                      name="assigned_to"
                      className="form-select"
                      value={form.assigned_to ?? ''}
                      onChange={handleChange}
                    >
                      <option value="">Auto assign</option>
                      <option value="none">Not assign</option>
                      {agents.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name} ({agent.email})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="col-12">
                  <label className="form-label">Notes</label>
                  <textarea name="notes" className="form-control" rows="4" value={form.notes} onChange={handleChange} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
                {loading ? 'Saving…' : 'Save Lead'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadFormPage;
