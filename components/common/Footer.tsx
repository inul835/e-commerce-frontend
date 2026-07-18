'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // স্ক্রোলের একদম উপরে স্মুথলি যাওয়ার ফাংশন
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    /* 🏛️ Modern Minimalist Amazon Dark Footer Layout */
    <footer className="w-full bg-[#1e2630] text-gray-300 font-sans antialiased mt-24 border-t border-gray-800">
      
      {/* ⬆️ Amazon Signature Smooth "Back to top" Action Button */}
      <button 
        onClick={scrollToTop}
        className="w-full bg-[#2a3644] hover:bg-[#313f50] text-gray-200 hover:text-white text-xs font-bold py-4 text-center tracking-wide transition-all duration-200 cursor-pointer border-b border-gray-800/50"
      >
        Back to top
      </button>

      {/* Footer Content Grid */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 items-start">
          
          {/* Section 1: Brand Info */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-widest text-amber-500">
              Get to Know Us
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed font-medium max-w-xs">
              Your trusted online marketplace for premium products. Delivering exceptional essentials and quality curated precisely for your daily lifestyle.
            </p>
          </div>

          {/* Section 2: Shop Links */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-widest text-amber-500">
              Shop with Us
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Categories', href: '/categories' },
                { label: 'Sale Discounts', href: '/sale' },
                { label: 'New Arrivals', href: '/new-arrivals' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white hover:underline transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Support Links */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-widest text-amber-500">
              Let Us Help You
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { label: 'Help Center', href: '/help' },
                { label: 'Contact Support', href: '/contact' },
                { label: 'Shipping Logistics', href: '/shipping' },
                { label: 'Returns & Replacements', href: '/returns' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white hover:underline transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Legal & Policies */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-xs uppercase tracking-widest text-amber-500">
              EStore Policy
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Cookie Preferences', href: '/cookies' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-gray-400 hover:text-white hover:underline transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 🏛️ Amazon Bottom Deep Dark Sub-Footer (#11161e) */}
      <div className="bg-[#11161e] py-10 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center space-y-5">
          
          {/* Slick Minimal Logo */}
          <Link href="/" className="text-base font-black tracking-tight text-white select-none">
            EStore<span className="text-[#febd69] font-extrabold">.app</span>
          </Link>

          {/* Legal Disclosures & Copyright Wrap */}
          <div className="flex flex-col items-center space-y-3 text-[11px] font-medium text-gray-500">
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 text-gray-400">
              <Link href="/terms" className="hover:underline hover:text-amber-500 transition-colors">Conditions of Use</Link>
              <Link href="/privacy" className="hover:underline hover:text-amber-500 transition-colors">Privacy Notice</Link>
              <Link href="/cookies" className="hover:underline hover:text-amber-500 transition-colors">Consumer Health Privacy Disclosure</Link>
            </div>
            <p className="font-normal text-gray-600 tracking-wide text-center pt-2">
              &copy; 1996-{currentYear}, EStore.com, Inc. or its affiliates. All modern rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;