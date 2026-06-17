import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const NavBar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const handleSwitchAccount = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Lead Management
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {user && (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/dashboard">
                    Dashboard
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/leads">
                    Leads
                  </NavLink>
                </li>
                {(user.role === 'admin' || user.role === 'manager') && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/leads/new">
                      Create Lead
                    </NavLink>
                  </li>
                )}
                {user.role === 'admin' && (
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/activities">
                      Activity Logs
                    </NavLink>
                  </li>
                )}
              </>
            )}
          </ul>
          <div className="d-flex align-items-center position-relative" ref={menuRef}>
            {user ? (
              <>
                <span className="text-white me-3 d-none d-lg-inline">{user.name} ({user.role})</span>
                <button
                  className="btn btn-outline-light btn-sm"
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  aria-haspopup="true"
                  aria-expanded={menuOpen}
                >
                  ⋮
                </button>
                {menuOpen && (
                  <div className="dropdown-menu dropdown-menu-end show mt-2" style={{ position: 'absolute', right: 0 }}>
                    <button className="dropdown-item" type="button" onClick={handleLogout}>
                      Logout
                    </button>
                    <button className="dropdown-item" type="button" onClick={handleSwitchAccount}>
                      Switch Account
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm me-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-light btn-sm" to="/register">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
