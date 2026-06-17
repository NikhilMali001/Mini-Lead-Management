import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { get, del } from '../api/api.js';

const LeadListPage = () => {
  const [leads, setLeads] = useState([]);
  const [paging, setPaging] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [filters, setFilters] = useState({ search: '', status: '', source: '' });
  const [error, setError] = useState('');

  const fetchLeads = async (nextPage = 1) => {
    try {
      const query = new URLSearchParams({
        ...filters,
        page: nextPage,
        limit: paging.limit,
      }).toString();
      const data = await get(`/leads?${query}`);
      setLeads(data.leads);
      setPaging({ page: data.page, limit: data.limit, totalPages: data.totalPages });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchLeads(1);
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await del(`/leads/${id}`);
      fetchLeads(paging.page);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Lead Listing</h2>
        <Link className="btn btn-primary" to="/leads/new">
          Create Lead
        </Link>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-2 mb-3">
        <div className="col-md-4">
          <input
            className="form-control"
            placeholder="Search name, email, phone, status or source"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Filter by status"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          />
        </div>
        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Filter by source"
            value={filters.source}
            onChange={(e) => setFilters({ ...filters, source: e.target.value })}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary w-100" onClick={() => fetchLeads(1)}>
            Apply
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Source</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No leads found. If you are an agent, only leads assigned to you will appear here.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id}>
                  <td>{lead.name}</td>
                  <td>{lead.email}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.status}</td>
                  <td>{lead.source}</td>
                  <td>{lead.assigned_to_name ?? (lead.assigned_to ? `User #${lead.assigned_to}` : 'Unassigned')}</td>
                  <td>
                    <Link className="btn btn-sm btn-outline-primary me-2" to={`/leads/${lead.id}`}>
                      View
                    </Link>
                    <Link className="btn btn-sm btn-outline-secondary me-2" to={`/leads/${lead.id}/edit`}>
                      Edit
                    </Link>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(lead.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-outline-secondary" onClick={() => fetchLeads(Math.max(1, paging.page - 1))} disabled={paging.page <= 1}>
          Previous
        </button>
        <span>
          Page {paging.page} of {paging.totalPages}
        </span>
        <button className="btn btn-outline-secondary" onClick={() => fetchLeads(Math.min(paging.totalPages, paging.page + 1))} disabled={paging.page >= paging.totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default LeadListPage;
