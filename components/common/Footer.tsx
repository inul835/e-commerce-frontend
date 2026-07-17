'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  // স্মুথলি একদম স্ক্রোলের উপরে যাওয়ার ফাংশন
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    /* 🏛️ Amazon Signature Dark Navy Footer Layout */
    <footer className="w-full bg-[#232f3e] text-neutral-300 font-sans antialiased mt-20">
      
      {/* ⬆️ Amazon Signature "Back to top" Button */}
      <button 
        onClick={scrollToTop}
        className="w-full bg-[#37475a] hover:bg-[#485769] text-white text-xs py-3.5 text-center font-normal transition-colors duration-150 cursor-pointer"
      >
        Back to top
      </button>

      {/* Footer Grid Container */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10 items-start">
          
          {/* Get to Know Us / About */}
          <div className="space-y-3">
            <h3 className="font-bold text-white text-sm tracking-tight">
              Get to Know Us
            </h3>
            <p className="text-neutral-400 text-xs leading-relaxed font-normal max-w-xs">
              Your trusted online marketplace for quality products at competitive prices. Curating hyper-premium essentials.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight mb-3">Shop with Us</h3>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Categories', href: '/categories' },
                { label: 'Sale', href: '/sale' },
                { label: 'New Arrivals', href: '/new-arrivals' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-neutral-300 hover:text-white hover:underline transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight mb-3">Let Us Help You</h3>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Help Center', href: '/help' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Shipping Info', href: '/shipping' },
                { label: 'Returns & Replacements', href: '/returns' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-neutral-300 hover:text-white hover:underline transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Terms */}
          <div>
            <h3 className="font-bold text-white text-sm tracking-tight mb-3">EStore Policy</h3>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Cookie Policy', href: '/cookies' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-neutral-300 hover:text-white hover:underline transition-all">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 🏛️ Amazon Bottom Deep Dark Branding Strip (#131921) */}
      <div className="bg-[#131921] py-8 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center space-y-4">
          
          {/* Logo Brand */}
          <Link href="/" className="text-sm font-black text-white select-none">
            EStore<span className="text-[#febd69]">.app</span>
          </Link>

          {/* Links & Copyright */}
          <div className="flex flex-col items-center space-y-2 text-[11px] text-neutral-400">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <Link href="/terms" className="hover:underline text-neutral-300">Conditions of Use</Link>
              <Link href="/privacy" className="hover:underline text-neutral-300">Privacy Notice</Link>
              <Link href="/cookies" className="hover:underline text-neutral-300">Consumer Health Data Privacy Disclosure</Link>
            </div>
            <p className="font-normal pt-1">&copy; 1996-{currentYear}, EStore.com, Inc. or its affiliates</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;