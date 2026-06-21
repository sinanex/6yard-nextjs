"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, User, Heart, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '../config';
import { Product } from '../types';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const pathname = usePathname();
  const isProfile = pathname.startsWith('/profile') || pathname.startsWith('/settings') || pathname.startsWith('/orders');
  
  const { totalQuantity } = useCart();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const response = await fetch(`${API_BASE_URL}/api/products/search?q=${searchQuery}`);
          const data = await response.json();
          setSuggestions(data);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-brand-surface-normal bg-white/80 backdrop-blur-xl shadow-sm">
      <nav className="flex justify-between items-center h-20 px-6 md:px-12 max-w-[1280px] mx-auto w-full relative">
        <Link href="/" className="text-2xl font-black tracking-tighter text-brand-on-surface uppercase font-h shrink-0">
          KITBAY
        </Link>

        <nav className="hidden lg:flex items-center gap-8 font-sans text-xs uppercase tracking-[0.15em] font-bold">
        </nav>
        
        <div className="flex items-center gap-4 shrink-0">
          <div className="relative" ref={searchRef}>
            {isSearchOpen ? (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center bg-brand-surface-normal rounded-full px-4 py-2 w-[240px] md:w-[320px] transition-all duration-300 shadow-lg border border-brand-surface-dark">
                <input
                  type="text"
                  autoFocus
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none outline-none w-full text-sm font-medium text-brand-on-surface"
                />
                <button onClick={() => setIsSearchOpen(false)} className="text-brand-on-surface-variant hover:text-brand-primary ml-2">
                  <X size={18} />
                </button>

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full right-0 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-brand-surface-normal overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2 border-b border-brand-surface-normal bg-brand-surface-light">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-on-surface-variant px-2">Suggestions</span>
                    </div>
                    <div className="flex flex-col">
                      {suggestions.map((product) => (
                        <Link
                          key={product._id}
                          href={`/product/${product._id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center gap-3 p-3 hover:bg-brand-surface-normal transition-colors"
                        >
                          <div className="w-12 h-12 bg-brand-surface-normal rounded-lg overflow-hidden flex-shrink-0">
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-brand-on-surface truncate">{product.name}</span>
                            <span className="text-xs text-brand-primary font-bold">₹{product.price}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-brand-on-surface-variant hover:text-brand-primary transition-all active:scale-95"
              >
                <Search size={22} />
              </button>
            )}
          </div>
          <Link href="/cart" className="p-2 text-brand-on-surface-variant hover:text-brand-primary transition-all active:scale-95 relative">
            <ShoppingBag size={22} />
            {totalQuantity > 0 && (
              <span className="absolute top-1 right-1 bg-brand-primary text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {totalQuantity}
              </span>
            )}
          </Link>
          <Link href="/profile" className="p-2 text-brand-on-surface-variant hover:text-brand-primary transition-all active:scale-95">
            <User size={22} />
          </Link>
        </div>
      </nav>
    </header>
  );
}
