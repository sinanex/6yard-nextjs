"use client";

import React from 'react';
import { ArrowLeft, Bell, Lock, User, Eye, Moon, Globe, ChevronRight } from 'lucide-react';
import {  } from 'next/navigation';
import Link from 'next/link';

export default function Settings() {
  const sections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', value: 'Alex Thompson' },
        { icon: Lock, label: 'Security & Password', value: 'Updated 2mo ago' },
        { icon: Globe, label: 'Language', value: 'English (US)' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Push Notifications', value: 'On' },
        { icon: Eye, label: 'Privacy Policy', value: '' },
        { icon: Moon, label: 'Dark Mode', value: 'Off' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-brand-surface pt-24 pb-40">
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-brand-surface-normal flex items-center px-6 h-16">
        <Link href="/profile" className="p-2 -ml-2 text-brand-on-surface hover:bg-brand-surface-low rounded-full transition-colors">
          <ArrowLeft size={24} />
        </Link>
        <h1 className="font-h font-bold text-lg ml-2">Settings</h1>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        <div className="space-y-12">
          {sections.map(section => (
            <div key={section.title}>
              <h2 className="font-sans font-black text-[10px] uppercase tracking-[0.4em] text-brand-on-surface-variant opacity-40 mb-6 ml-4">{section.title}</h2>
              <div className="bg-white rounded-[32px] overflow-hidden shadow-xl border border-brand-surface-normal divide-y divide-brand-surface-normal">
                {section.items.map(item => (
                  <button key={item.label} className="w-full flex items-center justify-between p-6 hover:bg-brand-surface-low transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-brand-surface-low flex items-center justify-center text-brand-on-surface-variant group-hover:scale-110 transition-transform">
                        <item.icon size={22} />
                      </div>
                      <div className="text-left">
                        <p className="font-h text-lg font-bold text-brand-on-surface">{item.label}</p>
                        {item.value && <p className="font-sans text-xs text-brand-on-surface-variant opacity-60 mt-0.5">{item.value}</p>}
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-brand-on-surface-variant opacity-40 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          <section className="bg-red-50 p-8 rounded-[32px] border border-red-100">
            <h3 className="font-h text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
            <p className="font-sans text-sm text-red-600/70 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
            <button className="bg-red-600 text-white px-8 py-4 rounded-xl font-sans font-bold text-sm uppercase tracking-widest hover:bg-red-700 transition-colors shadow-lg active:scale-95 transition-all">
              Delete Account
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
