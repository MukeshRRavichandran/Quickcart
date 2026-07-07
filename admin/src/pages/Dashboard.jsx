import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, ClipboardList, ShoppingBag, Store, Users, 
  AlertTriangle, CheckCircle, ShieldAlert, Cpu, HardDrive, Wifi 
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Dashboard() {
  const { products, sellers, customers, orders, payouts } = useAdmin();

  // Metrics calculations
  const totalRevenue = orders.reduce((sum, o) => sum + o.amount, 0);
  const pendingApprovalsCount = products.filter(p => p.approvalStatus === 'Pending').length + sellers.filter(s => s.verificationStatus === 'Pending').length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 20).length;
  const activeSellersCount = sellers.filter(s => s.status === 'Active').length;
  const activeCustomersCount = customers.filter(c => c.status === 'Active').length;

  const quickActions = [
    { label: 'Moderate Products', path: '/admin/products', color: 'bg-primary text-white' },
    { label: 'Add Category', path: '/admin/categories', color: 'bg-neutral-900 text-white' },
    { label: 'Settle Payouts', path: '/admin/payments', color: 'bg-blue-500 text-white' }
  ];

  return (
    <div className="space-y-6 text-left">
      
      {/* Welcome Banner */}
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Console Control Deck</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Monitor platforms gross metrics, approve seller catalogs, and check server metrics.</p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary-light text-primary rounded-xl">
            <TrendingUp size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Platform Gross Revenue</span>
            <h3 className="font-outfit font-extrabold text-xl text-neutral-800">₹{totalRevenue.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <ClipboardList size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Total Orders</span>
            <h3 className="font-outfit font-extrabold text-xl text-neutral-800">{orders.length} orders</h3>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <ShieldAlert size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Pending Approvals</span>
            <h3 className="font-outfit font-extrabold text-xl text-amber-700">{pendingApprovalsCount} tasks</h3>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-700 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Low Stock Alerts</span>
            <h3 className="font-outfit font-extrabold text-xl text-red-700">{lowStockCount} items</h3>
          </div>
        </div>

      </div>

      {/* SVG Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Wavy revenue line graph */}
        <div className="lg:col-span-2 bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4">
          <h4 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2">
            Weekly Sales Volume
          </h4>
          <div className="relative pt-4">
            <svg viewBox="0 0 500 150" className="w-full h-36 overflow-visible">
              <path
                d="M0,120 Q50,70 100,80 T200,40 T300,50 T400,20 T500,10"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
              />
              <path
                d="M0,120 Q50,70 100,80 T200,40 T300,50 T400,20 T500,10 L500,150 L0,150 Z"
                fill="url(#grad)"
                opacity="0.1"
              />
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex justify-between items-center text-[9px] font-bold text-neutral-400 pt-2 px-2">
              <span>Monday</span>
              <span>Wednesday</span>
              <span>Friday</span>
              <span>Sunday</span>
            </div>
          </div>
        </div>

        {/* User distribution */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-5">
          <h4 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2">
            Accounts Breakdown
          </h4>
          <div className="space-y-4 pt-1">
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-600">
              <span className="flex items-center gap-1.5"><Store size={14} className="text-primary" /> Active Stores</span>
              <span className="font-bold">{activeSellersCount} sellers</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-600">
              <span className="flex items-center gap-1.5"><Users size={14} className="text-blue-500" /> Registered Buyers</span>
              <span className="font-bold">{activeCustomersCount} clients</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-600">
              <span className="flex items-center gap-1.5"><ShoppingBag size={14} className="text-amber-500" /> Active Catalog Items</span>
              <span className="font-bold">{products.length} items</span>
            </div>
          </div>
        </div>

      </div>

      {/* Grid: Pending Actions & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Recent Registrations & Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4">
            <h4 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2">
              Pending Verification Requests
            </h4>

            <div className="divide-y divide-neutral-50 space-y-3">
              {sellers.filter(s => s.verificationStatus === 'Pending').map((sel) => (
                <div key={sel.id} className="flex justify-between items-center py-2 first:pt-0 last:pb-0 gap-3">
                  <div className="text-left space-y-0.5">
                    <h5 className="font-outfit font-bold text-neutral-800 text-xs sm:text-sm">{sel.name}</h5>
                    <span className="text-[10px] text-neutral-400 font-semibold block">{sel.email} • Registered {sel.registrationDate}</span>
                  </div>
                  <Link 
                    to="/admin/sellers" 
                    className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-600 font-bold rounded-lg text-[10px] transition-colors border border-amber-100"
                  >
                    Verify
                  </Link>
                </div>
              ))}
              {sellers.filter(s => s.verificationStatus === 'Pending').length === 0 && (
                <div className="py-6 text-center text-xs text-neutral-400 font-semibold">
                  No stores pending verification!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Platform Health Card */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4 text-left">
          <h4 className="font-outfit font-extrabold text-sm text-neutral-800 border-b border-neutral-50 pb-2 flex items-center gap-2">
            System Infrastructure Health
          </h4>
          
          <div className="space-y-4 pt-1">
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-600">
              <span className="flex items-center gap-1.5"><Wifi size={14} className="text-emerald-500" /> Express REST API</span>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 uppercase">
                Online
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-600">
              <span className="flex items-center gap-1.5"><HardDrive size={14} className="text-emerald-500" /> Database Cluster</span>
              <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 uppercase">
                Connected
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold text-neutral-600">
              <span className="flex items-center gap-1.5"><Cpu size={14} className="text-neutral-500" /> API Latency</span>
              <span className="font-mono font-bold text-neutral-700">42 ms</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
