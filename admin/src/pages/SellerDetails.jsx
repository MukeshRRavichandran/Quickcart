import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { ArrowLeft, CheckCircle, XCircle, FileText, AlertTriangle } from 'lucide-react';

export default function SellerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { sellers, approveSeller, suspendSeller } = useAdmin();
  const [seller, setSeller] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    const found = sellers.find(s => s.id === id);
    if (found) {
      setSeller(found);
    }
  }, [id, sellers]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 1500);
  };

  const handleApprove = () => {
    approveSeller(id);
    showToast('Seller store approved for public trading!');
  };

  const handleSuspend = () => {
    suspendSeller(id);
    showToast('Seller registration rejected and account suspended.');
  };

  if (!seller) {
    return (
      <div className="p-8 text-center text-neutral-500">
        <p>Loading seller details or seller not found...</p>
        <button onClick={() => navigate('/admin/sellers')} className="mt-4 text-primary font-bold hover:underline">
          Go back to directory
        </button>
      </div>
    );
  }

  const isApproved = seller.verificationStatus === 'Approved';
  const isPending = seller.verificationStatus === 'Pending';
  const isRejected = seller.verificationStatus === 'Rejected';

  const renderDocumentPreview = (label, url) => {
    if (!url) {
      return (
        <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-neutral-600">{label}</span>
          <span className="text-xs text-neutral-400 font-bold bg-neutral-200 px-3 py-1 rounded-full">Not Uploaded</span>
        </div>
      );
    }
    
    // Construct full URL if needed, assuming API URL is standard
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4555';
    const fullUrl = url.startsWith('http') ? url : `${baseURL}${url}`;

    return (
      <div className="bg-white border border-neutral-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
        <span className="text-sm font-bold text-neutral-700 flex items-center gap-2">
          <FileText size={16} className="text-primary" /> {label}
        </span>
        <button
          onClick={() => setSelectedDocument({ label, url: fullUrl })}
          className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary font-bold text-xs rounded-lg transition-colors"
        >
          View Document
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-outfit max-w-5xl mx-auto pb-10">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 bg-neutral-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 z-50 animate-pulse">
          <CheckCircle size={16} className="text-primary" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/sellers')} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-neutral-600" />
          </button>
          <div>
            <h1 className="font-outfit font-extrabold text-2xl text-neutral-800">Seller Verification</h1>
            <p className="text-xs text-neutral-400 mt-0.5 font-semibold">Review details and verify documents for {seller.name}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase border ${
            isApproved 
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
              : isPending 
              ? 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
              : 'bg-red-50 text-red-650 border-red-100'
          }`}>
            Status: {seller.verificationStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Details */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Basic Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 space-y-4">
            <h3 className="font-extrabold text-lg text-neutral-800 border-b border-neutral-50 pb-3">Basic Info</h3>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Store Brand Name</span>
                <span className="text-neutral-800 text-base font-bold">{seller.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Email Address</span>
                <span className="text-neutral-800 text-sm">{seller.email}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Phone Number</span>
                <span className="text-neutral-800 text-sm">{seller.phone}</span>
              </div>
            </div>
          </div>

          {/* Business & Bank Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 space-y-4">
            <h3 className="font-extrabold text-lg text-neutral-800 border-b border-neutral-50 pb-3">Financial Info</h3>
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">GSTIN Number</span>
                <span className="text-neutral-800 text-sm font-bold">{seller.gstin}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Bank Name</span>
                <span className="text-neutral-800 text-sm">{seller.bankName}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Account Number</span>
                <span className="text-neutral-800 text-sm font-mono">{seller.bankAccount}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block">Routing / IFSC</span>
                <span className="text-neutral-800 text-sm font-mono">{seller.routingNumber}</span>
              </div>
            </div>
          </div>
          
          {/* Address Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 space-y-4">
            <h3 className="font-extrabold text-lg text-neutral-800 border-b border-neutral-50 pb-3">Address</h3>
            <div className="space-y-1">
              <p className="text-neutral-800 text-sm">{seller.address?.address}</p>
              <p className="text-neutral-800 text-sm">{seller.address?.city}, {seller.address?.state} {seller.address?.zipCode}</p>
            </div>
          </div>

        </div>

        {/* Right Column - Documents & Action */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h3 className="font-extrabold text-lg text-neutral-800 border-b border-neutral-50 pb-3 mb-6">Verification Documents</h3>
            
            <div className="space-y-6">
              {renderDocumentPreview('Aadhaar Card Scan', seller.aadhaarFile)}
              {renderDocumentPreview('PAN Card Scan', seller.panFile)}
              {renderDocumentPreview('Shop/Trade License', seller.licenseFile)}
            </div>
          </div>
          
          {/* Verification Action Box */}
          <div className="bg-neutral-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1">
              <h4 className="font-bold text-lg flex items-center gap-2">
                <AlertTriangle size={20} className="text-amber-400" /> Administrative Action Required
              </h4>
              <p className="text-neutral-400 text-sm">Please verify the uploaded documents carefully before approving.</p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {(isPending || isRejected) && (
                <button
                  onClick={handleApprove}
                  className="flex-1 sm:flex-none px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle size={18} /> Approve
                </button>
              )}
              
              {(isPending || isApproved) && (
                <button
                  onClick={handleSuspend}
                  className="flex-1 sm:flex-none px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle size={18} /> {isApproved ? 'Suspend' : 'Reject'}
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-neutral-100">
              <h3 className="font-outfit font-extrabold text-lg text-neutral-800">{selectedDocument.label}</h3>
              <div className="flex items-center gap-3">
                <a href={selectedDocument.url} target="_blank" rel="noreferrer" className="text-xs text-primary font-bold hover:underline">
                  Open in new tab
                </a>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold text-xs rounded-lg transition-colors flex items-center gap-2"
                >
                  <ArrowLeft size={16} /> Back
                </button>
              </div>
            </div>
            {/* Modal Body */}
            <div className="flex-1 bg-neutral-100 relative">
              {selectedDocument.url.toLowerCase().endsWith('.pdf') ? (
                <iframe src={selectedDocument.url} className="w-full h-full border-none" title={selectedDocument.label} />
              ) : (
                <div className="w-full h-full flex items-center justify-center overflow-auto p-4">
                  <img src={selectedDocument.url} alt={selectedDocument.label} className="max-w-full max-h-full object-contain shadow-sm rounded-lg" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
