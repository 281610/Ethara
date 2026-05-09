import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Briefcase } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass-nav p-4">
      <div className="container flex justify-between items-center">
        <Link to="/" className="nav-logo flex items-center gap-2">
          <LayoutDashboard size={24} />
          TaskFlow
        </Link>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              Welcome, {user.name} ({user.role})
            </span>
            <button onClick={handleLogout} className="btn btn-outline flex items-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <Link to="/login" className="btn btn-outline">Login</Link>
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
}
