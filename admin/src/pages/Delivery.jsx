import React, { useState } from 'react';
import { Truck, Search, CheckCircle, Plus, Trash2, ShieldCheck, X } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

export default function Delivery() {
  const { deliveryPartners } = useAdmin();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [partnerVehicle, setPartnerVehicle] = useState('E-Bike');

  const [toastMessage, setToastMessage] = useState('');

  const handleRegisterPartner = (e) => {
    e.preventDefault();
    if (!partnerName.trim() || !partnerPhone.trim()) return;

    deliveryPartners.push({
      id: `DEL-${Math.floor(10 + Math.random() * 90)}`,
      name: partnerName.trim(),
      phone: partnerPhone.trim(),
      vehicle: partnerVehicle,
      status: 'Active',
      activeDeliveries: 0
    });

    setModalOpen(false);
    setPartnerName('');
    setPartnerPhone('');
    showToast('Courier registered to active fleet list!');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

  const filtered = deliveryPartners.filter((p) => {
    return p.name.toLowerCase().includes(searchTerm.toLowerCase());
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

      {/* Register partner modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-50 pb-2">
              <h3 className="font-outfit font-extrabold text-neutral-850 text-base">Register Logistics Partner</h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRegisterPartner} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Courier Name *</label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={(e) => setPartnerName(e.target.value)}
                  placeholder="e.g. John Miller"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white text-xs font-semibold outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Phone Contact *</label>
                <input
                  type="text"
                  value={partnerPhone}
                  onChange={(e) => setPartnerPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 234-8765"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white text-xs font-semibold outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Logistics Vehicle</label>
                <select
                  value={partnerVehicle}
                  onChange={(e) => setPartnerVehicle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold"
                >
                  <option value="E-Bike">Electric Bike</option>
                  <option value="Motorcycle">Motorcycle</option>
                  <option value="Electric Scooter">Electric Scooter</option>
                  <option value="Mini Truck">Mini Delivery Van</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs shadow-md shadow-primary/10 transition-colors"
              >
                Register Partner
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Logistics Fleet</h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-semibold font-outfit">Manage third-party delivery dispatchers, register fresh courier accounts, and track active deliveries.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-primary/10 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Register Courier</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search active courier..."
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
                <th className="py-4 px-6">Courier Name</th>
                <th className="py-4 px-6">Phone Number</th>
                <th className="py-4 px-6">Vehicle Type</th>
                <th className="py-4 px-6 text-center">Active Deliveries</th>
                <th className="py-4 px-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-600 font-semibold">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-light text-primary font-bold flex items-center justify-center">
                        {p.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left space-y-0.5">
                        <h4 className="font-outfit font-bold text-neutral-800 text-xs sm:text-sm">{p.name}</h4>
                        <span className="text-[10px] text-neutral-400 block">ID: {p.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-neutral-550">{p.phone}</td>
                  <td className="py-3.5 px-6 text-xs">{p.vehicle}</td>
                  <td className="py-3.5 px-6 text-center font-bold text-neutral-800">{p.activeDeliveries} active</td>
                  <td className="py-3.5 px-6">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                      p.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                        : 'bg-neutral-105 text-neutral-500 border-neutral-200'
                    }`}>
                      {p.status}
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
