import React from 'react';
import { Share2, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-surface-low border-t border-brand-surface-normal w-full py-16 px-6 md:px-12">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="text-xl font-black text-brand-on-surface font-h uppercase">KITBAY</div>
          <p className="font-h text-sm leading-relaxed text-brand-on-surface-variant max-w-sm">
            Premium sports performance apparel. Engineered for the athletes of tomorrow, available for the fans of today.
          </p>
          <div className="flex gap-4">
            {[Share2, Globe, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-on-surface-variant hover:text-brand-primary shadow-sm transition-all">
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="font-sans font-bold text-sm mb-4 uppercase tracking-widest text-brand-on-surface">Quick Links</h4>
            <ul className="space-y-2">
              {['About Us', 'Shipping & Returns', 'Size Guide'].map(link => (
                <li key={link}><a className="text-brand-on-surface-variant hover:text-brand-primary transition-all font-h text-sm" href="#">{link}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-sans font-bold text-sm mb-4 uppercase tracking-widest text-brand-on-surface">Support</h4>
            <ul className="space-y-2">
              {['Contact', 'Privacy Policy'].map(link => (
                <li key={link}><a className="text-brand-on-surface-variant hover:text-brand-primary transition-all font-h text-sm" href="#">{link}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto mt-16 pt-8 border-t border-brand-surface-normal text-center">
        <p className="font-h text-sm text-brand-on-surface-variant">© 2026 KITBAY Sports Performance. Engineered for the fans.</p>
      </div>
    </footer>
  );
}
