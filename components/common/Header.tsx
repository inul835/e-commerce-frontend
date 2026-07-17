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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit?.(searchQuery);
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
  };

  return (
    /* 🏛️ Amazon Classic Dark Navy Header Layout */
    <header className="w-full z-50 bg-[#131921] !bg-[#131921] text-white font-sans antialiased sticky top-0 border-b border-[#232f3e] shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* 🟨 Amazon Style Logo */}
          <Link href="/" className="flex items-center gap-1 group shrink-0 border border-transparent hover:border-white p-1.5 transition-all">
            <span className="font-black text-xl tracking-tight text-white">
              EStore<span className="text-[#febd69] text-sm font-medium">.app</span>
            </span>
          </Link>

          {/* 🔍 Amazon Signature Yellow Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-2">
            <div className="relative w-full flex items-center rounded-md overflow-hidden bg-white focus-within:ring-2 focus-within:ring-amber-500">
              <input
                type="text"
                placeholder="Search EStore..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-2 bg-white text-neutral-900 placeholder-neutral-500 text-sm focus:outline-none"
              />
              {/* 💡 ফিক্সড: ইমোজি বদলে একদম রিয়েলিস্টিক আমাজন স্টাইল SVG আইকন */}
              <button 
                type="submit" 
                className="bg-[#febd69] hover:bg-[#f3a847] text-neutral-900 px-5 h-full flex items-center justify-center transition-colors absolute right-0 top-0 bottom-0 border-l border-neutral-300"
                aria-label="Search"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth="2.5" 
                  stroke="currentColor" 
                  className="w-5 h-5 text-neutral-800"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.602 10.602Z" 
                  />
                </svg>
              </button>
            </div>
          </form>

          {/* 🧭 Links & Navigation */}
          <nav className="hidden md:flex items-center gap-4 text-sm font-bold text-neutral-100">
            <Link href="/" className="text-white font-bold border border-transparent hover:border-white px-2 py-1 transition-all text-xs">
              Home
            </Link>
            <Link href="/products" className="text-neutral-200 hover:text-white border border-transparent hover:border-white px-2 py-1 transition-all text-xs">
              Products
            </Link>
            <Link href="/categories" className="text-neutral-200 hover:text-white border border-transparent hover:border-white px-2 py-1 transition-all text-xs">
              Categories
            </Link>
          </nav>

          {/* 🔐 User Account Dropdown */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="flex flex-col text-left border border-transparent hover:border-white px-2 py-1 transition-all group"
                >
                  <span className="text-[10px] text-neutral-200 font-normal leading-none">{`Hello, ${user.firstName}`}</span>
                  <span className="text-xs font-bold text-white flex items-center gap-0.5 mt-0.5">
                    Account & Lists <span className="text-neutral-400 text-[9px]">▼</span>
                  </span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-44 bg-white border border-neutral-300 rounded-sm shadow-xl py-2 z-50 text-neutral-900">
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-xs hover:bg-neutral-100 hover:text-[#c45500] font-medium"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <div className="border-t border-neutral-200 my-1"></div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-xs text-[#b12704] hover:bg-neutral-100 font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/login" className="flex flex-col text-left border border-transparent hover:border-white px-2 py-1 transition-all">
                <span className="text-[10px] text-neutral-200 font-normal leading-none">Hello, sign in</span>
                <span className="text-xs font-bold text-white mt-0.5">Account & Lists</span>
              </Link>
            )}
          </div>

          {/* 🛒 Amazon Style Basket/Cart Display */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onCartClick}
              className="flex items-end gap-1 border border-transparent hover:border-white px-2 py-1 transition-all text-white relative group"
              aria-label="Shopping cart"
            >
              <div className="relative flex items-center">
                <span className="text-2xl">🛒</span>
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 text-[#f08804] font-bold text-sm">
                  {cartCount}
                </span>
              </div>
              <span className="text-xs font-bold pt-2 hidden sm:inline text-neutral-200 group-hover:text-white">Cart</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1 text-white border border-transparent hover:border-white transition-all text-xl"
              aria-label="Menu"
            >
              ☰
            </button>
          </div>

        </div>

        {/* 📱 Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-3 pb-3 bg-[#131921] border-t border-[#232f3e] pt-3 space-y-2">
            <Link href="/" className="block text-neutral-200 hover:text-[#febd69] text-sm px-2" onClick={() => setMobileMenuOpen(false)}>
              Home
            </Link>
            <Link href="/products" className="block text-neutral-200 hover:text-[#febd69] text-sm px-2" onClick={() => setMobileMenuOpen(false)}>
              Products
            </Link>
            <Link href="/categories" className="block text-neutral-200 hover:text-[#febd69] text-sm px-2" onClick={() => setMobileMenuOpen(false)}>
              Categories
            </Link>
            {isAuthenticated && user ? (
              <>
                <Link href="/orders" className="block text-neutral-200 hover:text-[#febd69] text-sm px-2" onClick={() => setMobileMenuOpen(false)}>
                  My Orders
                </Link>
                <button type="button" onClick={handleLogout} className="w-full text-left text-[#b12704] text-sm px-2 pt-1">
                  Sign Out
                </button>
              </>
            ) : (
              <div className="pt-2 px-2">
                <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-1.5 bg-[#ffd814] text-black font-normal rounded-sm text-xs shadow-sm">
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