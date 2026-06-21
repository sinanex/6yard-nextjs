import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/config';
import { useCart } from '@/context/CartContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { mergeCart } = useCart();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      if (response.ok) {
        setStep('otp');
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== '0000') {
      setError('Invalid OTP. Use 0000');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        await mergeCart();
        onSuccess();
        onClose();
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-brand-on-surface-variant hover:text-brand-on-surface p-2 rounded-full hover:bg-brand-surface-low transition-colors"
            >
              <X size={20} />
            </button>

            <div className="p-8 pt-12">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-8 mx-auto">
                {step === 'phone' ? (
                  <Phone size={32} className="text-brand-primary" />
                ) : (
                  <ShieldCheck size={32} className="text-brand-primary" />
                )}
              </div>

              <h2 className="font-h text-2xl font-bold text-center mb-2">
                {step === 'phone' ? 'Welcome to KitBay' : 'Verify Identity'}
              </h2>
              <p className="font-sans text-brand-on-surface-variant text-center mb-8">
                {step === 'phone' 
                  ? 'Enter your phone number to continue' 
                  : `Enter the 4-digit code sent to +91 ${phone}`}
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium text-center">
                  {error}
                </div>
              )}

              {step === 'phone' ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-sans font-bold text-brand-on-surface">
                      +91
                    </span>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="00000 00000"
                      className="w-full pl-14 pr-4 py-4 bg-brand-surface border border-brand-surface-normal rounded-2xl font-sans focus:outline-none focus:border-brand-primary transition-colors"
                      autoFocus
                    />
                  </div>
                  <button
                    disabled={loading}
                    className="w-full bg-brand-primary text-white py-4 rounded-2xl font-sans font-bold uppercase tracking-widest text-xs hover:bg-brand-primary-hover transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                    {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 4))}
                    placeholder="Enter OTP (0000)"
                    className="w-full px-4 py-4 bg-brand-surface border border-brand-surface-normal rounded-2xl font-sans text-center text-2xl tracking-[0.5em] focus:outline-none focus:border-brand-primary transition-colors"
                    autoFocus
                  />
                  <button
                    disabled={loading}
                    className="w-full bg-black text-white py-4 rounded-2xl font-sans font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep('phone')}
                    className="w-full text-brand-on-surface-variant font-sans font-bold text-xs uppercase tracking-widest hover:text-brand-on-surface transition-colors py-2"
                  >
                    Change Number
                  </button>
                </form>
              )}
            </div>

            <div className="p-6 bg-brand-surface-low border-t border-brand-surface-normal text-center">
              <p className="text-[10px] text-brand-on-surface-variant uppercase tracking-widest leading-relaxed">
                By continuing, you agree to KitBay's<br />
                <span className="text-brand-on-surface font-bold">Terms of Service</span> & <span className="text-brand-on-surface font-bold">Privacy Policy</span>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
