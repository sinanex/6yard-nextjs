"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Box, Check, Circle, Truck, MapPin, PackageCheck, Phone, MessageSquare, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

import { API_BASE_URL } from '@/config';

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token || !id) return;

    fetch(`${API_BASE_URL}/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrder(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  if (!order || order.message) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center font-h font-bold text-xl">
        Order not found
      </div>
    );
  }

  const steps = [
    { label: 'Order Confirmed', time: 'Oct 20, 11:45 AM', completed: true, active: false },
    { label: 'Processing at Facility', time: 'Oct 21, 09:20 AM', completed: true, active: false },
    { label: 'Shipped via Express', time: 'Oct 22, 02:30 PM', completed: true, active: true },
    { label: 'In Transit', time: 'Estimating...', completed: false, active: false },
    { label: 'Out for Delivery', time: 'Estimating...', completed: false, active: false },
  ];

  return (
    <div className="min-h-screen bg-brand-surface pt-24 pb-40">


      <main className="max-w-4xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {/* Breadcrumbs */}
          <nav className="flex items-center space-x-2 text-xs font-sans text-brand-on-surface-variant mb-4 uppercase tracking-widest">
            <Link className="hover:text-brand-primary transition-colors" href="/">Home</Link>
            <ChevronRight size={14} />
            <Link className="hover:text-brand-primary transition-colors" href="/orders">Orders</Link>
            <ChevronRight size={14} />
            <span className="text-brand-on-surface font-black">Track Order</span>
          </nav>
          {/* Order Snapshot */}
          <section className="bg-brand-on-surface text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
              <div className="space-y-4">
                <span className="font-sans font-black text-[10px] uppercase tracking-[0.3em] opacity-60">Shipment Status</span>
                <h2 className="font-h text-[32px] font-bold leading-tight">{order.status || 'Processing'}</h2>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
                    <Truck size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="font-sans text-xs text-white/60">Estimated Delivery</p>
                    <p className="font-h font-bold text-lg">Within 5-7 Days</p>
                  </div>
                </div>
              </div>
              <div className="self-end text-right">
                <p className="font-sans text-xs text-white/80 mb-2 font-bold tracking-widest uppercase">Order ID: {order._id.slice(-8).toUpperCase()}</p>
                <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/20 mt-4">
                  <p className="font-sans text-[10px] text-white/60 uppercase tracking-widest font-bold mb-1">
                    {order.paymentMethod === 'cod' ? 'To Pay on Delivery' : 'Paid Online'}
                  </p>
                  <p className="font-h text-2xl font-black text-white">
                    ₹{order.paymentMethod === 'cod' ? (order.totalAmount - (order.advancePaid || 60)).toFixed(2) : order.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Items Section */}
          <section className="bg-white rounded-[32px] p-10 shadow-xl border border-brand-surface-normal">
            <h3 className="font-h text-2xl font-bold mb-8">Items in Order</h3>
            <div className="space-y-6">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-6 items-center p-4 bg-brand-surface-low rounded-2xl border border-brand-surface-normal">
                  <div className="w-20 h-24 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm border border-brand-surface-normal/50">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-h text-lg font-bold text-brand-on-surface">{item.name}</h4>
                    <p className="font-sans text-[10px] uppercase tracking-widest font-black text-brand-on-surface-variant opacity-60 mt-1">Size: {item.size} • Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-h font-black text-xl text-brand-primary">₹{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Timeline */}
          <section className="bg-white rounded-[32px] p-10 shadow-xl border border-brand-surface-normal">
            <h3 className="font-h text-2xl font-bold mb-10">Live Updates</h3>
            <div className="space-y-0 relative">
              {/* Connector Line */}
              <div className="absolute left-[29px] top-4 bottom-4 w-1 bg-brand-surface-low rounded-full" />

              {steps.map((step, idx) => (
                <div key={idx} className="flex gap-8 pb-12 last:pb-0 relative">
                  <div className={cn(
                    "w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 z-10 shadow-xl transition-all",
                    step.completed ? "bg-brand-primary text-white" : "bg-white text-brand-surface-dim border-2 border-brand-surface-normal",
                    step.active && "ring-8 ring-brand-primary/10 animate-pulse"
                  )}>
                    {step.completed ? <Check size={28} strokeWidth={3} /> : idx === steps.length - 1 ? <PackageCheck size={28} /> : <Circle size={16} fill="currentColor" />}
                  </div>
                  <div className="flex flex-col justify-center">
                    <h4 className={cn("font-h text-xl font-bold", step.completed ? "text-brand-on-surface" : "text-brand-on-surface-variant opacity-40")}>
                      {step.label}
                    </h4>
                    <p className="font-sans text-sm text-brand-on-surface-variant opacity-60 font-medium">
                      {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Support Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <section className="bg-white p-10 rounded-[32px] border border-brand-surface-normal shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-brand-surface-low flex items-center justify-center text-brand-primary mb-6 shadow-inner">
                <Phone size={32} />
              </div>
              <h3 className="font-h text-xl font-bold mb-2">Need Help?</h3>
              <p className="font-sans text-sm text-brand-on-surface-variant opacity-60 leading-relaxed mb-8">
                Our support team is available 24/7 for delivery inquiries.
              </p>
              <div className="w-full space-y-3">
                <button className="w-full bg-brand-on-surface text-white py-4 rounded-xl font-sans font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest shadow-xl">
                  <MessageSquare size={18} />
                  Live Chat
                </button>
                <button className="w-full border-2 border-brand-surface-normal py-4 rounded-xl font-sans font-bold hover:bg-brand-surface-low transition-all text-sm uppercase tracking-widest">
                  View FAQ
                </button>
              </div>
            </div>
          </section>

          <section className="bg-brand-surface-low p-8 rounded-[32px] border border-brand-surface-normal group cursor-pointer hover:bg-white hover:border-brand-primary/20 transition-all">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-brand-primary">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="font-sans font-black text-[10px] uppercase tracking-widest text-brand-on-surface-variant opacity-60">Delivery Address</p>
                  <p className="font-h font-bold text-brand-on-surface">{order.shippingAddress?.name} • {order.shippingAddress?.pincode}</p>
                  <p className="font-sans text-xs text-brand-on-surface-variant mt-1 line-clamp-2 leading-relaxed">
                    {order.shippingAddress?.address}, {order.shippingAddress?.locality}, {order.shippingAddress?.city}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-brand-on-surface-variant opacity-40 group-hover:translate-x-1 transition-transform" />
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
