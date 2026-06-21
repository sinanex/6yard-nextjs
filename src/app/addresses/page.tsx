"use client";

import React from 'react';
import { MapPin, Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import {  } from 'next/navigation';
import Link from 'next/link';

export default function ShippingAddresses() {
  const addresses = [
    { id: 1, name: 'John Doe', default: true, line1: '123 Sporty Way', line2: 'Apt 4B', city: 'Los Angeles', state: 'California', zip: '90210' },
    { id: 2, name: 'Jane Smith', default: false, line1: '456 Marathon Drive', city: 'New York', state: 'NY', zip: '10001' },
  ];

  return (
    <div className="min-h-screen bg-brand-surface pt-24 pb-40">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-brand-surface-normal flex justify-between items-center px-6 h-16">
        <div className="flex items-center gap-4">
          <Link href="/profile" className="p-2 -ml-2 hover:bg-brand-surface-low rounded-full transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="font-h font-bold text-lg">Shipping Addresses</h1>
        </div>
        <button className="text-brand-primary p-2 hover:bg-brand-surface-low rounded-full transition-all">
          <Plus size={24} />
        </button>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-12">
        <section className="space-y-6">
          <h2 className="font-h text-2xl font-bold flex items-center justify-between">
            Saved Addresses
            <span className="text-[10px] font-sans font-black uppercase text-brand-on-surface-variant opacity-40">2 Saved</span>
          </h2>

          <div className="grid gap-6">
            {addresses.map((addr) => (
              <motion.div 
                key={addr.id}
                className="group relative bg-white rounded-3xl p-8 shadow-xl shadow-brand-primary/5 border border-transparent hover:border-brand-primary/20 transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <span className="font-h text-xl font-bold">{addr.name}</span>
                    {addr.default && (
                      <span className="bg-brand-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-brand-on-surface-variant hover:text-brand-primary hover:bg-brand-surface-low rounded-lg transition-all">
                      <Edit size={18} />
                    </button>
                    <button className="p-2 text-brand-on-surface-variant hover:text-red-500 hover:bg-brand-surface-low rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                
                <div className="space-y-1 font-sans text-brand-on-surface-variant opacity-80 leading-relaxed">
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>{addr.city}, {addr.state} {addr.zip}</p>
                  <p>United States</p>
                </div>

                {!addr.default && (
                  <button className="mt-8 font-sans font-black text-xs text-brand-primary uppercase tracking-[0.2em] hover:opacity-70 transition-opacity flex items-center gap-2">
                    Set as Default
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        <section className="bg-white p-10 rounded-[32px] shadow-2xl shadow-brand-primary/5 border border-brand-surface-normal">
          <h3 className="font-h text-[32px] font-bold mb-10 text-brand-on-surface">
            Add New Address
          </h3>
          <form className="space-y-8 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-sans font-black uppercase text-brand-on-surface-variant opacity-40 tracking-widest">Full Name</label>
                <input className="w-full bg-brand-surface-low border-2 border-transparent px-6 py-4 rounded-xl focus:border-brand-primary outline-none transition-all" placeholder="e.g. Michael Jordan" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-sans font-black uppercase text-brand-on-surface-variant opacity-40 tracking-widest">Country</label>
                <select className="w-full bg-brand-surface-low border-2 border-transparent px-6 py-4 rounded-xl focus:border-brand-primary outline-none transition-all appearance-none cursor-pointer">
                  <option>United States</option>
                  <option>Canada</option>
                  <option>UK</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-sans font-black uppercase text-brand-on-surface-variant opacity-40 tracking-widest">Street Address</label>
              <input className="w-full bg-brand-surface-low border-2 border-transparent px-6 py-4 rounded-xl focus:border-brand-primary outline-none transition-all" placeholder="123 Athletic Blvd" />
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-sans font-black uppercase text-brand-on-surface-variant opacity-40 tracking-widest">City</label>
                <input className="w-full bg-brand-surface-low border-2 border-transparent px-6 py-4 rounded-xl focus:border-brand-primary outline-none transition-all" placeholder="San Francisco" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-sans font-black uppercase text-brand-on-surface-variant opacity-40 tracking-widest">State</label>
                  <input className="w-full bg-brand-surface-low border-2 border-transparent px-6 py-4 rounded-xl focus:border-brand-primary outline-none transition-all" placeholder="CA" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-sans font-black uppercase text-brand-on-surface-variant opacity-40 tracking-widest">Zip</label>
                  <input className="w-full bg-brand-surface-low border-2 border-transparent px-6 py-4 rounded-xl focus:border-brand-primary outline-none transition-all" placeholder="94103" />
                </div>
              </div>
            </div>

            <div className="pt-10 flex flex-col md:flex-row gap-4">
              <button type="button" className="flex-1 bg-brand-on-surface text-white py-6 rounded-2xl font-sans font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
                Save Address
              </button>
              <button type="button" className="flex-1 border-2 border-brand-surface-normal py-6 rounded-2xl font-sans font-bold uppercase tracking-widest hover:bg-brand-surface-low transition-all">
                Cancel
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
