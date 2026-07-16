'use client';

import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    // ✨ সস্তা গ্রে-ব্ল্যাক থেকে ডিপ প্রিমিয়াম সাইরেন ব্ল্যাক কালার
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-900 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-white text-lg tracking-tight">
              About <span className="text-amber-400">EStore</span>
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed font-normal">
              Your trusted online marketplace for quality products at competitive prices. Curating hyper-premium essentials.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Shop</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'All Products', href: '/products' },
                { label: 'Categories', href: '/categories' },
                { label: 'Sale', href: '/sale' },
                { label: 'New Arrivals', href: '/new-arrivals' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-neutral-400 hover:text-amber-400 transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Support</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Help Center', href: '/help' },
                { label: 'Contact Us', href: '/contact' },
                { label: 'Shipping Info', href: '/shipping' },
                { label: 'Returns', href: '/returns' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-neutral-400 hover:text-amber-400 transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Legal</h3>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms & Conditions', href: '/terms' },
                { label: 'Cookie Policy', href: '/cookies' },
              ].map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-neutral-400 hover:text-amber-400 transition-colors font-medium">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-900 pt-10">
          
          {/* Bottom Branding & Socials */}
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-neutral-500 gap-6">
            <p className="font-medium">&copy; {currentYear} EStore. All rights reserved.</p>
            
            {/* সোশ্যাল আইকন বাটনগুলোকে গ্লোয়িং বর্ডার করা হলো */}
            <div className="flex gap-3">
              {[
                { title: 'Facebook', label: 'f' },
                { title: 'Twitter', label: '𝕏' },
                { title: 'Instagram', label: '📷' },
                { title: 'LinkedIn', label: 'in' },
              ].map((social) => (
                <button 
                  key={social.title}
                  className="w-9 h-9 flex items-center justify-center bg-neutral-900 border border-neutral-800 rounded-full text-neutral-400 hover:text-amber-400 hover:border-amber-400/40 transition-all" 
                  title={social.title}
                >
                  {social.label}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;