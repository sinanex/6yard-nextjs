"use client";

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Circle, Truck, MapPin, PackageCheck, Phone, MessageSquare, ChevronRight, ShoppingBag, Package, PartyPopper } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config';

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

function formatDateRange(from: Date, to: Date): string {
  if (from.getMonth() === to.getMonth()) {
    return `${formatDate(from)} - ${to.getDate()}`;
  }
  return `${formatDate(from)} - ${formatDate(to)}`;
}

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = React.useState<any>(null);
  const [settings, setSettings] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token || !id) return;

    Promise.all([
      fetch(`${API_BASE_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()),
      fetch(`${API_BASE_URL}/api/settings`).then(res => res.json())
    ])
      .then(([orderData, settingsData]) => {
        setOrder(orderData);
        setSettings(settingsData);
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

  // Calculate dates from order createdAt using settings
  const purchasedDate = new Date(order.createdAt || Date.now());
  const procFrom = settings?.processingTimeFrom ?? 2;
  const procTo = settings?.processingTimeTo ?? 4;
  const delFrom = settings?.deliveryTimeFrom ?? 5;
  const delTo = settings?.deliveryTimeTo ?? 7;

  const processingStart = addDays(purchasedDate, 1);
  const processingEnd = addDays(purchasedDate, procTo);
  const deliveryStart = addDays(purchasedDate, delFrom);
  const deliveryEnd = addDays(purchasedDate, delTo);

  const currentStatus = order.status?.toLowerCase() || 'pending';
  const isPurchased = true;
  const isProcessing = ['processing', 'shipped', 'delivered'].includes(currentStatus);
  const isDelivered = currentStatus === 'delivered';

  const timeline = [
    {
      icon: <ShoppingBag size={26} strokeWidth={2.5} />,
      label: 'Purchased',
      dateStr: formatDate(purchasedDate),
      completed: isPurchased,
      active: !isProcessing,
    },
    {
      icon: <Package size={26} strokeWidth={2.5} />,
      label: 'Processing',
      dateStr: formatDateRange(processingStart, processingEnd),
      completed: isProcessing,
      active: isProcessing && !isDelivered,
    },
    {
      icon: <PartyPopper size={26} strokeWidth={2.5} />,
      label: 'Delivered',
      dateStr: isDelivered ? formatDate(new Date(order.updatedAt)) : formatDateRange(deliveryStart, deliveryEnd),
      completed: isDelivered,
      active: false,
    },
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
          <section className="bg-brand-on-surface text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
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
                    <p className="font-h font-bold text-lg">{formatDateRange(deliveryStart, deliveryEnd)}</p>
                  </div>
                </div>
              </div>
              <div className="self-end text-right">
                <p className="font-sans text-xs text-white/80 mb-2 font-bold tracking-widest uppercase">Order ID: {order._id?.slice(-8).toUpperCase()}</p>
                <div className="bg-white/10 px-4 py-3 rounded-xl border border-white/20 mt-4">
                  <p className="font-sans text-[10px] text-white/60 uppercase tracking-widest font-bold mb-1">
                    {order.paymentMethod === 'cod' ? 'To Pay on Delivery' : 'Paid Online'}
                  </p>
                  <p className="font-h text-2xl font-black text-white">
                    ₹{order.paymentMethod === 'cod' ? (order.totalAmount - (order.advancePaid || 60)).toFixed(2) : order.totalAmount?.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Items Section */}
          <section className="bg-white rounded-[32px] p-8 shadow-xl border border-brand-surface-normal">
            <h3 className="font-h text-2xl font-bold mb-8">Items in Order</h3>
            <div className="space-y-4">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-5 items-center p-4 bg-brand-surface-low rounded-2xl border border-brand-surface-normal">
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

          {/* Delivery Timeline */}
          <section className="bg-white rounded-[32px] p-8 shadow-xl border border-brand-surface-normal">
            <h3 className="font-h text-2xl font-bold mb-10">Delivery Timeline</h3>
            <div className="flex flex-col gap-0 relative">
              {/* Connector line */}
              <div className="absolute left-8 top-8 bottom-8 w-0.5 bg-brand-surface-normal rounded-full z-0" />

              {timeline.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex gap-6 pb-10 last:pb-0 relative z-10"
                >
                  {/* Icon circle */}
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all",
                    step.completed
                      ? "bg-brand-primary text-white"
                      : "bg-brand-surface-low text-brand-on-surface-variant border-2 border-brand-surface-normal opacity-50",
                    step.active && "ring-8 ring-brand-primary/10 animate-pulse"
                  )}>
                    {step.completed ? <Check size={28} strokeWidth={3} /> : step.icon}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col justify-center">
                    <p className={cn(
                      "font-sans text-[10px] uppercase tracking-widest font-black mb-1",
                      step.completed ? "text-brand-primary" : "text-brand-on-surface-variant opacity-40"
                    )}>
                      {step.dateStr}
                    </p>
                    <h4 className={cn(
                      "font-h text-xl font-bold",
                      step.completed ? "text-brand-on-surface" : "text-brand-on-surface-variant opacity-40"
                    )}>
                      {step.label}
                    </h4>
                    {step.active && (
                      <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-ping inline-block" />
                        In Progress
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>

        {/* Support Sidebar */}
        <aside className="lg:col-span-4 space-y-8">
          <section className="bg-white p-8 rounded-[32px] border border-brand-surface-normal shadow-xl">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full bg-brand-surface-low flex items-center justify-center text-brand-primary mb-6">
                <Phone size={32} />
              </div>
              <h3 className="font-h text-xl font-bold mb-2">Need Help?</h3>
              <p className="font-sans text-sm text-brand-on-surface-variant opacity-60 leading-relaxed mb-8">
                Our support team is available for delivery inquiries.
              </p>
              <div className="w-full space-y-3">
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25D366] text-white py-4 rounded-xl font-sans font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-sm uppercase tracking-widest shadow-xl"
                >
                  <MessageSquare size={18} />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </section>

          <section className="bg-brand-surface-low p-6 rounded-[32px] border border-brand-surface-normal">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm text-brand-primary shrink-0">
                <MapPin size={22} />
              </div>
              <div>
                <p className="font-sans font-black text-[10px] uppercase tracking-widest text-brand-on-surface-variant opacity-60 mb-1">Delivery Address</p>
                <p className="font-h font-bold text-brand-on-surface">{order.shippingAddress?.name}</p>
                <p className="font-sans text-xs text-brand-on-surface-variant mt-1 leading-relaxed">
                  {order.shippingAddress?.address}, {order.shippingAddress?.locality}, {order.shippingAddress?.city} - {order.shippingAddress?.pincode}
                </p>
              </div>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}
