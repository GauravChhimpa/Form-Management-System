import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import StatsOverview from '../components/dashboard/StatsOverview';
import FormsManager from '../components/dashboard/FormsManager';
import DepartmentsManager from '../components/dashboard/DepartmentsManager';
import AdminPanel from '../components/dashboard/AdminPanel';

export default function Dashboard() {
  const { professor } = useAuth();

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar professor={professor} />
      <div className="flex-1 p-6 overflow-y-auto">
        <Routes>
          <Route index element={<StatsOverview />} />
          <Route path="forms" element={<FormsManager />} />
          <Route path="departments" element={<DepartmentsManager />} />
          {professor?.role === 'admin' && (
            <Route path="admin" element={<AdminPanel />} />
          )}
        </Routes>
      </div>
    </div>
  );
}