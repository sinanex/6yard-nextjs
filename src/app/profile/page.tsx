"use client";

import React, { useState, useEffect } from 'react';
import { Settings, ShoppingBag, CreditCard, MapPin, Heart, LogOut, ChevronRight, Bell, ShieldCheck, User as UserIcon, Edit2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config';

export default function Profile() {
  const navigate = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate.push('/');
      return;
    }

    fetch(`${API_BASE_URL}/api/users/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setNewName(data.name || '');
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  const handleUpdateName = async () => {
    const token = localStorage.getItem('userToken');
    try {
      const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName })
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsEditingName(false);
      }
    } catch (err) {
      alert("Failed to update name");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  const menuItems = [
    { icon: ShoppingBag, label: 'My Orders', path: '/orders', color: 'text-blue-500' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist', color: 'text-red-500' },
    { icon: MapPin, label: 'Addresses', path: '/cart', color: 'text-orange-500' }, // Redirect to cart for address mgmt for now
    { icon: Settings, label: 'Settings', path: '/profile', color: 'text-zinc-500' },
  ];

  return (
    <div className="min-h-screen bg-brand-surface pt-24 pb-40">
      <main className="max-w-2xl mx-auto px-6">
        {/* Profile Card */}
        <section className="bg-white rounded-[40px] p-10 shadow-2xl shadow-brand-primary/10 border border-brand-surface-normal mb-10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-brand-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />

          <div className="flex flex-col items-center text-center relative z-10">
            {/* Profile Image removed as per "venda" request */}
            <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center mb-6 text-brand-primary">
              <UserIcon size={48} />
            </div>

            {isEditingName ? (
              <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-4 py-3 bg-brand-surface border border-brand-surface-normal rounded-xl text-center font-h text-xl font-bold"
                  placeholder="Enter your name"
                  autoFocus
                />
                <div className="flex gap-2 w-full">
                  <button onClick={handleUpdateName} className="flex-1 bg-brand-primary text-white py-2 rounded-lg font-sans font-bold text-xs uppercase tracking-widest">Save</button>
                  <button onClick={() => setIsEditingName(false)} className="flex-1 bg-brand-surface-low text-brand-on-surface-variant py-2 rounded-lg font-sans font-bold text-xs uppercase tracking-widest">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <h2 className="font-h text-3xl font-black text-brand-on-surface mb-1">
                    {user?.name || 'Set Name'}
                  </h2>
                  <button onClick={() => setIsEditingName(true)} className="p-1.5 hover:bg-brand-surface-low rounded-lg transition-colors text-brand-primary">
                    <Edit2 size={16} />
                  </button>
                </div>
                <p className="font-sans text-brand-on-surface-variant text-sm font-medium opacity-60">
                  +91 {user?.phone}
                </p>
              </>
            )}
            <p className="font-sans text-[10px] uppercase font-black text-brand-primary tracking-[0.2em] mt-4 bg-brand-primary/5 px-4 py-1.5 rounded-full">
              Elite Member
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-10">
            <div className="text-center p-4 bg-brand-surface-low rounded-2xl">
              <p className="font-h text-xl font-bold text-brand-on-surface">{user?.cart?.length || 0}</p>
              <p className="font-sans text-[10px] uppercase font-black text-brand-on-surface-variant tracking-widest opacity-40">Cart Items</p>
            </div>
            <div className="text-center p-4 bg-brand-surface-low rounded-2xl">
              <p className="font-h text-xl font-bold text-brand-on-surface">{user?.addresses?.length || 0}</p>
              <p className="font-sans text-[10px] uppercase font-black text-brand-on-surface-variant tracking-widest opacity-40">Addresses</p>
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <section className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-brand-surface-normal">
          <div className="divide-y divide-brand-surface-normal">
            {menuItems.map((item, idx) => (
              <Link
                key={item.label}
                href={item.path}
                className="flex items-center justify-between p-6 hover:bg-brand-surface-low transition-all group"
              >
                <div className="flex items-center gap-5">
                  <div className={cn("w-12 h-12 rounded-2xl bg-brand-surface-low flex items-center justify-center transition-all group-hover:scale-110 font-bold", item.color)}>
                    <item.icon size={22} />
                  </div>
                  <span className="font-h text-lg font-bold text-brand-on-surface">{item.label}</span>
                </div>
                <ChevronRight size={20} className="text-brand-on-surface-variant opacity-40 group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </section>

        <button
          onClick={handleLogout}
          className="w-full mt-10 p-6 flex items-center justify-center gap-3 bg-red-50 text-red-600 rounded-3xl font-h font-bold hover:bg-red-100 transition-all border border-red-100 active:scale-95"
        >
          <LogOut size={22} />
          Sign Out
        </button>
      </main>
    </div>
  );
}
