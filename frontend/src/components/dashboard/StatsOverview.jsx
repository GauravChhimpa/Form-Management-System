import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StatsOverview() {
  const [stats, setStats] = useState(null);
  const [recentForms, setRecentForms] = useState([]);

  useEffect(() => {
    axios.get('/api/forms/stats').then(res => setStats(res.data.stats));
    axios.get('/api/forms/my').then(res => setRecentForms(res.data.forms.slice(0, 5)));
  }, []);

  const statCards = [
    { label: 'Total Forms', value: stats?.totalForms, icon: '📋', color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Forms', value: stats?.activeForms, icon: '✅', color: 'bg-green-50 text-green-600' },
    { label: 'Total Views', value: stats?.totalViews, icon: '👁️', color: 'bg-yellow-50 text-yellow-600' },
    { label: 'Departments', value: stats?.totalDepartments, icon: '🏛️', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <p className="text-gray-500 text-sm mt-1">Your form portal activity at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border p-5 flex flex-col gap-2">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${card.color}`}>
              {card.icon}
            </div>
            <div className="text-2xl font-bold text-gray-800">
              {card.value ?? '—'}
            </div>
            <div className="text-sm text-gray-500">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Forms Table */}
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="text-base font-semibold text-gray-800 mb-4">Recent Forms</h3>
        {recentForms.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-8">
            No forms yet. Go to My Forms to add your first form!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Title</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Department</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Views</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-2 px-3 text-gray-500 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {recentForms.map(form => (
                  <tr key={form._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-3 font-medium text-gray-800">{form.title}</td>
                    <td className="py-3 px-3 text-gray-500">
                      {form.department?.icon} {form.department?.code}
                    </td>
                    <td className="py-3 px-3 text-gray-500">{form.viewCount}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        form.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {form.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-400">
                      {new Date(form.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}