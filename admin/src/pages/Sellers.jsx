import React, { useState } from 'react';
import { Store, Search, ShieldCheck, ShieldAlert, CheckCircle, Trash2, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Sellers() {
  const { sellers, approveSeller, suspendSeller } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVerification, setSelectedVerification] = useState('All');
  
  // Selected Seller for detailed modal view
  const [viewSeller, setViewSeller] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const handleApprove = (id) => {
    approveSeller(id);
    showToast('Seller store approved for public trading!');
  };

  const handleSuspend = (id) => {
    suspendSeller(id);
    showToast('Seller registration rejected and account suspended.');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

  const filtered = sellers.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVerification = selectedVerification === 'All' || s.verificationStatus === selectedVerification;
    return matchesSearch && matchesVerification;
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

      {/* Seller details modal */}
      {viewSeller && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 max-w-md w-full space-y-4 text-left">
            <div className="flex justify-between items-center border-b border-neutral-50 pb-2">
              <h3 className="font-outfit font-extrabold text-neutral-850 text-base">Store Specifications</h3>
              <button onClick={() => setViewSeller(null)} className="text-neutral-400 hover:text-neutral-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm font-semibold text-neutral-600">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Store Brand Name</span>
                <span className="text-neutral-800 text-base font-extrabold">{viewSeller.name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Registration Date</span>
                  <span className="text-neutral-800">{viewSeller.registrationDate}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Total Listed Items</span>
                  <span className="text-neutral-800">{viewSeller.productsCount} products</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Primary Phone</span>
                  <span className="text-neutral-800">{viewSeller.phone}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Gross Revenue</span>
                  <span className="text-primary font-bold">${viewSeller.earnings.toFixed(2)}</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Corporate Email</span>
                <span className="text-neutral-850">{viewSeller.email}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Sellers Directory</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Audit merchant applications, restrict store credentials, and monitor sales commissions.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative w-full sm:max-w-xs flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by store name or email..."
            className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-100 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-xs sm:text-sm text-neutral-700 transition-all"
          />
          <Search size={16} className="absolute left-3.5 top-3.5 text-neutral-400" />
        </div>

        {/* Droppers */}
        <select
          value={selectedVerification}
          onChange={(e) => setSelectedVerification(e.target.value)}
          className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold text-neutral-600 outline-none w-full sm:w-auto"
        >
          <option value="All">All Verification Statuses</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending Audit</option>
          <option value="Rejected">Rejected</option>
        </select>

      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px] py-4 px-6">
                <th className="py-4 px-6">Store profile</th>
                <th className="py-4 px-6">Created On</th>
                <th className="py-4 px-6 text-center">Listed Items</th>
                <th className="py-4 px-6 text-center">Earnings</th>
                <th className="py-4 px-6">Verification</th>
                <th className="py-4 px-6 text-center">Auditing Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-600 font-semibold">
              {filtered.map((sel) => {
                const isApproved = sel.verificationStatus === 'Approved';
                const isPending = sel.verificationStatus === 'Pending';
                const isRejected = sel.verificationStatus === 'Rejected';

                return (
                  <tr key={sel.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-light text-primary font-bold flex items-center justify-center">
                          {sel.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left space-y-0.5">
                          <h4 className="font-outfit font-bold text-neutral-800 text-xs sm:text-sm">{sel.name}</h4>
                          <span className="text-[10px] text-neutral-400 block">{sel.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">{sel.registrationDate}</td>
                    <td className="py-3.5 px-6 text-center font-bold text-neutral-700">{sel.productsCount} products</td>
                    <td className="py-3.5 px-6 text-center font-outfit font-extrabold text-neutral-800">${sel.earnings.toFixed(2)}</td>
                    <td className="py-3.5 px-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                        isApproved 
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                          : isPending 
                          ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                          : 'bg-red-50 text-red-650 border-red-100'
                      }`}>
                        {sel.verificationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setViewSeller(sel)}
                          className="px-2 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 rounded-lg font-bold text-[10px]"
                        >
                          View Details
                        </button>
                        
                        {isPending && (
                          <>
                            <button
                              onClick={() => handleApprove(sel.id)}
                              className="px-2 py-1 bg-emerald-500 hover:bg-emerald-650 text-white rounded-lg font-bold text-[10px]"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleSuspend(sel.id)}
                              className="px-2 py-1 bg-red-500 hover:bg-red-650 text-white rounded-lg font-bold text-[10px]"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {isApproved && (
                          <button
                            onClick={() => handleSuspend(sel.id)}
                            className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold text-[10px]"
                          >
                            Suspend
                          </button>
                        )}

                        {isRejected && (
                          <button
                            onClick={() => handleApprove(sel.id)}
                            className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-[10px]"
                          >
                            Re-activate
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
