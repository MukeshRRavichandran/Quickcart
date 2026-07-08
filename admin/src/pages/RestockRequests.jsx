import React, { useState } from 'react';
import { RefreshCcw, Search, Filter, Box } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function RestockRequests() {
  const { restockRequests } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filteredRequests = restockRequests.filter(req => {
    const matchesSearch = 
      (req.product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (req.seller?.storeName || req.seller?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'All') return matchesSearch;
    if (filterStatus === 'Fulfilled') return matchesSearch && req.isFulfilled;
    if (filterStatus === 'Pending') return matchesSearch && !req.isFulfilled;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 fade-in text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Restock Requests</h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Monitor customer demands for out-of-stock items across all sellers.</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="p-2 bg-primary/10 text-primary rounded-xl hidden md:flex">
            <Filter size={18} />
          </div>
          <select 
            className="w-full md:w-48 px-4 py-2.5 bg-neutral-50 border border-transparent rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm font-semibold text-neutral-700"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending (Not Restocked)</option>
            <option value="Fulfilled">Fulfilled (Restocked)</option>
          </select>
        </div>

        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search by product or seller name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-transparent rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-colors font-semibold"
          />
          <Search size={16} className="absolute left-3.5 top-3 text-neutral-400" />
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-neutral-50 border-b border-neutral-100 text-xs text-neutral-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Product Name</th>
                <th className="px-6 py-4">Seller</th>
                <th className="px-6 py-4 text-center">Waiting Customers</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Current Stock</th>
                <th className="px-6 py-4">Request Date</th>
                <th className="px-6 py-4 rounded-tr-2xl">Last Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-50">
              {filteredRequests.map((req) => (
                <tr key={req._id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0">
                        {req.product?.image ? (
                          <img src={req.product.image} alt={req.product.name} className="w-full h-full object-cover" />
                        ) : (
                          <Box size={18} className="text-neutral-400" />
                        )}
                      </div>
                      <div className="flex flex-col max-w-[200px]">
                        <span className="font-bold text-neutral-800 truncate">{req.product?.name || 'Unknown Product'}</span>
                        <span className="text-[10px] text-neutral-400 font-semibold truncate">{req.product?.category || 'Unknown Category'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col max-w-[150px]">
                      <span className="font-bold text-neutral-800 truncate">{req.seller?.storeName || req.seller?.name || 'Platform'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 bg-amber-50 text-amber-700 text-xs font-bold rounded-full">
                      {req.users?.length || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      req.isFulfilled 
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {req.isFulfilled ? 'Fulfilled' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`font-bold ${req.product?.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                      {req.product?.stock || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-neutral-500 text-xs font-semibold">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-neutral-500 text-xs font-semibold">
                    {req.lastRestocked ? new Date(req.lastRestocked).toLocaleDateString() : 'Never'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredRequests.length === 0 && (
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <RefreshCcw size={48} className="text-neutral-200 mb-4" />
              <h3 className="font-outfit font-bold text-neutral-800 text-lg mb-1">No requests found</h3>
              <p className="text-sm text-neutral-400">There are no restock requests matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
