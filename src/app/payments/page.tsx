"use client";

import React from 'react';
import { CreditCard, Wallet, Apple, ArrowLeft, ArrowRight, Smartphone } from 'lucide-react';
import {  } from 'next/navigation';
import Link from 'next/link';

export default function PaymentMethod() {
  return (
    <div className="min-h-screen bg-brand-surface pt-24 pb-40">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-brand-surface-normal flex items-center px-6 h-16">
        <Link href="/cart" className="p-2 -ml-2 text-brand-on-surface hover:bg-brand-surface-low rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-h font-bold text-lg ml-2">Payment Method</h1>
      </header>

      <main className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 mt-8">
        <div className="lg:col-span-8 space-y-12">
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-h text-2xl font-bold">Saved Methods</h2>
              <button className="text-brand-primary font-sans font-black text-[10px] tracking-widest uppercase hover:underline">+ Add Card</button>
            </div>

            <div className="grid gap-4">
              {[
                { name: 'Visa Classic', number: '**** 4242', icon: CreditCard, checked: true },
                { name: 'Mastercard Gold', number: '**** 8829', icon: CreditCard, checked: false },
              ].map(card => (
                <label key={card.name} className="flex items-center justify-between p-6 bg-white rounded-2xl border-2 border-transparent has-[:checked]:border-brand-primary shadow-sm hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-10 bg-brand-surface-low flex items-center justify-center rounded-lg text-brand-primary">
                      <card.icon size={22} />
                    </div>
                    <div>
                      <p className="font-h text-lg font-bold text-brand-on-surface">{card.name}</p>
                      <p className="font-sans text-sm text-brand-on-surface-variant font-medium tracking-widest opacity-60">{card.number}</p>
                    </div>
                  </div>
                  <input defaultChecked={card.checked} type="radio" name="payment" className="w-6 h-6 text-brand-primary focus:ring-brand-primary border-brand-surface-normal" />
                </label>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-h text-2xl font-bold mb-8">Digital Wallets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 p-6 bg-white rounded-2xl border-2 border-brand-surface-normal hover:border-brand-primary transition-all active:scale-[0.98] font-sans font-bold shadow-sm">
                <Apple size={22} />
                Apple Pay
              </button>
              <button className="flex items-center justify-center gap-3 p-6 bg-white rounded-2xl border-2 border-brand-surface-normal hover:border-brand-primary transition-all active:scale-[0.98] font-sans font-bold shadow-sm">
                <Smartphone size={22} />
                Google Pay
              </button>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-brand-surface-normal shadow-2xl shadow-brand-primary/5">
            <h3 className="font-h text-xl font-bold mb-8">Total Order</h3>
            <div className="space-y-4 mb-10">
              <div className="flex justify-between items-center text-brand-on-surface-variant">
                <span className="font-sans font-medium">Subtotal</span>
                <span className="font-h font-bold">₹299.00</span>
              </div>
              <div className="flex justify-between items-center text-brand-on-surface-variant">
                <span className="font-sans font-medium">Shipping</span>
                <span className="text-green-600 font-sans font-black text-xs">FREE</span>
              </div>
              <div className="h-px bg-brand-surface-normal my-4" />
              <div className="flex justify-between items-center">
                <span className="font-h text-2xl font-bold">Total</span>
                <span className="font-h text-3xl font-black">₹299.00</span>
              </div>
            </div>

            <Link href="/success" className="block w-full bg-brand-on-surface text-white py-6 rounded-2xl font-sans font-bold text-center uppercase tracking-[0.3em] hover:scale-[1.02] shadow-2xl active:scale-95 transition-all">
              Confirm & Pay
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}
