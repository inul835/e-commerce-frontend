'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  logo?: string;
  cartCount?: number;
  onCartClick?: () => void;
  onSearchSubmit?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({
  logo = '/logo.png',
  cartCount = 0,
  onCartClick,
  onSearchSubmit,
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // 🧠 চেক করছি এটা হোমপেজ কি না
  const isHomePage = pathname === '/';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(searchQuery);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    /* 
      ✨ ম্যাজিক কন্ডিশন: 
      হোমপেজে থাকলে 'absolute bg-transparent' (তোর আগের লাক্সারি লুক)।
      অন্য যেকোনো পেজে গেলে 'relative bg-neutral-950 text-white' যাতে সাদা ব্যাকগ্রাউন্ডের ওপর ওভারল্যাপ না করে!
    */
    <header className={`w-full z-50 transition-all duration-300 ${
      isHomePage 
        ? 'absolute top-0 left-0 right-0 bg-transparent' 
        : 'relative bg-neutral-950 border-b border-neutral-900 shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex items-center justify-between gap-4">
          
          {/* 🟨 বামে লোগো */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-9 h-9 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/10">
              <span className="text-black font-black text-lg">E</span>
            </div>
            <span className="font-bold text-lg text-white group-hover:text-amber-400 transition-colors tracking-tight">
              EStore
            </span>
          </Link>

          {/* 🔍 সার্চ বার */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xs mx-4">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-1.5 bg-white/5 border border-white/10 text-white placeholder-neutral-500 rounded-full text-sm focus:outline-none focus:border-amber-400/50 focus:bg-white/10 transition-all"
              />
              <button type="submit" className="absolute right-3 text-xs text-neutral-400 hover:text-amber-400 transition-colors">
                🔍
              </button>
            </div>
          </form>

          {/* 🧭 নেভিগেশন লিংক */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/products" className="hover:text-white transition-colors">
              Products
            </Link>
            <Link href="/categories" className="hover:text-white transition-colors">
              Categories
            </Link>
            {isAuthenticated && (
              <Link href="/orders" className="hover:text-white transition-colors">
                Account
              </Link>
            )}
          </nav>

          {/* 🔐 বাটন্স */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="flex items-center gap-1.5 px-4 py-2 border border-white/10 rounded-full hover:border-white/20 bg-white/5 text-white text-sm transition-colors"
                >
                  <span>{`Hi, ${user.firstName}`}</span>
                  <span className="text-neutral-500 text-xs">▼</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl py-2 z-50">
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-800"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/auth/register">
                  <button className="px-5 py-2 text-white border border-white/20 rounded-full text-xs font-semibold hover:bg-white/5 hover:border-white/40 transition-all duration-200">
                    Register
                  </button>
                </Link>
                <Link href="/auth/login">
                  <button className="px-5 py-2 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-500 hover:to-yellow-500 text-neutral-950 font-bold rounded-full text-xs shadow-md shadow-amber-500/10 active:scale-95 transition-all duration-200">
                    Sign In
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* 🛒 কার্ট আইকন */}
          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={onCartClick}
              className="relative p-2 hover:bg-white/5 rounded-full text-white transition-colors"
              aria-label="Shopping cart"
            >
              <span className="text-xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-amber-500 text-black font-black text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white hover:text-amber-400 transition-colors"
              aria-label="Menu"
            >
              ☰
            </button>
          </div>

        </div>

        {/* 📱 মোবাইল মেনু */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 bg-neutral-950 border border-neutral-900 rounded-2xl p-4 space-y-3 backdrop-blur-lg">
            <Link href="/" className="block text-neutral-400 hover:text-white py-1 text-sm">
              Home
            </Link>
            <Link href="/products" className="block text-neutral-400 hover:text-white py-1 text-sm">
              Products
            </Link>
            <Link href="/categories" className="block text-neutral-400 hover:text-white py-1 text-sm">
              Categories
            </Link>
            {isAuthenticated && user ? (
              <>
                <Link href="/orders" className="block text-neutral-400 hover:text-white py-1 text-sm">
                  My Orders
                </Link>
                <button type="button" onClick={handleLogout} className="w-full text-left text-red-400 py-1 text-sm">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex gap-2">
                <Link href="/auth/register" className="flex-1">
                  <button className="w-full py-2 border border-white/20 text-white rounded-full text-xs font-semibold">
                    Register
                  </button>
                </Link>
                <Link href="/auth/login" className="flex-1">
                  <button className="w-full py-2 bg-amber-400 text-black font-bold rounded-full text-xs">
                    Sign In
                  </button>
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;