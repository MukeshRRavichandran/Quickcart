import React, { useState } from 'react';
import { ClipboardList, Search, SlidersHorizontal, CheckCircle, Eye, Truck, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Orders() {
  const { orders, deliveryPartners, assignDeliveryPartner, updateOrderStatus } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Modal state for assigning delivery courier
  const [assigningOrderId, setAssigningOrderId] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const handleAssign = (orderId, courierName) => {
    assignDeliveryPartner(orderId, courierName);
    setAssigningOrderId(null);
    showToast(`Courier "${courierName}" assigned to order #${orderId}`);
  };

  const handleCancelOrder = (orderId) => {
    updateOrderStatus(orderId, 'Cancelled');
    showToast(`Order #${orderId} has been cancelled.`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

  const filtered = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || o.deliveryStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 text-left relative font-outfit">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-neutral-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-pulse">
          <CheckCircle size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Courier Assign Dialog Modal */}
      {assigningOrderId && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 max-w-sm w-full space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-neutral-50 pb-2">
              <h3 className="font-outfit font-extrabold text-neutral-850 text-base">Assign Delivery Partner</h3>
              <button onClick={() => setAssigningOrderId(null)} className="text-neutral-400 hover:text-neutral-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-neutral-400 font-semibold leading-relaxed">Choose an active courier from the logistics fleet to assign for order #{assigningOrderId}:</p>
              
              <div className="divide-y divide-neutral-50 max-h-48 overflow-y-auto pt-1">
                {deliveryPartners.filter(p => p.status === 'Active').map(partner => (
                  <button
                    key={partner.id}
                    onClick={() => handleAssign(assigningOrderId, partner.name)}
                    className="w-full text-left py-2.5 px-3 hover:bg-neutral-50 flex items-center justify-between text-xs font-bold text-neutral-700 transition-colors rounded-xl"
                  >
                    <span>{partner.name} ({partner.vehicle})</span>
                    <span className="text-[10px] text-emerald-500 font-bold">Available</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Master Orders Ledger</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Track transactions across all stores, verify payment callbacks, and dispatch logistics personnel.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
        </div>

        {/* Status filters */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-600 outline-none w-full md:w-auto"
        >
          <option value="All">All Deliveries</option>
          <option value="New">New Orders</option>
          <option value="Processing">Processing</option>
          <option value="Packed">Packed</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

      </div>

      {/* Orders Table */}
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px] py-4 px-6">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Merchant store</th>
                <th className="py-4 px-6">Invoice</th>
                <th className="py-4 px-6">Logistics Courier</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Fulfillment Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-600 font-semibold">
              {filtered.map((o) => {
                const isNew = o.deliveryStatus === 'New';
                const isProcessing = o.deliveryStatus === 'Processing';
                const isDelivered = o.deliveryStatus === 'Delivered';
                const isCancelled = o.deliveryStatus === 'Cancelled';

                let badge = '';
                if (isNew) badge = 'bg-blue-50 text-blue-600 border-blue-100';
                if (isProcessing) badge = 'bg-amber-50 text-amber-600 border-amber-100';
                if (isDelivered) badge = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                if (isCancelled) badge = 'bg-red-50 text-red-605 border-red-100';

                return (
                  <tr key={o.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-xs font-bold text-neutral-800">#{o.id}</td>
                    <td className="py-3.5 px-6">{o.customer}</td>
                    <td className="py-3.5 px-6 text-neutral-500">{o.seller}</td>
                    <td className="py-3.5 px-6 font-outfit font-extrabold text-neutral-850">₹{o.amount.toFixed(2)}</td>
                    <td className="py-3.5 px-6">
                      {o.deliveryPartner ? (
                        <span className="text-neutral-700 font-bold">{o.deliveryPartner}</span>
                      ) : (
                        <span className="text-neutral-400 font-medium">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${badge || 'bg-neutral-100 text-neutral-500'}`}>
                        {o.deliveryStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {!o.deliveryPartner && !isCancelled && (
                          <button
                            onClick={() => setAssigningOrderId(o.id)}
                            className="px-2 py-1 bg-primary hover:bg-primary-dark text-white rounded-lg font-bold text-[10px] transition-colors flex items-center gap-1"
                          >
                            <Truck size={10} />
                            <span>Assign partner</span>
                          </button>
                        )}

                        {!isCancelled && !isDelivered && (
                          <button
                            onClick={() => handleCancelOrder(o.id)}
                            className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-bold text-[10px] transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
