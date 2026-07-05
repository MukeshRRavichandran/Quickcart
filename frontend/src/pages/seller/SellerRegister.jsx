import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Upload, 
  ShieldCheck, 
  Briefcase, 
  User, 
  MapPin, 
  CreditCard, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Store, 
  Mail, 
  Lock, 
  Phone 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';

export default function SellerRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Personal
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    
    // Step 2: Business & Address
    shopName: '',
    businessType: 'Sole Proprietorship',
    gstin: '',
    panNumber: '',
    addressLine: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Step 3: Bank
    bankName: '',
    bankAccount: '',
    routingNumber: '',
    
    // Documents (Mocked file names)
    aadhaarFile: null,
    panFile: null,
    licenseFile: null,
    
    // Step 4: Terms
    acceptedTerms: false
  });

  const [documents, setDocuments] = useState({
    aadhaarFile: null,
    panFile: null,
    licenseFile: null
  });

  // Mock Upload states
  const [uploadProgress, setUploadProgress] = useState({
    aadhaar: 0,
    pan: 0,
    license: 0
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // File upload handler
  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setUploadProgress(prev => ({ ...prev, [type]: 10 }));
      setDocuments(prev => ({ ...prev, [`${type}File`]: file }));
      
      let progress = 10;
      const interval = setInterval(() => {
        progress += 30;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFormData(prev => ({ ...prev, [`${type}File`]: file.name }));
        }
        setUploadProgress(prev => ({ ...prev, [type]: progress }));
      }, 150);
    }
  };

  const nextStep = () => {
    setError('');
    
    // Validation for Step 1
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all personal details.');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }
    
    // Validation for Step 2
    if (step === 2) {
      if (!formData.shopName || !formData.addressLine || !formData.city || !formData.state || !formData.zipCode) {
        setError('Please fill in required shop name and address details.');
        return;
      }
      if (!formData.gstin) {
        setError('GSTIN/Business tax ID is required.');
        return;
      }
    }
    
    // Validation for Step 3
    if (step === 3) {
      if (!formData.bankName || !formData.bankAccount || !formData.routingNumber) {
        setError('Please fill in all bank details.');
        return;
      }
      if (!formData.aadhaarFile || !formData.panFile || !formData.licenseFile) {
        setError('Please upload all required verification documents.');
        return;
      }
    }

    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.acceptedTerms) {
      setError('You must accept the Terms & Conditions to submit your application.');
      return;
    }

    setLoading(true);

    try {
      // Upload files first
      let fileUrls = {};
      if (documents.aadhaarFile || documents.panFile || documents.licenseFile) {
        const fileData = new FormData();
        if (documents.aadhaarFile) fileData.append('aadhaarFile', documents.aadhaarFile);
        if (documents.panFile) fileData.append('panFile', documents.panFile);
        if (documents.licenseFile) fileData.append('licenseFile', documents.licenseFile);
        
        try {
          const uploadRes = await authAPI.uploadFiles(fileData);
          fileUrls = uploadRes.fileUrls || {};
        } catch (uploadErr) {
          setError('Failed to upload documents. Please try again.');
          setLoading(false);
          return;
        }
      }

      await register(
        formData.name,
        formData.email,
        formData.password,
        'seller',
        formData.shopName,
        {
          gstin: formData.gstin,
          bankName: formData.bankName,
          bankAccount: formData.bankAccount,
          routingNumber: formData.routingNumber,
          phone: formData.phone,
          address: {
            address: formData.addressLine,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
            phone: formData.phone
          },
          aadhaarFile: fileUrls.aadhaarFile || '',
          panFile: fileUrls.panFile || '',
          licenseFile: fileUrls.licenseFile || ''
        }
      );

      // Save additional profile details in local storage for local reference if needed
      localStorage.setItem(`pending_seller_data_${formData.email}`, JSON.stringify({
        phone: formData.phone,
        gstin: formData.gstin,
        bankName: formData.bankName,
        bankAccount: formData.bankAccount,
        routingNumber: formData.routingNumber,
        address: {
          address: formData.addressLine,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          phone: formData.phone
        }
      }));

      setRegistrationSuccess(true);
    } catch (err) {
      setError(err.message || 'Onboarding application failed. Please verify all details.');
    } finally {
      setLoading(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Personal' },
    { num: 2, label: 'Business & Address' },
    { num: 3, label: 'Documents & Bank' },
    { num: 4, label: 'Review' }
  ];

  if (registrationSuccess) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 fade-in text-left font-outfit">
        <div className="bg-white border border-neutral-100 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <ShieldCheck size={48} />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-outfit font-extrabold text-3xl text-neutral-800">
              Application Under Review!
            </h1>
            <p className="text-sm text-neutral-500 max-w-md mx-auto leading-relaxed">
              Thank you for registering as a seller on QuickCart! To maintain a trusted ecosystem, all store applications go through an administrative verification audit.
            </p>
          </div>

          <div className="bg-neutral-50 rounded-2xl p-6 text-left border border-neutral-100 max-w-md mx-auto space-y-4">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-extrabold border-b border-neutral-200 pb-1.5">
              Onboarding Status Dashboard
            </span>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-semibold">
                <span className="text-neutral-500">Merchant Name:</span>
                <span className="text-neutral-800">{formData.name}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-neutral-500">Store Brand:</span>
                <span className="text-neutral-800">{formData.shopName}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-neutral-500">Registered Email:</span>
                <span className="text-neutral-800">{formData.email}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span className="text-neutral-500">Audit Status:</span>
                <span className="text-amber-500 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Pending Verification
                </span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50/50 rounded-2xl p-5 text-xs text-emerald-800 leading-relaxed border border-emerald-100 max-w-md mx-auto text-left flex gap-3">
            <CheckCircle size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">What happens next?</p>
              <ul className="list-disc pl-4 space-y-1 font-semibold text-emerald-700">
                <li>Our operations team will review your business credentials, GSTIN, and uploaded documents.</li>
                <li>Audit completion typically takes 24–48 business hours.</li>
                <li>You will receive an email notification once your portal is approved and active.</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/10 transition-all w-full max-w-xs"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-outfit">
      
      {/* Brand Header */}
      <div className="text-center space-y-2 mb-8">
        <Link to="/" className="inline-block">
          <span className="font-outfit font-extrabold text-3xl tracking-tight text-primary">
            Quick<span className="text-primary-darker">cart</span>
          </span>
        </Link>
        <h2 className="font-outfit font-extrabold text-2xl text-neutral-800">
          Merchant Partner Program
        </h2>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">
          Set up your digital shop and sell organic fresh food products to thousands of customers daily.
        </p>
      </div>

      {/* Progress Steps Indicator */}
      <div className="mb-10 max-w-2xl mx-auto hidden sm:block">
        <div className="flex items-center justify-between relative">
          {/* Progress bar background line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-200 -z-10"></div>
          {/* Active progress colored line */}
          <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-primary transition-all duration-300 -z-10"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
          
          {stepsList.map((s) => (
            <div key={s.num} className="flex flex-col items-center gap-1.5">
              <div 
                className={`w-9 h-9 rounded-full font-bold text-xs flex items-center justify-center border-2 transition-all duration-300 shadow-sm ${
                  step > s.num 
                    ? 'bg-primary border-primary text-white' 
                    : step === s.num
                    ? 'bg-white border-primary text-primary scale-110 ring-4 ring-primary-light/30'
                    : 'bg-white border-neutral-250 text-neutral-400'
                }`}
              >
                {step > s.num ? <Check size={16} /> : s.num}
              </div>
              <span className={`text-[10px] uppercase font-bold tracking-wider ${
                step >= s.num ? 'text-neutral-800' : 'text-neutral-400'
              }`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile step status banner */}
      <div className="sm:hidden bg-white border border-neutral-100 p-4 rounded-2xl flex justify-between items-center mb-6 shadow-sm">
        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Step {step} of 4</span>
        <span className="text-sm font-extrabold text-primary">{stepsList[step - 1].label} Details</span>
      </div>

      {/* Form Card Container */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-6 sm:p-10 shadow-lg text-left max-w-3xl mx-auto fade-in">
        
        {/* Error notification */}
        {error && (
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl text-accent text-xs font-bold flex items-center gap-2.5">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs font-bold text-neutral-500">
          
          {/* STEP 1: PERSONAL DETAILS */}
          {step === 1 && (
            <div className="space-y-4 fade-in">
              <div className="border-b border-neutral-50 pb-3 flex items-center gap-2 text-neutral-800">
                <User size={18} className="text-primary" />
                <h3 className="font-outfit font-extrabold text-base">Personal Profile</h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-455 uppercase text-[9px] tracking-wider">Full Name *</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all font-semibold text-neutral-700"
                      required
                    />
                    <User size={15} className="absolute left-3.5 top-3.5 text-neutral-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-455 uppercase text-[9px] tracking-wider">Mobile Number *</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1 555 123 4567"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all font-semibold text-neutral-700"
                      required
                    />
                    <Phone size={15} className="absolute left-3.5 top-3.5 text-neutral-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-455 uppercase text-[9px] tracking-wider">Email Address *</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all font-semibold text-neutral-700"
                    required
                  />
                  <Mail size={15} className="absolute left-3.5 top-3.5 text-neutral-400" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-455 uppercase text-[9px] tracking-wider">Password *</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all font-semibold text-neutral-700"
                      required
                    />
                    <Lock size={15} className="absolute left-3.5 top-3.5 text-neutral-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-455 uppercase text-[9px] tracking-wider">Confirm Password *</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Retype password"
                      className="w-full pl-10 pr-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all font-semibold text-neutral-700"
                      required
                    />
                    <Lock size={15} className="absolute left-3.5 top-3.5 text-neutral-400" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: BUSINESS DETAILS & SHOP ADDRESS */}
          {step === 2 && (
            <div className="space-y-6 fade-in font-semibold">
              <div className="space-y-4">
                <div className="border-b border-neutral-50 pb-3 flex items-center gap-2 text-neutral-800">
                  <Briefcase size={18} className="text-primary" />
                  <h3 className="font-outfit font-extrabold text-base">Business Information</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-neutral-455 uppercase text-[9px] tracking-wider block font-bold">Store Brand Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                        placeholder="e.g. GreenGlow Organics"
                        className="w-full pl-10 pr-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-neutral-700 font-semibold"
                        required
                      />
                      <Store size={15} className="absolute left-3.5 top-3.5 text-neutral-400" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-455 uppercase text-[9px] tracking-wider block font-bold">Business Entity Type *</label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-neutral-700 font-semibold"
                    >
                      <option value="Sole Proprietorship">Sole Proprietorship</option>
                      <option value="Partnership Firm">Partnership Firm</option>
                      <option value="Private Limited Company">Private Limited Company</option>
                      <option value="LLP (Partnership)">LLP (Partnership)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-neutral-455 uppercase text-[9px] tracking-wider block font-bold">GSTIN (Tax ID) *</label>
                    <input
                      type="text"
                      name="gstin"
                      value={formData.gstin}
                      onChange={handleChange}
                      placeholder="15-digit GSTIN number"
                      maxLength={15}
                      className="w-full px-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-neutral-700 font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-455 uppercase text-[9px] tracking-wider block font-bold">Business PAN Card Number *</label>
                    <input
                      type="text"
                      name="panNumber"
                      value={formData.panNumber}
                      onChange={handleChange}
                      placeholder="10-character PAN card number"
                      maxLength={10}
                      className="w-full px-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-neutral-700 font-semibold uppercase"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="border-b border-neutral-50 pb-3 flex items-center gap-2 text-neutral-800">
                  <MapPin size={18} className="text-primary" />
                  <h3 className="font-outfit font-extrabold text-base">Store Address</h3>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-455 uppercase text-[9px] tracking-wider block font-bold">Street address *</label>
                  <input
                    type="text"
                    name="addressLine"
                    value={formData.addressLine}
                    placeholder="Warehouse or outlet building, street name"
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-neutral-700 font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-neutral-455 uppercase text-[9px] tracking-wider block font-bold">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="City"
                      className="w-full px-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-neutral-700 font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-455 uppercase text-[9px] tracking-wider block font-bold">State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder="State"
                      className="w-full px-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-neutral-700 font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-455 uppercase text-[9px] tracking-wider block font-bold">ZIP / Postal Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      placeholder="ZIP Code"
                      className="w-full px-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-neutral-700 font-semibold"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: BANK DETAILS & DOCUMENT UPLOADS */}
          {step === 3 && (
            <div className="space-y-6 fade-in font-semibold">
              <div className="space-y-4">
                <div className="border-b border-neutral-50 pb-3 flex items-center gap-2 text-neutral-800">
                  <CreditCard size={18} className="text-primary" />
                  <h3 className="font-outfit font-extrabold text-base">Bank Payout Account</h3>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-455 uppercase text-[9px] tracking-wider block font-bold">Bank Name *</label>
                  <input
                    type="text"
                    name="bankName"
                    value={formData.bankName}
                    onChange={handleChange}
                    placeholder="e.g. Chase Bank, Wells Fargo"
                    className="w-full px-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-neutral-700 font-semibold"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-neutral-455 uppercase text-[9px] tracking-wider block font-bold">Account Number *</label>
                    <input
                      type="text"
                      name="bankAccount"
                      value={formData.bankAccount}
                      onChange={handleChange}
                      placeholder="Bank account number"
                      className="w-full px-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-neutral-700 font-semibold"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-455 uppercase text-[9px] tracking-wider block font-bold">Routing Number / IFSC *</label>
                    <input
                      type="text"
                      name="routingNumber"
                      value={formData.routingNumber}
                      onChange={handleChange}
                      placeholder="9-digit routing number"
                      className="w-full px-4 py-3 bg-neutral-55 border border-neutral-100 rounded-xl outline-none focus:bg-white focus:border-primary/20 transition-all text-neutral-700 font-semibold"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="border-b border-neutral-50 pb-3 flex items-center gap-2 text-neutral-800">
                  <FileText size={18} className="text-primary" />
                  <h3 className="font-outfit font-extrabold text-base">Document Upload (Verification)</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Document Aadhaar */}
                  <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl p-4 flex flex-col justify-between items-center text-center gap-3 relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      onChange={(e) => handleFileChange(e, 'aadhaar')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Drag and drop or click to upload"
                    />
                    <div className="p-2.5 bg-white rounded-full border border-neutral-100 shadow-sm text-primary group-hover:scale-110 transition-transform">
                      <FileText size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-neutral-700 block">Aadhaar Card *</span>
                      <span className="text-[8px] font-semibold text-neutral-400 block mt-0.5">Government ID Verification</span>
                    </div>
                    {formData.aadhaarFile ? (
                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[9px] font-bold z-20 relative">
                        <Check size={10} /> {formData.aadhaarFile}
                      </div>
                    ) : (
                      <div className="w-full py-1.5 border border-neutral-200 bg-white group-hover:bg-neutral-50 text-[10px] font-bold text-neutral-600 rounded-lg flex items-center justify-center gap-1 transition-colors z-20 relative pointer-events-none">
                        <Upload size={10} /> {uploadProgress.aadhaar > 0 ? `${uploadProgress.aadhaar}%` : 'Browse or Drag File'}
                      </div>
                    )}
                  </div>

                  {/* Document PAN */}
                  <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl p-4 flex flex-col justify-between items-center text-center gap-3 relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      onChange={(e) => handleFileChange(e, 'pan')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Drag and drop or click to upload"
                    />
                    <div className="p-2.5 bg-white rounded-full border border-neutral-100 shadow-sm text-primary group-hover:scale-110 transition-transform">
                      <FileText size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-neutral-700 block">PAN Card *</span>
                      <span className="text-[8px] font-semibold text-neutral-400 block mt-0.5">Tax Account Card Scan</span>
                    </div>
                    {formData.panFile ? (
                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[9px] font-bold z-20 relative">
                        <Check size={10} /> {formData.panFile}
                      </div>
                    ) : (
                      <div className="w-full py-1.5 border border-neutral-200 bg-white group-hover:bg-neutral-50 text-[10px] font-bold text-neutral-600 rounded-lg flex items-center justify-center gap-1 transition-colors z-20 relative pointer-events-none">
                        <Upload size={10} /> {uploadProgress.pan > 0 ? `${uploadProgress.pan}%` : 'Browse or Drag File'}
                      </div>
                    )}
                  </div>

                  {/* Document Shop License */}
                  <div className="bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl p-4 flex flex-col justify-between items-center text-center gap-3 relative overflow-hidden group hover:border-primary/50 transition-colors">
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      onChange={(e) => handleFileChange(e, 'license')}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      title="Drag and drop or click to upload"
                    />
                    <div className="p-2.5 bg-white rounded-full border border-neutral-100 shadow-sm text-primary group-hover:scale-110 transition-transform">
                      <FileText size={18} />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-neutral-700 block">Shop License *</span>
                      <span className="text-[8px] font-semibold text-neutral-400 block mt-0.5">FSSAI / Municipal Trade Permit</span>
                    </div>
                    {formData.licenseFile ? (
                      <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-[9px] font-bold z-20 relative">
                        <Check size={10} /> {formData.licenseFile}
                      </div>
                    ) : (
                      <div className="w-full py-1.5 border border-neutral-200 bg-white group-hover:bg-neutral-50 text-[10px] font-bold text-neutral-600 rounded-lg flex items-center justify-center gap-1 transition-colors z-20 relative pointer-events-none">
                        <Upload size={10} /> {uploadProgress.license > 0 ? `${uploadProgress.license}%` : 'Browse or Drag File'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & TERMS CHECKBOX */}
          {step === 4 && (
            <div className="space-y-6 fade-in text-left">
              <div className="border-b border-neutral-50 pb-3 flex items-center gap-2 text-neutral-800">
                <CheckCircle size={18} className="text-primary" />
                <h3 className="font-outfit font-extrabold text-base">Application Summary Review</h3>
              </div>

              {/* Grid cards for reviews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Personal Card info */}
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 space-y-2 text-xs font-semibold text-neutral-600">
                  <h4 className="font-outfit font-extrabold text-neutral-850 flex items-center gap-1 border-b border-neutral-200 pb-1 text-primary">
                    <User size={13} /> Personal Details
                  </h4>
                  <div className="space-y-1">
                    <p><span className="text-neutral-400">Name:</span> <span className="text-neutral-700 font-bold">{formData.name}</span></p>
                    <p><span className="text-neutral-400">Email:</span> <span className="text-neutral-700 font-bold">{formData.email}</span></p>
                    <p><span className="text-neutral-400">Mobile:</span> <span className="text-neutral-700 font-bold">{formData.phone}</span></p>
                  </div>
                </div>

                {/* Business Card info */}
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 space-y-2 text-xs font-semibold text-neutral-600">
                  <h4 className="font-outfit font-extrabold text-neutral-850 flex items-center gap-1 border-b border-neutral-200 pb-1 text-primary">
                    <Briefcase size={13} /> Business Details
                  </h4>
                  <div className="space-y-1">
                    <p><span className="text-neutral-400">Store Name:</span> <span className="text-neutral-700 font-extrabold">{formData.shopName}</span></p>
                    <p><span className="text-neutral-400">Type:</span> <span className="text-neutral-700 font-bold">{formData.businessType}</span></p>
                    <p><span className="text-neutral-400">GSTIN:</span> <span className="text-neutral-700 font-bold">{formData.gstin}</span></p>
                    <p><span className="text-neutral-400">PAN:</span> <span className="text-neutral-700 font-bold uppercase">{formData.panNumber}</span></p>
                  </div>
                </div>

                {/* Address Card info */}
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 space-y-2 text-xs font-semibold text-neutral-600">
                  <h4 className="font-outfit font-extrabold text-neutral-850 flex items-center gap-1 border-b border-neutral-200 pb-1 text-primary">
                    <MapPin size={13} /> Address Details
                  </h4>
                  <div className="space-y-1">
                    <p className="text-neutral-700 font-bold">{formData.addressLine}</p>
                    <p className="text-neutral-700 font-bold">{formData.city}, {formData.state} - {formData.zipCode}</p>
                  </div>
                </div>

                {/* Bank details Card */}
                <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 space-y-2 text-xs font-semibold text-neutral-600">
                  <h4 className="font-outfit font-extrabold text-neutral-850 flex items-center gap-1 border-b border-neutral-200 pb-1 text-primary">
                    <CreditCard size={13} /> Payout Account
                  </h4>
                  <div className="space-y-1">
                    <p><span className="text-neutral-400">Bank Name:</span> <span className="text-neutral-700 font-bold">{formData.bankName}</span></p>
                    <p><span className="text-neutral-400">Account:</span> <span className="text-neutral-700 font-bold">••••••••{formData.bankAccount.slice(-4)}</span></p>
                    <p><span className="text-neutral-400">Routing/IFSC:</span> <span className="text-neutral-700 font-bold uppercase">{formData.routingNumber}</span></p>
                  </div>
                </div>

              </div>

              {/* Uploaded files summary */}
              <div className="bg-neutral-50 border border-neutral-100 rounded-2xl p-4 text-xs space-y-2">
                <h4 className="font-outfit font-extrabold text-neutral-850 flex items-center gap-1 border-b border-neutral-200 pb-1 text-primary">
                  <FileText size={13} /> Verification Files
                </h4>
                <div className="flex flex-wrap gap-4 pt-1 font-bold">
                  <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-3 py-1 rounded-full text-[10px]">
                    <Check size={12} /> Aadhaar: {formData.aadhaarFile}
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-3 py-1 rounded-full text-[10px]">
                    <Check size={12} /> PAN Scan: {formData.panFile}
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-3 py-1 rounded-full text-[10px]">
                    <Check size={12} /> Permit/License: {formData.licenseFile}
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-4 border-t border-neutral-100 font-semibold text-neutral-600">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={formData.acceptedTerms}
                    onChange={handleChange}
                    className="w-4.5 h-4.5 accent-primary rounded border-neutral-300 mt-0.5 focus:ring-primary/25 cursor-pointer"
                    required
                  />
                  <span className="leading-relaxed">
                    I declare that the information provided above is true and accurate. I accept the <a href="#terms" className="text-primary hover:underline font-extrabold">Seller Terms & Conditions</a> and authorize QuickCart to perform business background checks.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* FORM ACTIONS */}
          <div className="pt-6 border-t border-neutral-50 flex justify-between gap-4">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-5 py-3 border border-neutral-200 hover:bg-neutral-55 text-neutral-600 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft size={14} /> Back
              </button>
            ) : (
              <Link
                to="/login"
                className="px-5 py-3 border border-neutral-200 hover:bg-neutral-55 text-neutral-600 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all"
              >
                <ArrowLeft size={14} /> Revert to Login
              </Link>
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-primary/10 hover:shadow-lg ml-auto"
              >
                Continue <ArrowRight size={14} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3.5 bg-primary hover:bg-primary-dark disabled:bg-neutral-300 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/10 hover:shadow-xl ml-auto"
              >
                {loading ? 'Submitting Application...' : 'Submit Application'}
                <ShieldCheck size={16} />
              </button>
            )}
          </div>

        </form>

      </div>

      {/* Trust badge footer */}
      <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-neutral-400 font-semibold">
        <ShieldCheck size={16} className="text-primary" />
        <span>Instamart & Shopify Secured Partner Center. Data is fully encrypted.</span>
      </div>

    </div>
  );
}
