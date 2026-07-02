import React from 'react';
import { Box, AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Inventory() {
  const { products } = useAdmin();

  // Metrics
  const totalStockUnits = products.reduce((acc, p) => acc + p.stock, 0);
  const outOfStockCount = products.filter(p => p.stock === 0).length;
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 20).length;

  return (
    <div className="space-y-6 text-left font-outfit">
      
      {/* Header */}
      <div>
        <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Logistics Inventory</h1>
        <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Monitor aggregate inventory quantities, checkout out-of-stock items, and set warehouse reserves.</p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary-light text-primary rounded-xl">
            <Package size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Aggregate Stocked Units</span>
            <h3 className="font-outfit font-extrabold text-xl text-neutral-800">{totalStockUnits} items</h3>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Low Stock Warnings</span>
            <h3 className="font-outfit font-extrabold text-xl text-amber-500">{lowStockCount} items</h3>
          </div>
        </div>

        <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-500 rounded-xl">
            <AlertTriangle size={20} />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Out of Stock Listings</span>
            <h3 className="font-outfit font-extrabold text-xl text-red-500">{outOfStockCount} items</h3>
          </div>
        </div>

      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-100 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-neutral-50/75 border-b border-neutral-100 text-neutral-400 font-bold uppercase tracking-wider text-[10px] py-4 px-6">
                <th className="py-4 px-6">Product details</th>
                <th className="py-4 px-6">Sourced Seller</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Warehouse status</th>
                <th className="py-4 px-6">Stock level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-600 font-semibold">
              {products.map((p) => {
                const isOut = p.stock === 0;
                const isLow = p.stock > 0 && p.stock <= 20;

                return (
                  <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                        <div className="text-left space-y-0.5">
                          <h4 className="font-outfit font-bold text-neutral-800 text-xs sm:text-sm">{p.name}</h4>
                          <span className="text-[10px] text-neutral-400 block">ID: {p.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-6">{p.seller}</td>
                    <td className="py-3.5 px-6 text-xs">{p.category}</td>
                    <td className="py-3.5 px-6">
                      {isOut ? (
                        <span className="bg-red-50 text-red-650 font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase border border-red-100">
                          Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="bg-amber-50 text-amber-600 font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase border border-amber-100 animate-pulse">
                          Low Stock
                        </span>
                      ) : (
                        <span className="bg-emerald-50 text-emerald-600 font-bold text-[9px] px-2.5 py-0.5 rounded-full uppercase border border-emerald-100">
                          Healthy
                        </span>
                      )}
                    </td>
                    <td className={`py-3.5 px-6 font-extrabold text-sm ${isOut ? 'text-red-500' : isLow ? 'text-amber-500' : 'text-neutral-800'}`}>
                      {p.stock} units
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
