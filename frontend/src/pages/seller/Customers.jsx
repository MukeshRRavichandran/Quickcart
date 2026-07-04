import React, { useState } from 'react';
import { Users, Search, Mail, Phone, ShoppingCart, DollarSign, ArrowUpRight } from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function Customers() {
  const { customers } = useSeller();
  
  const [searchTerm, setSearchTerm] = useState('');

  // Filter
  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Summary Metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === 'Active').length;
  const totalSpentAll = customers.reduce((acc, c) => acc + c.totalSpend, 0);

  return (
    <div className="space-y-6 text-left">
      
      {/* Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Your Customers</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Monitor customer engagement, buying frequency, and total spent history.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary-light text-primary rounded-xl">
            <Users size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Total Store Clients</span>
            <h3 className="font-outfit font-extrabold text-xl text-neutral-800">{totalCustomers}</h3>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <ArrowUpRight size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Active Shoppers</span>
            <h3 className="font-outfit font-extrabold text-xl text-emerald-600">{activeCustomers}</h3>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-500 rounded-xl">
            <DollarSign size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Total Customer Spend</span>
            <h3 className="font-outfit font-extrabold text-xl text-neutral-800">₹{totalSpentAll.toFixed(2)}</h3>
          </div>
        </div>
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
          <table className="w-full min-w-[700px] text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-neutral-100 text-neutral-400 font-bold text-[10px] sm:text-xs uppercase tracking-wider">
                <th className="py-4 px-6">Customer Profile</th>
                <th className="py-4 px-6">Contact Info</th>
                <th className="py-4 px-6 text-center">Total Orders</th>
                <th className="py-4 px-6 text-center">Total Spend</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs sm:text-sm text-neutral-600 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-neutral-400">
                      <Users size={32} />
                      <h4 className="font-outfit font-bold text-neutral-700 text-base">No Customers Found</h4>
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center text-sm">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left space-y-0.5">
                          <h4 className="font-outfit font-bold text-neutral-800 text-sm">{c.name}</h4>
                          <span className="text-[10px] text-neutral-400 font-bold block">{c.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="text-left space-y-1 text-xs">
                        <div className="flex items-center gap-1.5 text-neutral-500">
                          <Mail size={12} />
                          <span>{c.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-500">
                          <Phone size={12} />
                          <span>{c.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-center font-bold text-neutral-700">
                      <div className="flex items-center justify-center gap-1.5">
                        <ShoppingCart size={14} className="text-neutral-400" />
                        <span>{c.ordersCount} orders</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-center font-outfit font-extrabold text-neutral-850">
                      ₹{c.totalSpend.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        c.status === 'Active' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                          : 'bg-neutral-100 text-neutral-500 border border-neutral-200'
                      }`}>
                        {c.status}
                      </span>
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
