import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { get } from '../api/api.js';

const LeadDetailsPage = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadLead = async () => {
      try {
        const data = await get(`/leads/${id}`);
        setLead(data);
      } catch (err) {
        setError(err.message);
      }
    };
    loadLead();
  }, [id]);

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!lead) {
    return <div className="text-center py-5">Loading lead details…</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3>{lead.name}</h3>
            <p className="text-muted">Status: {lead.status}</p>
          </div>
          <Link className="btn btn-secondary" to={`/leads/${lead.id}/edit`}>
            Edit
          </Link>
        </div>
        <dl className="row">
          <dt className="col-sm-3">Email</dt>
          <dd className="col-sm-9">{lead.email}</dd>
          <dt className="col-sm-3">Phone</dt>
          <dd className="col-sm-9">{lead.phone}</dd>
          <dt className="col-sm-3">Source</dt>
          <dd className="col-sm-9">{lead.source}</dd>
          <dt className="col-sm-3">Assigned To</dt>
          <dd className="col-sm-9">
            {lead.assigned_to_name ??
              (lead.assigned_to ? `User #${lead.assigned_to}` : 'Unassigned')}
          </dd>
          <dt className="col-sm-3">Notes</dt>
          <dd className="col-sm-9">{lead.notes || 'No notes yet'}</dd>
          <dt className="col-sm-3">Created At</dt>
          <dd className="col-sm-9">{new Date(lead.created_at).toLocaleString()}</dd>
        </dl>
      </div>
    </div>
  );
};

export default LeadDetailsPage;
