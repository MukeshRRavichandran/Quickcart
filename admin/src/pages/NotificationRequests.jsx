import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Clock, Check, Search, Filter } from 'lucide-react';
import api from '../services/api';

export default function NotificationRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [filter]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      let url = '/api/notification-requests';
      if (filter !== 'All') {
        url += `?status=${filter}`;
      }
      const { data } = await api.get(url);
      setRequests(data);
    } catch (error) {
      console.error('Error fetching notification requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter(req => {
    const prodName = req.product?.name?.toLowerCase() || '';
    const custName = req.user?.name?.toLowerCase() || '';
    const email = req.email?.toLowerCase() || '';
    const searchLower = search.toLowerCase();

    return prodName.includes(searchLower) ||
      custName.includes(searchLower) ||
      email.includes(searchLower);
  });

  return (
    <div className="space-y-6 fade-in text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Restock Requests</h1>
          <p className="text-xs text-neutral-400 mt-1">Manage customer notifications for out-of-stock items</p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
            <input
              type="text"
              placeholder="Search by product, customer, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-neutral-200 rounded-xl text-xs outline-none focus:border-primary/50 transition-colors shadow-sm"
            />
            <Search size={14} className="absolute left-3 top-2.5 text-neutral-400" />
          </div>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="appearance-none pl-9 pr-8 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 outline-none focus:border-primary/50 transition-colors shadow-sm cursor-pointer"
            >
              <option value="All">All Requests</option>
              <option value="Pending">Pending Only</option>
              <option value="Sent">Sent Only</option>
            </select>
            <Filter size={14} className="absolute left-3 top-2.5 text-neutral-400" />
          </div>
        </div>
      </div>

      <div className="bg-white border border-neutral-100 shadow-sm rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50/50 text-neutral-500 font-outfit border-b border-neutral-100">
              <tr>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Request Date</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 font-bold text-xs uppercase tracking-wider">Sent Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-neutral-400 text-sm">Loading requests...</td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-neutral-400 text-sm">No notification requests found.</td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.product?.image || 'https://via.placeholder.com/40'}
                          alt={req.product?.name || 'Unknown Product'}
                          className="w-10 h-10 rounded-lg object-cover border border-neutral-100"
                        />
                        <span className="font-outfit font-bold text-neutral-800">
                          {req.product?.name || 'Unknown Product'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-neutral-700">{req.user?.name || 'Unknown'}</span>
                        <span className="text-xs text-neutral-400">{req.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-neutral-500">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {req.status === 'Pending' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200 uppercase tracking-wider">
                          <Clock size={10} /> Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                          <CheckCircle size={10} /> Sent
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-neutral-500">
                      {req.notifiedAt ? new Date(req.notifiedAt).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
