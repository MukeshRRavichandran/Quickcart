import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, ClipboardList, AlertTriangle, Eye, ArrowUpRight, ArrowDownRight, 
  Plus, Calendar, Sparkles, TrendingUp
} from 'lucide-react';
import { useSeller } from '../../context/SellerContext';

export default function Dashboard() {
  const { products, orders, profile } = useSeller();
  
  const [dateRange, setDateRange] = useState('01 Jul – 07 Jul, 2025');

  // Calculations
  const totalSales = 4320.50;
  const totalOrdersCount = 128;
  const pendingOrdersCount = orders.filter(o => o.deliveryStatus === 'New' || o.deliveryStatus === 'Processing').length;
  const productsCount = products.length;
  const storeViews = 2845;

  const metrics = [
    { label: 'Total Sales', value: `$${totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}`, trend: '▲ 18.6% vs last week', icon: ShoppingBag, color: 'text-emerald-500 bg-emerald-50' },
    { label: 'Total Orders', value: totalOrdersCount, trend: '▲ 12.4% vs last week', icon: ClipboardList, color: 'text-blue-500 bg-blue-50' },
    { label: 'Pending Orders', value: pendingOrdersCount, trend: '▼ 8.3% vs last week', icon: AlertTriangle, color: 'text-amber-500 bg-amber-50', isWarning: true },
    { label: 'Products', value: productsCount, trend: '▲ 5.7% vs last week', icon: ShoppingBag, color: 'text-indigo-500 bg-indigo-50' },
    { label: 'Store Views', value: storeViews.toLocaleString(), trend: '▲ 21.3% vs last week', icon: Eye, color: 'text-purple-500 bg-purple-50' },
  ];

  // Top selling products sorted
  const topSelling = [...products].sort((a, b) => b.soldCount - a.soldCount).slice(0, 4);

  // Low stock products
  const lowStock = products.filter(p => p.stock <= 20).slice(0, 4);

  return (
    <div className="space-y-6 text-left">
      
      {/* Welcome header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl sm:text-3xl text-neutral-800 flex items-center gap-2">
            Welcome back, {profile.storeName}! 👋
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1 font-semibold">Here's what's happening with your store today.</p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-4 py-2 text-xs font-bold text-neutral-600 shadow-sm hover:border-neutral-300 transition-all">
            <Calendar size={14} className="text-neutral-400" />
            <span>{dateRange}</span>
          </button>
          <Link
            to="/seller/products/add"
            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white rounded-xl px-4 py-2 text-xs font-bold shadow-md shadow-primary/10 transition-all"
          >
            <Plus size={14} />
            <span>Add Product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          const isNegative = m.trend.includes('▼');
          return (
            <div key={m.label} className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4 hover:border-primary/10 transition-colors">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">{m.label}</span>
                <div className={`p-2.5 rounded-xl ${m.color}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <h3 className="font-outfit font-extrabold text-xl sm:text-2xl text-neutral-800">{m.value}</h3>
                <span className={`text-[10px] font-bold flex items-center gap-0.5 mt-1.5 ${
                  isNegative ? 'text-red-500' : 'text-emerald-500'
                }`}>
                  {isNegative ? <ArrowDownRight size={10} /> : <ArrowUpRight size={10} />}
                  {m.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Sales Overview SVG Chart */}
        <div className="lg:col-span-2 bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
            <div>
              <h3 className="font-outfit font-extrabold text-sm text-neutral-800">Sales Overview</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5 font-semibold">Weekly gross performance metrics</p>
            </div>
            <select className="bg-neutral-50 border border-neutral-200 rounded-lg px-2.5 py-1 text-[10px] font-bold text-neutral-600 focus:outline-none">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>

          <div className="relative pt-4">
            {/* SVG Wavy Graph */}
            <svg viewBox="0 0 600 200" className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Horizontal Gridlines */}
              <line x1="0" y1="50" x2="600" y2="50" stroke="#f4f4f5" strokeDasharray="3" />
              <line x1="0" y1="100" x2="600" y2="100" stroke="#f4f4f5" strokeDasharray="3" />
              <line x1="0" y1="150" x2="600" y2="150" stroke="#f4f4f5" strokeDasharray="3" />
              
              {/* Area path */}
              <path 
                d="M 20 120 C 100 130, 140 70, 200 90 C 260 110, 300 40, 360 80 C 420 120, 480 80, 580 50 L 580 180 L 20 180 Z" 
                fill="url(#chartGradient)" 
              />
              
              {/* Line path */}
              <path 
                d="M 20 120 C 100 130, 140 70, 200 90 C 260 110, 300 40, 360 80 C 420 120, 480 80, 580 50" 
                fill="none" 
                stroke="#10B981" 
                strokeWidth="3" 
                strokeLinecap="round"
              />

              {/* Data Node Points */}
              <circle cx="20" cy="120" r="4" fill="#ffffff" stroke="#10B981" strokeWidth="2.5" />
              <circle cx="200" cy="90" r="4" fill="#ffffff" stroke="#10B981" strokeWidth="2.5" />
              <circle cx="360" cy="80" r="4" fill="#ffffff" stroke="#10B981" strokeWidth="2.5" />
              
              {/* Active Highlight Node with tooltip */}
              <g>
                <circle cx="200" cy="90" r="6" fill="#10B981" />
                <circle cx="200" cy="90" r="10" fill="#10B981" fillOpacity="0.2" />
                
                {/* Tooltip box */}
                <rect x="150" y="30" width="100" height="36" rx="6" fill="#1e293b" />
                <text x="200" y="46" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">$1,240.50</text>
                <text x="200" y="58" fill="#94a3b8" fontSize="7" textAnchor="middle">03 Jul, 2025</text>
              </g>
            </svg>

            {/* X Axis labels */}
            <div className="flex justify-between items-center text-[9px] font-bold text-neutral-400 pt-2 px-2">
              <span>01 Jul</span>
              <span>02 Jul</span>
              <span>03 Jul</span>
              <span>04 Jul</span>
              <span>05 Jul</span>
              <span>06 Jul</span>
              <span>07 Jul</span>
            </div>
          </div>
        </div>

        {/* Order Status SVG Donut Chart */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-50 pb-3">
            <div>
              <h3 className="font-outfit font-extrabold text-sm text-neutral-800">Order Status</h3>
              <p className="text-[10px] text-neutral-400 mt-0.5 font-semibold">Distribution of fulfillment states</p>
            </div>
            <Link to="/seller/orders" className="text-[10px] text-primary font-bold hover:underline">
              View All
            </Link>
          </div>

          <div className="flex items-center gap-6 justify-center py-2 h-44">
            {/* SVG Donut Circle */}
            <div className="relative w-28 h-28 flex-shrink-0">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                {/* New: 18.8% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#60a5fa" strokeWidth="3.2" strokeDasharray="18.8 81.2" strokeDashoffset="0" />
                {/* Processing: 25% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3.2" strokeDasharray="25 75" strokeDashoffset="-18.8" />
                {/* Packed: 21.9% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#818cf8" strokeWidth="3.2" strokeDasharray="21.9 78.1" strokeDashoffset="-43.8" />
                {/* Shipped: 23.4% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#c084fc" strokeWidth="3.2" strokeDasharray="23.4 76.6" strokeDashoffset="-65.7" />
                {/* Delivered: 10.9% */}
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.2" strokeDasharray="10.9 89.1" strokeDashoffset="-89.1" />
              </svg>
              {/* Center counter */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-outfit font-extrabold text-base text-neutral-800">128</span>
                <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider">Total</span>
              </div>
            </div>

            {/* Donut Legend */}
            <div className="space-y-1.5 text-[9px] sm:text-xs font-semibold text-neutral-500 flex-grow text-left">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span>New: 24 (18.8%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Processing: 32 (25.0%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                <span>Packed: 28 (21.9%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                <span>Shipped: 30 (23.4%)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Delivered: 14 (10.9%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Tables & Alerts section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Top Selling Products */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800">Top Selling Products</h3>
            <Link to="/seller/products" className="text-[10px] text-primary font-bold hover:underline">
              View All
            </Link>
          </div>
          
          <div className="divide-y divide-neutral-50 space-y-2 pt-1">
            {topSelling.map((prod) => (
              <div key={prod.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-100 bg-neutral-50 flex items-center justify-center p-0.5">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover rounded-md" />
                  </div>
                  <div className="text-left space-y-0.5">
                    <h4 className="font-outfit font-bold text-xs text-neutral-800 line-clamp-1 max-w-[130px]">{prod.name}</h4>
                    <span className="text-[10px] font-bold text-neutral-400">${prod.price.toFixed(2)}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-neutral-700 block">{prod.soldCount} Sold</span>
                  <span className="text-[9px] text-emerald-500 font-bold block flex items-center justify-end gap-0.5">
                    <TrendingUp size={10} /> +16%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800">Low Stock Alerts</h3>
            <Link to="/seller/inventory" className="text-[10px] text-primary font-bold hover:underline">
              View Inventory
            </Link>
          </div>

          <div className="divide-y divide-neutral-50 space-y-2 pt-1">
            {lowStock.map((prod) => (
              <div key={prod.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-neutral-100 bg-neutral-50 flex items-center justify-center p-0.5">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover rounded-md" />
                  </div>
                  <div className="text-left space-y-0.5">
                    <h4 className="font-outfit font-bold text-xs text-neutral-800 line-clamp-1 max-w-[135px]">{prod.name}</h4>
                    <span className="text-[10px] font-semibold text-neutral-400">Stock: <span className="font-bold text-red-500">{prod.stock} units</span></span>
                  </div>
                </div>
                <div>
                  <span className="bg-red-50 text-red-600 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Low Stock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-50 pb-2">
            <h3 className="font-outfit font-extrabold text-sm text-neutral-800">Recent Orders</h3>
            <Link to="/seller/orders" className="text-[10px] text-primary font-bold hover:underline">
              View All
            </Link>
          </div>

          <div className="divide-y divide-neutral-50 space-y-2 pt-1">
            {orders.slice(0, 5).map((order) => {
              const isNew = order.deliveryStatus === 'New';
              const isProcessing = order.deliveryStatus === 'Processing';
              const isPacked = order.deliveryStatus === 'Packed';
              const isShipped = order.deliveryStatus === 'Shipped';
              const isDelivered = order.deliveryStatus === 'Delivered';

              let badgeColor = '';
              if (isNew) badgeColor = 'bg-blue-50 text-blue-600';
              if (isProcessing) badgeColor = 'bg-amber-50 text-amber-600';
              if (isPacked) badgeColor = 'bg-indigo-50 text-indigo-600';
              if (isShipped) badgeColor = 'bg-purple-50 text-purple-600';
              if (isDelivered) badgeColor = 'bg-emerald-50 text-emerald-600';

              return (
                <div key={order.id} className="flex items-center justify-between py-2 first:pt-0 last:pb-0 gap-3">
                  <div className="text-left space-y-0.5">
                    <span className="text-[10px] font-extrabold text-neutral-400 block">#{order.id}</span>
                    <span className="font-outfit font-bold text-xs text-neutral-800 block line-clamp-1 max-w-[100px]">
                      {order.customer.name}
                    </span>
                  </div>
                  
                  <div className="text-right space-y-0.5">
                    <span className="text-xs font-extrabold text-neutral-800 block">${order.amount.toFixed(2)}</span>
                    <span className="text-[9px] text-neutral-400 block font-semibold">{order.timeAgo}</span>
                  </div>

                  <div>
                    <span className={`font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider block text-center min-w-[70px] ${badgeColor}`}>
                      {order.deliveryStatus}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Offers Boost Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M 0 100 C 30 80, 50 100, 100 0 L 100 100 Z" fill="currentColor" />
          </svg>
        </div>
        
        <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
          <div className="p-3 bg-white/10 rounded-xl">
            <Sparkles size={24} className="text-emerald-100" />
          </div>
          <div className="space-y-1">
            <h3 className="font-outfit font-extrabold text-lg sm:text-xl">Boost your sales with Offers & Discounts!</h3>
            <p className="text-xs text-emerald-100 max-w-lg leading-relaxed font-semibold">
              Create exciting coupons, combo promotions, or flash sale campaigns to attract more customers and grow your business.
            </p>
          </div>
        </div>

        <Link
          to="/seller/offers"
          className="bg-white hover:bg-emerald-50 text-emerald-700 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
        >
          Create Offer
        </Link>
      </div>

    </div>
  );
}
