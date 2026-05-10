import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const emptyDept = { name: '', code: '', description: '', color: '#4f46e5', icon: '🏛️' };
const ICONS = ['🏛️', '💻', '⚗️', '📐', '📚', '🔬', '💊', '🎨', '⚖️', '📊', '🏗️', '🌱', '🧠', '🎓', '🔭'];

export default function DepartmentsManager() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyDept);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    axios.get('/api/departments')
      .then(res => setDepartments(res.data.departments))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setFormData(emptyDept); setShowModal(true); };

  const openEdit = (dept) => {
    setEditing(dept._id);
    setFormData({ name: dept.name, code: dept.code, description: dept.description || '', color: dept.color, icon: dept.icon });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await axios.put(`/api/departments/${editing}`, formData);
        toast.success('Department updated!');
      } else {
        await axios.post('/api/departments', formData);
        toast.success('Department created!');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/departments/${id}`);
      toast.success('Department deleted');
      setDeleteConfirm(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Departments</h2>
          <p className="text-gray-500 text-sm mt-1">Manage department categories</p>
        </div>
        <button onClick={openAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          + Add Department
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.length === 0 && (
            <div className="col-span-3 text-center py-16 text-gray-400 bg-white rounded-2xl border">
              No departments yet. Add your first department!
            </div>
          )}
          {departments.map(dept => (
            <div key={dept._id} className="bg-white rounded-2xl border p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: `${dept.color}20` }}>
                    {dept.icon}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{dept.name}</div>
                    <div className="text-xs font-semibold" style={{ color: dept.color }}>{dept.code}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(dept)}
                    className="text-xs border border-gray-300 hover:border-blue-400 hover:text-blue-600 px-2.5 py-1 rounded-lg transition">
                    Edit
                  </button>
                  <button onClick={() => setDeleteConfirm(dept._id)}
                    className="text-xs border border-red-200 text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-lg transition">
                    Delete
                  </button>
                </div>
              </div>
              {dept.description && (
                <p className="text-xs text-gray-400">{dept.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-800">
                {editing ? 'Edit Department' : 'Add Department'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
                x
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Computer Science & Engineering"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="CSE"
                  value={formData.code}
                  onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Brief description..."
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                <div className="flex flex-wrap gap-2">
                  {ICONS.map(icon => (
                    <button key={icon} type="button"
                      onClick={() => setFormData({ ...formData, icon })}
                      className={`w-9 h-9 rounded-lg text-lg border-2 transition ${formData.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <input type="color" value={formData.color}
                  onChange={e => setFormData({ ...formData, color: e.target.value })}
                  className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                  {saving ? 'Saving...' : editing ? 'Update' : 'Create Department'}
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-semibold transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">🏛️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Department?</h3>
            <p className="text-gray-500 text-sm mb-5">
              Cannot delete departments that have forms linked to them.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 py-2.5 rounded-lg text-sm font-semibold transition">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}