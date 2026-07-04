import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Users, Calendar, ArrowUpRight, DollarSign } from 'lucide-react';

export default function Analytics() {
  const [toastMessage, setToastMessage] = useState('');

  const monthlyEarnings = [
    { month: 'Jan', revenue: 2800, orders: 82 },
    { month: 'Feb', revenue: 3100, orders: 95 },
    { month: 'Mar', revenue: 3900, orders: 110 },
    { month: 'Apr', revenue: 3400, orders: 102 },
    { month: 'May', revenue: 4200, orders: 120 },
    { month: 'Jun', revenue: 4800, orders: 135 },
  ];

  const categoryPerformance = [
    { category: 'Fruits & Vegetables', share: 45, sales: 2400.00 },
    { category: 'Dairy & Eggs', share: 25, sales: 1100.00 },
    { category: 'Bakery', share: 15, sales: 650.00 },
    { category: 'Others', share: 15, sales: 650.00 },
  ];

  const triggerExport = (format) => {
    setToastMessage(`Exporting report to ${format}...`);
    setTimeout(() => setToastMessage(''), 1500);
  };

  return (
    <div className="space-y-6 text-left relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-neutral-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-pulse">
          <Download size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Analytics & Reports</h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Monitor customer signups, total sales metrics, and performance charts.</p>
        </div>

        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerExport('PDF')}
            className="flex items-center gap-1.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-600 font-bold px-3 py-2 rounded-xl text-xs transition-colors"
          >
            <Download size={14} />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => triggerExport('Excel')}
            className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-bold px-3 py-2 rounded-xl text-xs shadow-md shadow-primary/10 transition-colors"
          >
            <Download size={14} />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Grid: Charts & Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Revenue chart */}
        <div className="lg:col-span-2 bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4 text-left">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-primary" /> Monthly Revenue Trend
          </h3>

          <div className="relative pt-6">
            {/* SVG bar chart */}
            <svg viewBox="0 0 600 200" className="w-full h-44 overflow-visible">
              {/* Horizontal gridlines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="#f4f4f5" strokeDasharray="3" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="#f4f4f5" strokeDasharray="3" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="#f4f4f5" strokeDasharray="3" />

              {/* Monthly bars */}
              {monthlyEarnings.map((item, index) => {
                const barWidth = 40;
                const spacing = 100;
                const x = 50 + index * spacing;
                // Scale factor: max revenue is 4800, max height is 140
                const height = (item.revenue / 5000) * 140;
                const y = 160 - height;
                return (
                  <g key={item.month}>
                    {/* Background Bar track */}
                    <rect x={x} y="20" width={barWidth} height="140" fill="#f4f4f5" rx="4" />
                    {/* Active Bar */}
                    <rect 
                      x={x} 
                      y={y} 
                      width={barWidth} 
                      height={height} 
                      fill="#10b981" 
                      rx="4"
                      className="transition-all hover:fill-emerald-600 cursor-pointer"
                    />
                    {/* Value top text */}
                    <text x={x + barWidth / 2} y={y - 6} fill="#71717a" fontSize="8" fontWeight="bold" textAnchor="middle">
                      ₹{item.revenue}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* X labels */}
            <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 pt-2 px-14">
              {monthlyEarnings.map(item => (
                <span key={item.month}>{item.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Category breakdown shares */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4 text-left">
          <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-3 flex items-center gap-2">
            <BarChart3 size={16} className="text-primary" /> Category Breakdown
          </h3>

          <div className="space-y-4 pt-1">
            {categoryPerformance.map((row) => (
              <div key={row.category} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-bold text-neutral-600">
                  <span>{row.category}</span>
                  <span>₹{row.sales.toFixed(2)} ({row.share}%)</span>
                </div>
                <div className="h-2 bg-neutral-50 rounded-full overflow-hidden border border-neutral-100/55">
                  <div 
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${row.share}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Row summary logs */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4">
        <h3 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2">
          Monthly Comparison Ledger
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider">
                <th className="pb-3">Month</th>
                <th className="pb-3">Total Volume</th>
                <th className="pb-3">Orders Fullfilled</th>
                <th className="pb-3">Customer Growth</th>
                <th className="pb-3">Gross Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-600 font-semibold">
              {monthlyEarnings.map((row) => (
                <tr key={row.month} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3 font-bold text-neutral-800">{row.month} 2026</td>
                  <td className="py-3 font-extrabold text-neutral-800">₹{row.revenue.toFixed(2)}</td>
                  <td className="py-3">{row.orders} Orders</td>
                  <td className="py-3 text-emerald-500 font-bold">+12% MoM</td>
                  <td className="py-3">
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">
                      Healthy
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
