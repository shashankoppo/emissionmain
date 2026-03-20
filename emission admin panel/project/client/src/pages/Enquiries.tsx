import { useState, useEffect } from 'react';
import api from '../lib/api';

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  message: string;
  status: string;
  createdAt: string;
}

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEnquiries, setTotalEnquiries] = useState(0);

  useEffect(() => {
    fetchEnquiries(page);
  }, [page]);

  const fetchEnquiries = async (pageNum = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/enquiries?page=${pageNum}&limit=20`);
      if (response.data.data) {
        setEnquiries(response.data.data);
        setTotalPages(response.data.pagination.pages);
        setTotalEnquiries(response.data.pagination.total);
      } else {
        setEnquiries(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/enquiries/${id}/status`, { status });
      setEnquiries(enquiries.map((e) => (e.id === id ? { ...e, status } : e)));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading && page === 1) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Enquiries</h1>
        <p className="text-gray-600 mt-1">Manage customer enquiries and leads ({totalEnquiries} total)</p>
      </div>

      <div className="space-y-4 mb-8">
        {enquiries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No enquiries found.</p>
          </div>
        ) : (
          enquiries.map((enquiry) => (
            <div key={enquiry.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{enquiry.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{enquiry.email}</p>
                </div>
                <select
                  title="Update enquiry status"
                  value={enquiry.status}
                  onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase">
                    Phone
                  </label>
                  <p className="text-sm text-gray-900">{enquiry.phone}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase">
                    Type
                  </label>
                  <p className="text-sm text-gray-900">{enquiry.enquiryType}</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 uppercase">
                    Date
                  </label>
                  <p className="text-sm text-gray-900">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase mb-2">
                  Message
                </label>
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{enquiry.message}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-6 py-4 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
