import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const [pendingProfessors, setPendingProfessors] = useState([]);
  const [allProfessors, setAllProfessors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const load = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/admin/professors/pending'),
      axios.get('/api/admin/professors')
    ]).then(([pending, all]) => {
      setPendingProfessors(pending.data.professors);
      setAllProfessors(all.data.professors);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => {
    try {
      await axios.put(`/api/admin/professors/${id}/approve`);
      toast.success('Professor approved!');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.delete(`/api/admin/professors/${id}/reject`);
      toast.success('Professor rejected');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reject');
    }
  };

  const handleRevoke = async (id) => {
    try {
      await axios.put(`/api/admin/professors/${id}/revoke`);
      toast.success('Access revoked');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to revoke');
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Admin Panel</h2>
        <p className="text-gray-500 text-sm mt-1">Manage professor registrations and access</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'pending' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
          }`}
        >
          Pending Approval
          {pendingProfessors.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
              {pendingProfessors.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === 'all' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600 hover:bg-gray-50'
          }`}
        >
          All Professors
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : activeTab === 'pending' ? (
        <div className="bg-white rounded-2xl border overflow-hidden">
          {pendingProfessors.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No pending approvals
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Department</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Registered</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingProfessors.map(prof => (
                  <tr key={prof._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{prof.name}</td>
                    <td className="py-3 px-4 text-gray-500">{prof.email}</td>
                    <td className="py-3 px-4 text-gray-500">
                      {prof.department?.name}
                    </td>
                    <td className="py-3 px-4 text-gray-400 text-xs">
                      {new Date(prof.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleApprove(prof._id)}
                          className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg transition">
                          Approve
                        </button>
                        <button onClick={() => handleReject(prof._id)}
                          className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition">
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden">
          {allProfessors.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No professors registered yet
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Name</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Department</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allProfessors.map(prof => (
                  <tr key={prof._id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-800">{prof.name}</td>
                    <td className="py-3 px-4 text-gray-500">{prof.email}</td>
                    <td className="py-3 px-4 text-gray-500">{prof.department?.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        prof.isApproved ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {prof.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {prof.isApproved && (
                        <button onClick={() => handleRevoke(prof._id)}
                          className="text-xs border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
                          Revoke Access
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}