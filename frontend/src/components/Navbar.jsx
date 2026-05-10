import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { professor, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            UF
          </div>
          <div>
            <div className="font-bold text-gray-800 leading-tight">UniForm</div>
            <div className="text-xs text-gray-400 leading-tight">University Form Portal</div>
          </div>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-3">
          <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition">
            Browse Forms
          </Link>

          {professor ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition"
              >
                Dashboard
              </Link>

              {/* Professor info */}
              <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {professor.name.charAt(0)}
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-medium text-gray-800">{professor.name}</div>
                  <div className="text-xs text-gray-400">{professor.role}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-2 py-1 rounded transition"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 text-sm font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}