import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import NavBar from './components/NavBar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import LeadListPage from './pages/LeadListPage.jsx';
import LeadFormPage from './pages/LeadFormPage.jsx';
import LeadDetailsPage from './pages/LeadDetailsPage.jsx';
import ActivityLogsPage from './pages/ActivityLogsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

function App() {
  return (
    <AuthProvider>
      <NavBar />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/leads" element={<LeadListPage />} />
            <Route path="/leads/new" element={<LeadFormPage />} />
            <Route path="/activities" element={<ActivityLogsPage />} />
            <Route path="/leads/:id" element={<LeadDetailsPage />} />
            <Route path="/leads/:id/edit" element={<LeadFormPage />} />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
