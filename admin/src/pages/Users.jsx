import React, { useState } from 'react';
import { UserCheck, Search, Plus, Trash2, CheckCircle, ShieldAlert, X } from 'lucide-react';

export default function Users() {
  const [admins, setAdmins] = useState([
    { id: 'ADM-01', name: 'Admin Root', email: 'admin@quickcart.com', role: 'Super Admin', permissions: 'Full Access' },
    { id: 'ADM-02', name: 'Sarah Connor', email: 'sarah@quickcart.com', role: 'Catalog Manager', permissions: 'Products, Categories' },
    { id: 'ADM-03', name: 'John Connor', email: 'john.c@quickcart.com', role: 'Logistics Supervisor', permissions: 'Orders, Delivery Fleet' }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Catalog Manager');

  const [toastMessage, setToastMessage] = useState('');

  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    let permissions = '';
    if (role === 'Super Admin') permissions = 'Full Access';
    if (role === 'Catalog Manager') permissions = 'Products, Categories';
    if (role === 'Logistics Supervisor') permissions = 'Orders, Delivery Fleet';

    const newAdmin = {
      id: `ADM-${Math.floor(10 + Math.random() * 90)}`,
      name: name.trim(),
      email: email.trim(),
      role,
      permissions
    };

    setAdmins(prev => [...prev, newAdmin]);
    setModalOpen(false);
    setName('');
    setEmail('');
    showToast('Sub-admin credentials created!');
  };

  const handleDelete = (id) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
    showToast('Staff permissions revoked.');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

  const filtered = admins.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
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

      {/* Add Sub-admin Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-100 rounded-3xl p-6 max-w-sm w-full space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-50 pb-2">
              <h3 className="font-outfit font-extrabold text-neutral-850 text-base">Add Platform Sub-Admin</h3>
              <button onClick={() => setModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Staff Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Miller"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white text-xs font-semibold outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Staff Email *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. sarah.m@quickcart.com"
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white text-xs font-semibold outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-neutral-400 uppercase block">Operational Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold"
                >
                  <option value="Catalog Manager">Catalog Manager (Products/Categories)</option>
                  <option value="Logistics Supervisor">Logistics Supervisor (Orders/Delivery)</option>
                  <option value="Super Admin">Super Admin (Full Access)</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs shadow-md shadow-primary/10 transition-colors"
              >
                Launch Credentials
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">User Management</h1>
          <p className="text-xs text-neutral-400 mt-0.5 font-semibold font-outfit">Configure role-based access control (RBAC), modify staff accounts, and restrict platform scopes.</p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-primary/10 transition-colors self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Add Staff Account</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-neutral-100 rounded-2xl p-5 shadow-sm">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search staff members..."
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
                <th className="py-4 px-6">Staff Profile</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Operational Scopes</th>
                <th className="py-4 px-6 text-center">Revoke Access</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-neutral-600 font-semibold">
              {filtered.map((adm) => (
                <tr key={adm.id} className="hover:bg-neutral-50/50 transition-colors">
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-900 text-white font-bold flex items-center justify-center">
                        {adm.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-left space-y-0.5">
                        <h4 className="font-outfit font-bold text-neutral-800 text-xs sm:text-sm">{adm.name}</h4>
                        <span className="text-[10px] text-neutral-400 block">{adm.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="bg-primary-light text-primary font-bold text-[10px] px-2.5 py-0.5 rounded-full border border-primary/20">
                      {adm.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-neutral-500 font-mono text-xs">{adm.permissions}</td>
                  <td className="py-3.5 px-6">
                    <div className="flex items-center justify-center">
                      {adm.id === 'ADM-01' ? (
                        <span className="text-[10px] text-neutral-400 font-bold">Immutable System Owner</span>
                      ) : (
                        <button
                          onClick={() => handleDelete(adm.id)}
                          className="p-1.5 hover:bg-red-50 text-neutral-400 hover:text-red-500 rounded-lg transition-colors border border-transparent"
                          title="Revoke Permission"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
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
