import React, { useEffect, useState } from 'react';
import { sellerAPI } from '../../services/api';
import { Package, AlertCircle } from 'lucide-react';

export default function RestockRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await sellerAPI.getRestockRequests();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching restock requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-64 bg-white rounded-2xl border border-neutral-100"></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-outfit font-extrabold text-neutral-800">Restock Requests</h1>
        <p className="text-sm text-neutral-500 mt-1">
          See which out-of-stock products your customers are waiting for.
        </p>
      </div>

      <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-neutral-50 text-neutral-300 rounded-full flex items-center justify-center mb-4">
              <Package size={32} />
            </div>
            <h3 className="text-lg font-outfit font-bold text-neutral-800">No Pending Requests</h3>
            <p className="text-sm text-neutral-500 mt-1 max-w-sm">
              You currently have no pending restock requests from customers.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50/50 text-xs uppercase font-bold text-neutral-500 border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Pending Requests</th>
                  <th className="px-6 py-4">Action Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={req.productDetails.image} 
                          alt={req.productDetails.name}
                          className="w-12 h-12 rounded-xl object-cover border border-neutral-100"
                        />
                        <div>
                          <p className="font-bold text-neutral-800">{req.productDetails.name}</p>
                          <span className="text-xs text-neutral-400">SKU: {req.productDetails.sku || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="bg-amber-100 text-amber-700 font-bold px-2.5 py-1 rounded-full text-xs">
                          {req.count} users waiting
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertCircle size={16} />
                        <span className="text-xs font-semibold">Please add stock via Inventory</span>
                      </div>
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
