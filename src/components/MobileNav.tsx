import React from 'react';
import { Search, Home, ShoppingBag, User, Heart, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/search' },
    { icon: ShoppingBag, label: 'Cart', path: '/cart' },
    { icon: ReceiptText, label: 'Orders', path: '/orders' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-3 md:hidden bg-white/90 backdrop-blur-lg border-t border-brand-surface-normal z-50 rounded-t-[24px] shadow-[0_-8px_30px_rgb(0,0,0,0.04)]">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.path}
          className={cn(
            "flex flex-col items-center justify-center px-4 py-2 transition-all active:scale-90",
            pathname === item.path
              ? "text-brand-on-surface bg-brand-surface-low rounded-2xl"
              : "text-brand-on-surface-variant"
          )}
        >
          <item.icon size={22} strokeWidth={pathname === item.path ? 2.5 : 2} />
          <span className="font-h text-[10px] font-semibold uppercase tracking-wider mt-1">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
