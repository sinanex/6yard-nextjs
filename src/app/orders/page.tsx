"use client";

import React from 'react';
import { Package, ChevronRight, ArrowLeft, Filter, Search, Calendar, Truck } from 'lucide-react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Order } from '@/types';

import { API_BASE_URL } from '@/config';

export default function Orders() {
  const [orders, setOrders] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      router.push('/');
      return;
    }

    fetch(`${API_BASE_URL}/api/orders/my-orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [router]);

  return (
    <div className="min-h-screen bg-brand-surface pt-24 pb-40">
      <main className="max-w-[1280px] mx-auto px-6 py-8 md:py-12">
        {/* Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-xs font-sans text-brand-on-surface-variant mb-8 uppercase tracking-widest">
          <Link className="hover:text-brand-primary transition-colors" href="/">Home</Link>
          <ChevronRight size={14} />
          <Link className="hover:text-brand-primary transition-colors" href="/profile">Profile</Link>
          <ChevronRight size={14} />
          <span className="text-brand-on-surface font-black">My Orders</span>
        </nav>

        <div className="flex justify-between items-end mb-10">
          <h1 className="font-h text-[40px] font-bold text-brand-on-surface leading-none uppercase tracking-tight">My Orders</h1>
        </div>

        {/* Search Bar */}
        <div className="relative mb-10 max-w-xl">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-on-surface-variant opacity-40 shrink-0" size={20} />
          <input
            type="text"
            placeholder="Search by order ID or product..."
            className="w-full bg-white border-2 border-brand-surface-normal pl-16 pr-8 py-5 rounded-2xl outline-none focus:border-brand-primary transition-all font-sans"
          />
        </div>

        {/* Order List */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-bold text-brand-on-surface mb-2">No orders found</h2>
            <p className="text-brand-on-surface-variant">Looks like you haven't placed any orders yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {orders.map((order, idx) => {
              const mainItem = order.items?.[0] || {};
              const itemsCount = order.items?.length || 0;
              const dateObj = new Date(order.createdAt);
              const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              return (
                <motion.div
                  key={order._id}
                  className="group bg-white rounded-[32px] p-6 sm:p-8 shadow-xl shadow-brand-primary/5 border border-transparent hover:border-brand-primary/20 transition-all cursor-pointer h-full flex flex-col justify-between"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Link href={`/track/${order._id}`} className="flex flex-col h-full">
                    <div className="flex justify-between items-start mb-8">
                      <div className="space-y-1">
                        <p className="font-h text-xl font-bold text-brand-on-surface">{order._id.slice(-8).toUpperCase()}</p>
                        <div className="flex items-center gap-3 text-brand-on-surface-variant opacity-60 font-sans text-xs font-bold uppercase tracking-widest">
                          <Calendar size={14} />
                          {formattedDate}
                        </div>
                      </div>
                      <div className={cn(
                        "px-4 py-2 rounded-xl font-sans font-black text-[10px] uppercase tracking-widest border",
                        order.status === 'Delivered' ? "bg-green-50 text-green-600 border-green-100" : "bg-blue-50 text-blue-600 border-blue-100"
                      )}>
                        {order.status}
                      </div>
                    </div>

                    <div className="flex gap-6 p-4 bg-brand-surface-low rounded-2xl border border-brand-surface-normal group-hover:bg-brand-surface-high transition-all">
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 shadow-sm">
                        {mainItem.image ? (
                          <img className="w-full h-full object-cover" src={mainItem.image} alt={mainItem.name} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-brand-on-surface-variant">No Image</div>
                        )}
                      </div>
                      <div className="flex flex-col justify-center flex-grow">
                        <h3 className="font-h text-lg font-bold text-brand-on-surface line-clamp-1">{mainItem.name || 'Unknown Product'}</h3>
                        <p className="font-sans text-xs text-brand-on-surface-variant font-medium mt-1">
                          {itemsCount > 1 ? `+ ${itemsCount - 1} other items` : '1 Item'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-center self-stretch">
                        <ChevronRight size={24} className="text-brand-on-surface-variant opacity-40 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-6 border-t border-brand-surface-normal">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-brand-primary">
                          <Truck size={18} />
                          <span className="font-sans text-xs font-black uppercase tracking-widest">
                            {order.status === 'Delivered' ? 'Return available' : 'On the way'}
                          </span>
                        </div>
                        {order.trackingId && (
                          <p className="font-sans text-[10px] font-bold text-brand-on-surface-variant opacity-80 uppercase tracking-widest">
                            Tracking: <span className="text-brand-on-surface select-all">{order.trackingId}</span>
                          </p>
                        )}
                      </div>
                      <p className="font-h text-2xl font-black text-brand-on-surface">
                        ₹{order.totalAmount?.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
