
import React, { useState } from 'react';
import { Smartphone, ShieldCheck, ArrowRight, UserCircle, Lock, Info } from 'lucide-react';
import { useTranslation } from '../../context/LanguageContext';
import { Language } from '../../translations';

interface AadhaarLoginProps {
  onLogin: (user: any) => void;
}

const AadhaarLogin: React.FC<AadhaarLoginProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t, language, setLanguage } = useTranslation();

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaar.length !== 12) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1200);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setIsLoading(true);
    setTimeout(() => {
      onLogin({
        id: 'user_1',
        name: 'Ramesh Kumar',
        aadhaarNumber: aadhaar,
        userType: 'citizen',
        location: {
          state: 'Andhra Pradesh',
          district: 'Amaravati',
          constituency: 'Tulluru',
          village: 'Village A'
        }
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Official Top Bar */}
      <div className="gov-top-bar py-1 px-4 md:px-8 flex justify-between items-center text-[10px]">
        <span className="font-semibold text-slate-500 tracking-wide uppercase">Official Portal of Government of India</span>
        <div className="flex items-center gap-4 font-bold">
          <span 
            className={`cursor-pointer ${language === 'en' ? 'text-gov-blue' : 'text-slate-400'}`}
            onClick={() => setLanguage('en')}
          >English</span>
          <span className="text-slate-300">|</span>
          <span 
            className={`cursor-pointer ${language === 'hi' ? 'text-gov-blue' : 'text-slate-400'}`}
            onClick={() => setLanguage('hi')}
          >हिन्दी</span>
          <span className="text-slate-300">|</span>
          <span 
            className={`cursor-pointer ${language === 'te' ? 'text-gov-blue' : 'text-slate-400'}`}
            onClick={() => setLanguage('te')}
          >తెలుగు</span>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6 pb-20">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/5/55/Emblem_of_India.svg"
              alt="Emblem"
              className="w-16 h-16 mx-auto mb-6"
            />
            <h1 className="text-2xl font-extrabold text-[#003366] mb-1">Unified Resident Service Portal</h1>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Digital Infrastructure for Governance</p>
          </div>

          <div className="shadcn-card p-8 border-slate-200">
            {step === 1 ? (
              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <UserCircle size={14} className="text-gov-blue" />
                    {t('aadhaarLabel')}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={12}
                      className="w-full shadcn-input text-lg font-mono tracking-[0.2em] focus:ring-2 ring-gov-blue/20"
                      placeholder="0000 0000 0000"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    <ShieldCheck className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-md border border-slate-100 flex gap-3 items-start">
                  <Info size={16} className="text-gov-blue shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-500 leading-tight font-medium">
                    Aadhaar OTP will be sent to your mobile number registered with CIDR. Please ensure your mobile is active.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={aadhaar.length !== 12 || isLoading}
                  className="w-full shadcn-button-primary py-3.5 flex items-center justify-center gap-2 shadow-sm disabled:bg-slate-200"
                >
                  {isLoading ? 'Processing...' : t('generateOtp')} <ArrowRight size={18} />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-6 animate-in slide-in-from-right-4">
                <div className="space-y-2 text-center">
                  <div className="w-12 h-12 bg-blue-50 text-gov-blue rounded-full flex items-center justify-center mx-auto mb-2">
                    <Smartphone size={24} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Verification Required</h2>
                  <p className="text-xs text-slate-400">Enter the security code sent to your registered mobile</p>
                </div>

                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={6}
                    className="w-full max-w-[200px] shadcn-input text-2xl font-bold tracking-[0.5em] text-center"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={otp.length !== 6 || isLoading}
                  className="w-full shadcn-button-primary py-3.5 flex items-center justify-center gap-2 shadow-sm disabled:bg-slate-200"
                >
                   {isLoading ? 'Verifying...' : t('signIn')}
                </button>

                <div className="text-center">
                  <button type="button" onClick={() => setStep(1)} className="text-[11px] font-bold text-slate-400 hover:text-gov-blue uppercase underline decoration-2 underline-offset-4">
                    Wait, go back
                  </button>
                </div>
              </form>
            )}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 grayscale opacity-40">
             <div className="flex gap-6 items-center">
                <img src="https://upload.wikimedia.org/wikipedia/en/9/95/Digital_India_logo.svg" alt="Digital India" className="h-10" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c9/Aadhaar_Logo.svg" alt="Aadhaar" className="h-10" />
             </div>
             <div className="flex items-center gap-1.5 text-slate-400">
               <Lock size={12} />
               <span className="text-[10px] font-bold uppercase tracking-widest italic">256-bit AES Encryption</span>
             </div>
          </div>
        </div>
      </main>

      <footer className="py-6 border-t border-slate-100 text-center text-slate-400 text-[10px] font-medium tracking-tight uppercase">
        Department of Electronics & Information Technology • NIC Portal Service
      </footer>
    </div>
  );
};

export default AadhaarLogin;
