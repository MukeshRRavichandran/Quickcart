import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, Search, SlidersHorizontal, FileText, Eye, Check } from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function Orders() {
  const { orders, updateOrderStatus } = useSeller();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  const statuses = ['All', 'New', 'Processing', 'Packed', 'Shipped', 'Delivered'];

  // Filtered orders
  const filtered = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchTerm.toLowerCase()) || o.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || o.deliveryStatus === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (id, nextStatus) => {
    updateOrderStatus(id, nextStatus);
    showToast(`Order status updated to "${nextStatus}"`);
  };

  const handleDownloadInvoice = (orderId) => {
    showToast(`Downloading Invoice for order #${orderId}...`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

  return (
    <div className="space-y-6 text-left relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-neutral-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-pulse">
          <Check size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Manage Orders</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Track client purchase requests, fulfillment logs, and invoices.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full md:max-w-xs flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order ID or client name..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
        </div>

        {/* Status filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">
            <SlidersHorizontal size={14} />
            <span>Fulfillment:</span>
          </div>

          {statuses.map((stat) => (
            <button
              key={stat}
              onClick={() => setSelectedStatus(stat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedStatus === stat 
                  ? 'bg-primary text-white shadow-sm shadow-primary/10' 
                  : 'bg-neutral-50 text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {stat}
            </button>
          ))}
        </div>

      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[750px] text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-neutral-100 text-neutral-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Products Summary</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Payment</th>
                <th className="py-4 px-6">Delivery Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm text-neutral-600 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
                      <ClipboardList size={32} />
                      <h4 className="font-outfit font-bold text-neutral-700 text-base">No Orders Found</h4>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((o) => {
                  const isNew = o.deliveryStatus === 'New';
                  const isProcessing = o.deliveryStatus === 'Processing';
                  const isPacked = o.deliveryStatus === 'Packed';
                  const isShipped = o.deliveryStatus === 'Shipped';
                  const isDelivered = o.deliveryStatus === 'Delivered';

                  let badgeColor = '';
                  if (isNew) badgeColor = 'bg-blue-50 text-blue-600 border border-blue-100';
                  if (isProcessing) badgeColor = 'bg-amber-50 text-amber-600 border border-amber-100';
                  if (isPacked) badgeColor = 'bg-indigo-50 text-indigo-600 border border-indigo-100';
                  if (isShipped) badgeColor = 'bg-purple-50 text-purple-600 border border-purple-100';
                  if (isDelivered) badgeColor = 'bg-emerald-50 text-emerald-600 border border-emerald-100';

                  return (
                    <tr key={o.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3.5 px-6 font-mono text-xs font-bold text-neutral-800">#{o.id}</td>
                      <td className="py-3.5 px-6">
                        <div className="text-left space-y-0.5">
                          <span className="font-bold text-neutral-800 block">{o.customer.name}</span>
                          <span className="text-[10px] text-neutral-400 block">{o.orderDate}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-xs text-neutral-500">
                        {o.items.map(item => `${item.product} (x${item.quantity})`).join(', ')}
                      </td>
                      <td className="py-3.5 px-6 font-outfit font-extrabold text-neutral-800">${o.amount.toFixed(2)}</td>
                      <td className="py-3.5 px-6">
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase border border-emerald-100">
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${badgeColor}`}>
                          {o.deliveryStatus}
                        </span>
                      </td>
                      <td className="py-3.5 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            to={`/seller/orders/${o.id}`}
                            className="p-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 rounded-lg transition-colors"
                            title="Detailed view"
                          >
                            <Eye size={14} />
                          </Link>
                          
                          <button
                            onClick={() => handleDownloadInvoice(o.id)}
                            className="p-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-500 hover:text-neutral-700 rounded-lg transition-colors"
                            title="Download invoice"
                          >
                            <FileText size={14} />
                          </button>

                          {/* Action button to transition to next logical state! */}
                          {isNew && (
                            <button
                              onClick={() => handleStatusChange(o.id, 'Processing')}
                              className="px-2 py-1 bg-blue-500 hover:bg-blue-600 text-white font-bold text-[10px] rounded-lg transition-colors"
                            >
                              Process
                            </button>
                          )}
                          {isProcessing && (
                            <button
                              onClick={() => handleStatusChange(o.id, 'Packed')}
                              className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold text-[10px] rounded-lg transition-colors"
                            >
                              Pack
                            </button>
                          )}
                          {isPacked && (
                            <button
                              onClick={() => handleStatusChange(o.id, 'Shipped')}
                              className="px-2 py-1 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[10px] rounded-lg transition-colors"
                            >
                              Ship
                            </button>
                          )}
                          {isShipped && (
                            <button
                              onClick={() => handleStatusChange(o.id, 'Delivered')}
                              className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[10px] rounded-lg transition-colors"
                            >
                              Deliver
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
