import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { get } from '../api/api.js';

const DashboardPage = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  const fetchSummary = async () => {
    try {
      const data = await get('/leads?limit=1');
      setSummary(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  // Refresh summary when page comes back into focus
  useEffect(() => {
    const handleFocus = () => {
      fetchSummary();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Welcome, {user?.name}</h2>
          <p className="text-muted">Role: {user?.role}</p>
        </div>
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        <div className="col-md-4 mb-3">
          <div className="card border-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Total Leads</h5>
              <p className="display-6">{summary?.total ?? '—'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-success h-100">
            <div className="card-body">
              <h5 className="card-title">Leads Assigned</h5>
              <p className="display-6">{summary?.assignedCount ?? '—'}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card border-info h-100">
            <div className="card-body">
              <h5 className="card-title">Your Role</h5>
              <p className="display-6">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
      {user?.role === 'admin' && (
        <div className="card mt-4 border-warning">
          <div className="card-body">
            <h5 className="card-title">Admin Only</h5>
            <p className="card-text">Access activity logs and advanced monitoring.</p>
            <Link to="/activities" className="btn btn-warning">
              View Activity Logs
            </Link>
          </div>
        </div>
      )}
      <div className="card mt-4">
        <div className="card-body">
          <h5>Notes</h5>
          <p>
            Admins see full access to all leads. Managers can create and manage leads, while agents only see assigned leads.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

