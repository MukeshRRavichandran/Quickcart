import React, { useState } from 'react';
import { Wallet, DollarSign, Download, ArrowUpRight, CheckCircle, Send } from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function Earnings() {
  const { earnings, setEarnings } = useSeller();

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawStatus, setWithdrawStatus] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    const amountVal = Number(withdrawAmount);
    
    if (amountVal <= 0 || amountVal > earnings.balance) {
      setWithdrawStatus('Invalid amount. Must be positive and less than wallet balance.');
      return;
    }

    // Process mock payout
    setEarnings(prev => ({
      ...prev,
      balance: prev.balance - amountVal,
      pendingSettlement: prev.pendingSettlement + amountVal,
      history: [
        { id: `TXN-${Math.floor(1000 + Math.random() * 9000)}`, date: 'Just now', amount: amountVal, status: 'Pending', type: 'Withdrawal' },
        ...prev.history
      ]
    }));

    setWithdrawAmount('');
    setWithdrawStatus('');
    showToast('Withdrawal request submitted successfully!');
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
          <CheckCircle size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Earnings & Settlements</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Track payouts, wallet reserves, and settle withdrawals instantly.</p>
      </div>

      {/* Grid: Balance overview and Withdrawal form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Balance Cards Summary */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Wallet Balance</span>
              <h2 className="font-outfit font-extrabold text-2xl text-primary">₹{earnings.balance.toFixed(2)}</h2>
              <p className="text-[9px] text-neutral-400 leading-none">Available for instant settlement</p>
            </div>

            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Pending Settlement</span>
              <h2 className="font-outfit font-extrabold text-2xl text-neutral-800">₹{earnings.pendingSettlement.toFixed(2)}</h2>
              <p className="text-[9px] text-neutral-400 leading-none">Settle requests processing</p>
            </div>

            <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-3">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Withdrawn to Date</span>
              <h2 className="font-outfit font-extrabold text-2xl text-neutral-800">₹{earnings.withdrawnTotal.toFixed(2)}</h2>
              <p className="text-[9px] text-neutral-400 leading-none">Total lifetime payouts settled</p>
            </div>

          </div>

          {/* Ledger Table */}
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2">
              Transaction History
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-neutral-50 text-neutral-400 font-bold uppercase tracking-wider">
                    <th className="pb-3">Transaction ID</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Amount</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50 text-neutral-600 font-semibold">
                  {earnings.history.map((tx) => (
                    <tr key={tx.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 font-bold text-neutral-800">#{tx.id}</td>
                      <td className="py-3 text-neutral-400">{tx.date}</td>
                      <td className="py-3 text-neutral-500">{tx.type}</td>
                      <td className={`py-3 font-bold ${tx.type === 'Withdrawal' ? 'text-red-500' : 'text-emerald-500'}`}>
                        {tx.type === 'Withdrawal' ? '-' : '+'}₹{tx.amount.toFixed(2)}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                          tx.status === 'Settled' 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Withdrawal request box */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
            <Send size={16} className="text-primary" /> Request Withdrawal
          </h3>

          <form onSubmit={handleWithdrawSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase block">Amount to Settle (₹) *</label>
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="e.g. 500"
                className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-primary/20 outline-none text-sm text-neutral-700 transition-all font-bold"
                required
              />
              <span className="text-[10px] text-neutral-400 font-semibold block">Max available: ₹{earnings.balance.toFixed(2)}</span>
            </div>

            {withdrawStatus && (
              <span className="text-[10px] text-red-500 font-bold block">{withdrawStatus}</span>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold shadow-md shadow-primary/10 transition-colors flex items-center justify-center gap-1.5"
            >
              <Send size={14} />
              <span>Request Payout</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
