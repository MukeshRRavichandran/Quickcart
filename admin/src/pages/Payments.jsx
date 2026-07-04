import React, { useState } from 'react';
import { Wallet, Search, CheckCircle, Check, DollarSign } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Payments() {
  const { payouts, settlePayout } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleSettle = (id) => {
    settlePayout(id);
    showToast('Payout status set to settled successfully.');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

  const filtered = payouts.filter((p) => {
    return p.seller.toLowerCase().includes(searchTerm.toLowerCase()) || p.id.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculations
  const pendingPayoutTotal = payouts.filter(p => p.status === 'Pending').reduce((acc, p) => acc + p.amount, 0);
  const settledPayoutTotal = payouts.filter(p => p.status === 'Settled').reduce((acc, p) => acc + p.amount, 0);

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
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Payout Settlements</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Verify seller withdrawal requests, approve platform payouts, and audit client payments transaction ledger.</p>
      </div>

      {/* Metric totals */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-3">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Pending Seller Settlements</span>
          <h2 className="font-outfit font-extrabold text-2xl text-amber-500">₹{pendingPayoutTotal.toFixed(2)}</h2>
          <p className="text-[9px] text-neutral-405 leading-none">Awaiting administrative bank checks</p>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-3">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Gross lifetime Payouts settled</span>
          <h2 className="font-outfit font-extrabold text-2xl text-primary">₹{settledPayoutTotal.toFixed(2)}</h2>
          <p className="text-[9px] text-neutral-405 leading-none">Settle requests successfully transferred</p>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-xs flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by store name or payout ID..."
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
                <th className="py-4 px-6">Settlement ID</th>
                <th className="py-4 px-6">Merchant store</th>
                <th className="py-4 px-6 text-center">Amount</th>
                <th className="py-4 px-6">Submission Date</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-600 font-semibold">
              {filtered.map((pay) => {
                const isPending = pay.status === 'Pending';
                const isApproved = pay.status === 'Approved';
                const isSettled = pay.status === 'Settled';

                let badge = '';
                if (isPending) badge = 'bg-amber-50 text-amber-600 border-amber-105';
                if (isApproved) badge = 'bg-blue-50 text-blue-600 border-blue-105';
                if (isSettled) badge = 'bg-emerald-50 text-emerald-600 border-emerald-105';

                return (
                  <tr key={pay.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-mono text-xs font-bold text-neutral-800">#{pay.id}</td>
                    <td className="py-3.5 px-6">{pay.seller}</td>
                    <td className="py-3.5 px-6 text-center font-outfit font-extrabold text-neutral-850">₹{pay.amount.toFixed(2)}</td>
                    <td className="py-3.5 px-6 text-neutral-400">{pay.requestDate}</td>
                    <td className="py-3.5 px-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${badge}`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {isPending && (
                          <button
                            onClick={() => handleSettle(pay.id)}
                            className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px]"
                          >
                            Settle Funds
                          </button>
                        )}
                        {!isPending && (
                          <span className="text-[10px] text-neutral-400 font-bold flex items-center gap-1">
                            <Check size={12} className="text-emerald-500" /> Settled
                          </span>
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
