import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HomePage() {
  const [forms, setForms] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/departments')
      .then(res => setDepartments(res.data.departments))
      .catch(() => console.error('Failed to load departments'));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedDept) params.append('department', selectedDept);
    if (search) params.append('search', search);
    axios.get(`/api/forms?${params}`)
      .then(res => setForms(res.data.forms))
      .catch(() => console.error('Failed to load forms'))
      .finally(() => setLoading(false));
  }, [selectedDept, search]);

  const isExpired = (deadline) => deadline && new Date(deadline) < new Date();

  const formatDeadline = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Hero Section */}
      <div className="text-center mb-10">
        <div className="inline-block bg-blue-50 text-blue-600 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          🎓 University Form Portal
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Access Your Academic Forms
        </h1>
        <p className="text-gray-500 text-lg max-w-xl mx-auto">
          Browse and fill forms from all departments — no login required for students.
        </p>

        {/* Search Bar */}
        <div className="mt-6 max-w-lg mx-auto flex items-center gap-2 bg-white border border-gray-300 rounded-xl px-4 py-2.5 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search forms by title, description or tags..."
            className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Department Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedDept('')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
            selectedDept === ''
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
          }`}
        >
          🏛️ All Departments
        </button>
        {departments.map(d => (
          <button
            key={d._id}
            onClick={() => setSelectedDept(d._id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition border ${
              selectedDept === d._id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-300 hover:border-blue-400 hover:text-blue-600'
            }`}
          >
            {d.icon} {d.name}
          </button>
        ))}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {loading ? 'Loading...' : `${forms.length} form${forms.length !== 1 ? 's' : ''} found`}
        </p>
        {selectedDept && (
          <p className="text-sm text-gray-500">
            Showing: <span className="font-medium text-blue-600">
              {departments.find(d => d._id === selectedDept)?.name}
            </span>
          </p>
        )}
      </div>

      {/* Forms Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading forms...</p>
        </div>
      ) : forms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="text-5xl">📋</div>
          <h3 className="text-lg font-semibold text-gray-700">No forms found</h3>
          <p className="text-gray-400 text-sm">
            Try adjusting your search or selecting a different department.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {forms.map(form => (
            <FormCard
              key={form._id}
              form={form}
              isExpired={isExpired}
              formatDeadline={formatDeadline}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FormCard({ form, isExpired, formatDeadline }) {
  const expired = isExpired(form.deadline);

  return (
    <div className={`bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-5 flex flex-col gap-3 ${expired ? 'opacity-70' : ''}`}>

      <div className="flex items-start justify-between gap-2">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full border"
          style={{
            background: `${form.department?.color}15`,
            borderColor: `${form.department?.color}40`,
            color: form.department?.color
          }}
        >
          {form.department?.icon} {form.department?.name}
        </span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          expired ? 'bg-gray-100 text-gray-500' : form.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
        }`}>
          {expired ? 'Expired' : form.isActive ? 'Open' : 'Closed'}
        </span>
      </div>

      <h3 className="font-semibold text-gray-800 text-base leading-snug">
        {form.title}
      </h3>

      {form.description && (
        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">
          {form.description}
        </p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Professor:</span>
          <span>{form.professor?.name}</span>
        </div>
        {form.deadline && (
          <div className={`flex items-center gap-1 text-xs ${expired ? 'text-red-400' : 'text-gray-400'}`}>
            <span>Due:</span>
            <span>{formatDeadline(form.deadline)}</span>
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <span>Views:</span>
          <span>{form.viewCount}</span>
        </div>
      </div>

      {form.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {form.tags.map((tag, i) => (
            <span key={i} className="text-xs bg-blue-50 text-blue-500 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <a>
        href={form.googleFormUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`mt-auto w-full text-center py-2.5 rounded-xl text-sm font-semibold transition ${
          expired ? 'bg-gray-100 text-gray-500 hover:bg-gray-200' : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      
        {expired ? 'View Form (Expired)' : 'Open and Fill Form'}
      </a>

    </div>
  );
}