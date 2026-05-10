import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const emptyForm = {
  title: '', description: '', googleFormUrl: '',
  department: '', deadline: '', tags: '', isActive: true
};

export default function FormsManager() {
  const [forms, setForms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      axios.get('/api/forms/my'),
      axios.get('/api/departments')
    ]).then(([f, d]) => {
      setForms(f.data.forms);
      setDepartments(d.data.departments);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEdit = (form) => {
    setEditing(form._id);
    setFormData({
      title: form.title,
      description: form.description || '',
      googleFormUrl: form.googleFormUrl,
      department: form.department?._id || '',
      deadline: form.deadline ? new Date(form.deadline).toISOString().split('T')[0] : '',
      tags: form.tags?.join(', ') || '',
      isActive: form.isActive
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        deadline: formData.deadline || null
      };
      if (editing) {
        await axios.put(`/api/forms/${editing}`, payload);
        toast.success('Form updated!');
      } else {
        await axios.post('/api/forms', payload);
        toast.success('Form created!');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/forms/${id}`);
      toast.success('Form deleted');
      setDeleteConfirm(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleToggle = async (form) => {
    try {
      await axios.put(`/api/forms/${form._id}`, { isActive: !form.isActive });
      toast.success(`Form ${!form.isActive ? 'activated' : 'deactivated'}`);
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Forms</h2>
          <p className="text-gray-500 text-sm mt-1">Manage your Google Form links</p>
        </div>
        <button onClick={openAdd} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
          + Add New Form
        </button>
      </div>

      <div className="bg-white rounded-2xl border overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Form Title</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Department</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Deadline</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Views</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Active</th>
                <th className="text-left py-3 px-4 text-gray-500 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {forms.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-400">
                    No forms yet. Click Add New Form to get started!
                  </td>
                </tr>
              )}
              {forms.map(form => (
                <tr key={form._id} className="border-b last:border-0 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{form.title}</div>
                    <a href={form.googleFormUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs text-blue-500 hover:underline">
                      View form link
                    </a>
                  </td>
                  <td className="py-3 px-4 text-gray-500">
                    {form.department?.icon} {form.department?.name}
                  </td>
                  <td className="py-3 px-4 text-gray-400 text-xs">
                    {form.deadline ? new Date(form.deadline).toLocaleDateString('en-IN') : '—'}
                  </td>
                  <td className="py-3 px-4 text-gray-500">{form.viewCount}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleToggle(form)}
                      className={`w-10 h-5 rounded-full transition-colors ${form.isActive ? 'bg-blue-600' : 'bg-gray-300'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mx-0.5 ${form.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(form)}
                        className="text-xs border border-gray-300 hover:border-blue-400 hover:text-blue-600 px-3 py-1.5 rounded-lg transition">
                        Edit
                      </button>
                      <button onClick={() => setDeleteConfirm(form._id)}
                        className="text-xs border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-800">
                {editing ? 'Edit Form' : 'Add New Form'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
                x
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Form Title</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Semester Feedback Form"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Brief description for students..."
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Google Form URL</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="url"
                  placeholder="https://docs.google.com/forms/..."
                  value={formData.googleFormUrl}
                  onChange={e => setFormData({ ...formData, googleFormUrl: e.target.value })}
                  required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.department}
                  onChange={e => setFormData({ ...formData, department: e.target.value })}
                  required>
                  <option value="">-- Select department --</option>
                  {departments.map(d => (
                    <option key={d._id} value={d._id}>{d.icon} {d.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deadline (optional)</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  type="date"
                  value={formData.deadline}
                  onChange={e => setFormData({ ...formData, deadline: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
                <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. feedback, semester, mandatory"
                  value={formData.tags}
                  onChange={e => setFormData({ ...formData, tags: e.target.value })} />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" checked={formData.isActive}
                  onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 accent-blue-600" />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active (visible to students)
                </label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                  {saving ? 'Saving...' : editing ? 'Update Form' : 'Create Form'}
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

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center">
            <div className="text-4xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Form?</h3>
            <p className="text-gray-500 text-sm mb-5">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg text-sm font-semibold transition">
                Yes, Delete
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