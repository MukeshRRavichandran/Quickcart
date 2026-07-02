import React, { useState } from 'react';
import { Users, Search, Trash2, ShieldAlert, CheckCircle, Mail, Phone, ShoppingCart } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Customers() {
  const { customers, blockCustomer, unblockCustomer } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleBlock = (id) => {
    blockCustomer(id);
    showToast('Customer access blocked.');
  };

  const handleUnblock = (id) => {
    unblockCustomer(id);
    showToast('Customer account reactivated.');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-left relative font-outfit">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-neutral-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-pulse">
          <CheckCircle size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Buyers Registry</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Monitor buyer account histories, restrict access for suspicious transactions, and review ledger profiles.</p>
      </div>

      {/* Search Filter */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by customer name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px] py-4 px-6">
                <th className="py-4 px-6">Customer Profile</th>
                <th className="py-4 px-6">Contact Info</th>
                <th className="py-4 px-6 text-center">Platform Orders</th>
                <th className="py-4 px-6 text-center">Total Spend</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Account Security</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-600 font-semibold">
              {filtered.map((cust) => {
                const isBlocked = cust.status === 'Blocked';

                return (
                  <tr key={cust.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-sm">
                          {cust.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left space-y-0.5">
                          <h4 className="font-outfit font-bold text-neutral-800 text-sm">{cust.name}</h4>
                          <span className="text-[10px] text-neutral-400 block">{cust.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="text-left space-y-1 text-xs text-neutral-500">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} />
                          <span>{cust.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} />
                          <span>{cust.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-center font-bold text-neutral-700">
                      <div className="flex items-center justify-center gap-1.5">
                        <ShoppingCart size={14} className="text-neutral-400" />
                        <span>{cust.ordersCount} orders</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-center font-outfit font-extrabold text-neutral-800">${cust.totalSpend.toFixed(2)}</td>
                    <td className="py-3.5 px-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        isBlocked 
                          ? 'bg-red-50 text-red-600 border-red-100 animate-pulse' 
                          : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {isBlocked ? (
                          <button
                            onClick={() => handleUnblock(cust.id)}
                            className="px-3 py-1 bg-emerald-500 hover:bg-emerald-650 text-white rounded-lg font-bold text-[10px] transition-colors"
                          >
                            Unblock Account
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBlock(cust.id)}
                            className="px-3 py-1 bg-amber-500 hover:bg-amber-605 text-white rounded-lg font-bold text-[10px] transition-colors"
                          >
                            Block Account
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
