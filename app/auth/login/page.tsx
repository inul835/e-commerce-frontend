'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header, Footer, Input, Button, Alert, Card, CardBody } from '@/components';
import { useAuth } from '@/context/AuthContext';

// টাইপ সেফটির জন্য এরর ইন্টারফেস
interface FormErrors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  
  // 💡 পয়েন্ট ১: খালি স্ট্রিং এর জ্যাম কাটানোর জন্য টাইপ সেফ এরর স্টেট
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  
  // 💡 পয়েন্ট ২: টাইপিং ক্লিয়ার করলাম যেন টাইপ কাস্টিং না লাগে
  const [message, setMessage] = useState<{ type: 'success' | 'error' | ''; text: string }>({ type: '', text: '' });
  const [rememberMe, setRememberMe] = useState(false);

  // 💡 পয়েন্ট ১-এর আসল সলিউশন: কি-ওয়ার্ড পুরোপুরি অবজেক্ট থেকে রিমুভ করার ফাংশন
  const clearError = (field: keyof FormErrors) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 💡 পয়েন্ট ৩: নতুন করে সাবমিট দিলে আগের সব এরর ও মেসেজ রিসেট
    setMessage({ type: '', text: '' });
    setErrors({});

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      await login({ email: formData.email, password: formData.password });
      
      // 💡 পয়েন্ট ৬: ইউজারকে সাকসেস মেসেজ দেখানোর জন্য ১ সেকেন্ডের একটা ডিলে ট্রিক
      setMessage({ type: 'success', text: 'Login successful! Redirecting...' });
      
      setTimeout(async () => {
        // 💡 পয়েন্ট ৫: রাউটার পুশকেawait করে সেফ নেভিগেশন এনশিওর করা
        await router.push('/');
      }, 1000);
    } catch (error: unknown) {
      // 💡 পয়েন্ট ৭: ফ্রেন্ডলি এরর মেসেজ হ্যান্ডলিং
      const messageText = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setMessage({ type: 'error', text: messageText });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* আমাজনের লাইট থিম হেডার অনুযায়ী cartCount পাস হচ্ছে */}
      <Header cartCount={0} onCartClick={() => {}} />

      {/* 🏛️ Amazon Light Mode Main Container */}
      <main className="min-h-screen bg-[#eaeded] flex flex-col items-center justify-center py-12 px-4 font-sans antialiased">
        
        {/* Amazon Signature Logo Text Feel */}
        <Link href="/" className="mb-6 text-2xl font-black tracking-tight text-neutral-900 select-none">
          EStore<span className="text-[#c45500]">.app</span>
        </Link>

        <div className="w-full max-w-[360px]">
          {/* Amazon Classic White Flat Card Layout */}
          <Card className="bg-white border border-neutral-300 rounded-none shadow-none">
            <CardBody className="p-6">
              <div className="mb-5">
                <h1 className="text-2xl font-normal text-neutral-950 mb-1">Sign in</h1>
              </div>

              {message.text && (
                <Alert
                  type={message.type as 'success' | 'error'}
                  onClose={() => setMessage({ type: '', text: '' })}
                  className="mb-4 border border-red-200 rounded-none text-xs bg-red-50 text-[#b12704]"
                >
                  {message.text}
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    label="Email (phone for mobile accounts)"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      clearError('email'); // 💡 ফিক্সড: খালি স্ট্রিং সেট না করে সরাসরি রিমুভ
                    }}
                    error={errors.email}
                    required
                    className="w-full rounded-sm border-neutral-400 focus:border-amber-500 text-sm py-1 px-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-0.5">
                    {/* ইনপুটের ডিফল্ট লেবেল থাকলে ঠিক আছে, নয়তো কাস্টম ডিজাইন লিংক */}
                  </div>
                  <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      clearError('password'); // 💡 ফিক্সড: এরর কি-ওয়ার্ড রিমুভ
                    }}
                    error={errors.password}
                    required
                    className="w-full rounded-sm border-neutral-400 focus:border-amber-500 text-sm py-1 px-2"
                  />
                </div>

                {/* 💡 পয়েন্ট ৪ & ৮: অ্যাক্সেসিবিলিটি আইডি ও Controlled চেকবক্স স্টেট */}
                <div className="flex items-center justify-between pt-1">
                  <label htmlFor="remember-me-checkbox" className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                      id="remember-me-checkbox" 
                      type="checkbox" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-3.5 h-3.5 border-neutral-400 rounded-sm text-amber-500 focus:ring-amber-500 cursor-pointer" 
                    />
                    <span className="text-xs text-neutral-800">Keep me signed in</span>
                  </label>
                  
                  <Link href="/forgot-password" className="text-xs text-[#007185] hover:text-[#c45500] hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Amazon Yellow Sign In Button */}
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  size="md"
                  isLoading={isLoading}
                  className="w-full py-1.5 bg-[#ffd814] hover:bg-[#f7ca00] border border-[#a88734] rounded-sm text-sm font-normal text-neutral-950 shadow-sm transition-all active:scale-[0.99]"
                >
                  Sign In
                </Button>
              </form>

              {/* Amazon Style Registration Banner inside/below */}
              <div className="mt-5 pt-4 border-t border-neutral-200 text-center">
                <p className="text-xs text-neutral-600 mb-3">New to EStore?</p>
                <Link href="/auth/register" className="w-full block">
                  <button className="w-full py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-400 rounded-sm text-xs text-neutral-900 shadow-sm transition-all">
                    Create your EStore account
                  </button>
                </Link>
              </div>
            </CardBody>
          </Card>

          <p className="text-[11px] text-neutral-600 mt-5 leading-normal text-center">
            By continuing, you agree to EStore's{' '}
            <Link href="/terms" className="text-[#007185] hover:underline">Conditions of Use</Link> and{' '}
            <Link href="/privacy" className="text-[#007185] hover:underline">Privacy Notice</Link>.
          </p>
        </div>
      </main>

      <Footer />
    </>
  );
}