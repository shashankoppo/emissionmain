import { useState, useEffect } from 'react';
import api from '../lib/api';
import { CheckCircle } from 'lucide-react';

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

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await api.get('/enquiries');
      setEnquiries(response.data);
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

  if (loading) {
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
        <p className="text-gray-600 mt-1">Manage customer enquiries and leads</p>
      </div>

      <div className="space-y-4">
        {enquiries.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600">No enquiries yet.</p>
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
                  value={enquiry.status}
                  onChange={(e) => updateStatus(enquiry.id, e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{enquiry.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
