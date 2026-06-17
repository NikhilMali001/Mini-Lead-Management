import { useEffect, useState } from 'react';
import { get } from '../api/api.js';

const ActivityLogsPage = () => {
  const [activities, setActivities] = useState([]);
  const [paging, setPaging] = useState({ page: 1, limit: 10, totalPages: 1 });
  const [error, setError] = useState('');

  const fetchActivities = async (page = 1) => {
    try {
      setError('');
      const query = new URLSearchParams({ page, limit: paging.limit }).toString();
      const data = await get(`/activities?${query}`);
      setActivities(data.activities);
      setPaging({ page: data.page, limit: data.limit, totalPages: data.totalPages });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchActivities(1);
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Activity Logs</h2>
          <p className="text-muted">Admin-only view of recent system activity.</p>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Lead</th>
              <th>Action</th>
              <th>Performed By</th>
              <th>Notes</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((activity) => (
              <tr key={activity.id}>
                <td>{activity.id}</td>
                <td>{activity.lead_id}</td>
                <td>{activity.action}</td>
                <td>{activity.performed_by}</td>
                <td>{activity.notes}</td>
                <td>{new Date(activity.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-outline-secondary" onClick={() => fetchActivities(Math.max(1, paging.page - 1))} disabled={paging.page <= 1}>
          Previous
        </button>
        <span>
          Page {paging.page} of {paging.totalPages}
        </span>
        <button className="btn btn-outline-secondary" onClick={() => fetchActivities(Math.min(paging.totalPages, paging.page + 1))} disabled={paging.page >= paging.totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ActivityLogsPage;
