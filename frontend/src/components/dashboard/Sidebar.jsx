import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Sidebar({ professor }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
    }`;

  return (
    <div className="w-64 bg-white border-r min-h-screen flex flex-col p-4 gap-4 sticky top-0">

      {/* Professor Info */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {professor?.name?.charAt(0)}
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-800">{professor?.name}</div>
          <div className="text-xs text-gray-400">{professor?.department?.name}</div>
          <div className="text-xs text-blue-500 font-medium capitalize">{professor?.role}</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1">
        <NavLink to="/dashboard" end className={linkClass}>
          📊 Overview
        </NavLink>
        <NavLink to="/dashboard/forms" className={linkClass}>
          📋 My Forms
        </NavLink>
        <NavLink to="/dashboard/departments" className={linkClass}>
          🏛️ Departments
        </NavLink>
        {professor?.role === 'admin' && (
          <NavLink to="/dashboard/admin" className={linkClass}>
            👑 Admin Panel
          </NavLink>
        )}
      </nav>

      {/* Hint */}
      <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-xs text-green-700">
        Students can browse forms without logging in at the homepage.
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="mt-auto w-full text-sm text-red-500 border border-red-200 hover:bg-red-50 py-2 rounded-lg transition font-medium"
      >
        Logout
      </button>
    </div>
  );
}