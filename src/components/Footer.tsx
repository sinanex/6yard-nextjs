"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import { Facebook, Instagram } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  
  return (
    <footer className="bg-brand-surface-low border-t border-brand-surface-normal w-full pt-6 pb-4 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
          <div className="text-xl font-black text-brand-on-surface font-h uppercase tracking-widest">6YARD</div>
          
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-on-surface-variant hover:text-[#1877F2] hover:shadow-md transition-all">
              <Facebook size={16} />
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-brand-on-surface-variant hover:text-[#E4405F] hover:shadow-md transition-all">
              <Instagram size={16} />
            </a>
          </div>
        </div>
        
        <div className="flex gap-6 items-center mt-2 md:mt-0">
          <a className="text-brand-on-surface-variant hover:text-brand-primary transition-all font-sans font-bold text-xs uppercase tracking-widest" href="#">Contact</a>
          <a className="text-brand-on-surface-variant hover:text-brand-primary transition-all font-sans font-bold text-xs uppercase tracking-widest" href="#">Privacy Policy</a>
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto mt-4 pt-4 border-t border-brand-surface-normal text-center">
        <p className="font-sans font-medium text-[10px] text-brand-on-surface-variant uppercase tracking-widest">
          &copy; {new Date().getFullYear()} 6YARD
        </p>
      </div>
    </footer>
  );
}
