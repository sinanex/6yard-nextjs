"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Shield, Star, Trophy, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import { Product } from '@/types';
import { API_BASE_URL } from '@/config';
import AuthModal from '@/components/AuthModal';
import heroBanner from '@/assets/Football_players_running_in_stadium_202605072331.jpeg';
import { ShoppingBag, CheckCircle2, X } from 'lucide-react';

const CATEGORIES = [
  { name: 'Football', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD3M0XNWAppH-7lPRBpwI-f42jEnjK4VhDC3SDvwVGOrEKFOis4KnS3PoavF9KZoBO9LqmESMhmdmy41_-Qw61WX-MbOO-xWQ1LqZU7o14O633fPWXMQIEQZ-CUTjUD3CMB9RWszSTGbhvqlUyRQmd8lDPWUdbJoQVdBpp-5tUdKybzhu2hZFmQc7cZ10lDpviS2g4ugkHhZcXCsBKBeaGOSOEOHOsMpEqoy8dFzrMkx5ndQjQdmzL23UlRVTziWllnx6ayTCUAfYs' },
  { name: 'Cricket', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiit6-hdpWv5GVOuZAxMTD2q6UoXSEqyN_sf4zXH9kEbD_RY0c9fKAA9rMMPgMsBNuXCWC95r8CG4E1vQYHrH91Ny5fQlh_4yK7o8v3ghYDrLI88C2rIWyd536-UFbN3DbrjEgN8gy6xXgwroq68GS8fH4kzAQ5cP7OT6ONI3rGKrvzyAuHoeGOYxaz6T-OmZBjHGXxATLW44PDlCSBLnrBbc1fyqWmECUzIM8cge_shXzwo5JSS4H3CDqCB8uuU6_yEsWViCQ0H4' },
  { name: 'Training', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8O6sTL0mNikL0jsTkIPZ_0pGyWpJeXz8hJ6w-wio_1FbMbxSxck6RZ2sDuLadOq1IygGK5aDbxCxSF0AUXT4Z0otq7r7dQXcmiuA-X4rWuSqk8eeRUadQ2U-LGHATvIejT3fOSKUE6uDRnRUwz2qnt4wwjrJpq-6F7cmvc7gMsOMPq39leNcMT6cSCdkGrXxtVxT-zBiQFgQeGpSFLLW-LMS7S_-_AfrQPxKxmFrCY454DUKWRbVN-3zmkCA7acYXVA-w1f2dZ44' },
  { name: 'Accessories', image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-l-RNx0nkHFnH56uxGjh2Ph8iCi0Kv_1w1bXTuH3EHIyQNX9u331kfd4igKEkGwkUJ6E5QBVIs8OgF7a9RgSzU4dJ2AoXcwleJTfkeblNS9bRyiZUAQB4G5iz3Tt5jXloTYIqO9OHu2mNxUY9KCDt8Mna1BMgywTgLqBK6JJHbkWusWPq18rYJNiTR6TwylQDLUmm3tiYoP3nX_kx2_8P4w3Nd7l5XrgmbbugMYhtqNL-z9sD9117m7wahj_CQLh1UBUyRuWH35E' },
];



export default function Home() {
  const navigate = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [banners, setBanners] = useState<any[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [showSpinUpMessage, setShowSpinUpMessage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [isAddingBulk, setIsAddingBulk] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const timer = setTimeout(() => {
      if (active) {
        setShowSpinUpMessage(true);
      }
    }, 5000);

    fetch(`${API_BASE_URL}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (active && Array.isArray(data)) {
          setProducts(data);
        }
      })
      .catch(err => console.error("Error fetching products:", err))
      .finally(() => {
        if (active) {
          setLoading(false);
          setShowSpinUpMessage(false);
          clearTimeout(timer);
        }
      });

    fetch(`${API_BASE_URL}/api/banner`)
      .then(res => res.json())
      .then(data => {
        if (active && Array.isArray(data)) setBanners(data);
      })
      .catch(err => console.error("Error fetching banners:", err));

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, []);

  // Carousel Auto-play
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  const toggleSelection = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkAdd = async () => {
    if (selectedProductIds.length === 0) return;
    
    const token = localStorage.getItem('userToken');
    if (!token) {
      setPendingAction(() => handleBulkAdd);
      setIsAuthModalOpen(true);
      return;
    }

    setIsAddingBulk(true);
    try {
      const items = selectedProductIds.map(id => ({ productId: id, size: 'M', quantity: 1 }));
      const response = await fetch(`${API_BASE_URL}/api/users/cart/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ items })
      });
      
      if (response.ok) {
        navigate.push('/cart');
      } else {
        alert("Failed to add items to cart");
      }
    } catch (err) {
      alert("Connection error");
    } finally {
      setIsAddingBulk(false);
    }
  };

  const handleQuickAdd = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem('userToken');
    if (!token) {
      setPendingAction(() => () => handleQuickAdd(e, product));
      setIsAuthModalOpen(true);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/users/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id, size: 'M', quantity: 1 })
      });
      
      if (response.ok) {
        navigate.push('/cart');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="pt-20">
      <>
        <title>KITBAY STORE | Best Football Jersey Store in Manjeri, Malappuram, Calicut</title>
        <meta name="description" content="Discover premium football kits, customized jerseys, training tees, and sports accessories at KITBAY STORE. Your ultimate soccer jersey shop serving Manjeri, Malappuram, Kottakkal, Tirur, and Calicut." />
        <meta name="keywords" content="jersey store in manjeri, football jersey shop malappuram, jersey shop in kottakkal, sports wear tirur, calicut football jersey store, customized jersey malappuram, soccer shop kerala, kitbay store, football kits kerala" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="KITBAY STORE | Best Football Jersey Store in Manjeri, Malappuram, Calicut" />
        <meta property="og:description" content="Discover premium football kits, customized jerseys, training tees, and sports accessories at KITBAY STORE. Your ultimate soccer jersey shop serving Manjeri, Malappuram, Kottakkal, Tirur, and Calicut." />
        <meta property="og:image" content="https://lh3.googleusercontent.com/aida-public/AB6AXuBPYEM2U14uueDizRlPyp99Sb1S81WoF0IvYasAtfasqSoVE6URbi1Qk3evzTKtihr4pXEx-6VO7iQmkWpiFXXKYhagpgBsMOMGcNscOcoWI6gjh3-5qjizJ4lf8ToZzfNMAXDAzO2R4mTfkT4K-LPorNkLtnfWrr6LQ0oRMIp6ARhxD3vV3Ovc69KsblSSByd8YDRx0mN6yms3vj_nxMvdJfqnWqWmsZOqREY-HBr0bQqUQuqosFvQYQ559OLkzExmk9uhoRFwpFE" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="KITBAY STORE | Best Football Jersey Store in Manjeri, Malappuram, Calicut" />
        <meta name="twitter:description" content="Discover premium football kits, customized jerseys, training tees, and sports accessories at KITBAY STORE. Your ultimate soccer jersey shop serving Manjeri, Malappuram, Kottakkal, Tirur, and Calicut." />
      </>

      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[870px] w-full overflow-hidden bg-black">
        <AnimatePresence mode="popLayout" initial={false}>
          {banners.length > 0 && (
            <motion.div
              key={currentBannerIndex}
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.5 }
              }}
              className="absolute inset-0"
            >
              <img
                className="w-full h-full object-cover"
                src={banners[currentBannerIndex]?.imageUrl || heroBanner}
                alt="Sports hero"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end px-6 md:px-12 pb-32 max-w-[1280px] mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="max-w-3xl"
                >
                  <h1 className="font-h text-white mb-6 text-[44px] md:text-[72px] leading-[1] font-black uppercase italic tracking-tighter">
                    {banners[currentBannerIndex]?.title || 'Wear Your Passion'}
                  </h1>
                  <p className="font-sans text-lg md:text-xl text-white/70 mb-10 max-w-xl leading-relaxed">
                    {banners[currentBannerIndex]?.subtitle || 'Experience the game in peak performance gear. Engineered for the fans, designed for the pros.'}
                  </p>
                  <button 
                    onClick={() => navigate(banners[currentBannerIndex]?.linkUrl || '/')}
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white px-12 py-5 rounded-2xl font-sans font-bold uppercase tracking-[0.2em] text-xs transition-all hover:scale-[1.05] shadow-2xl shadow-brand-primary/40 cursor-pointer active:scale-95"
                  >
                    {banners[currentBannerIndex]?.buttonText || 'Shop Now'}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Carousel Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  currentBannerIndex === idx ? "w-12 bg-brand-primary" : "w-3 bg-white/30 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        )}
      </section>

      <section className="py-20 px-6 md:px-12 max-w-[1280px] mx-auto">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              className="group cursor-pointer"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="h-48 rounded-2xl overflow-hidden mb-4 bg-brand-surface-normal shadow-sm group-hover:shadow-md transition-all">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  src={cat.image}
                  alt={cat.name}
                />
              </div>
              <p className="font-h text-xl font-semibold text-center group-hover:text-brand-primary transition-colors">{cat.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Drops */}
      <section className="py-20 bg-brand-surface-lowest">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="font-h text-[32px] font-bold mb-2">Featured Drops</h2>
              <p className="font-sans text-brand-on-surface-variant">The latest arrivals from your favorite clubs.</p>
            </div>
            <a className="text-brand-primary font-bold text-sm uppercase tracking-widest flex items-center gap-2 hover:underline group" href="#">
              View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <AnimatePresence>
            {showSpinUpMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                className="mb-10 overflow-hidden"
              >
                <div className="bg-gradient-to-r from-brand-primary/10 to-amber-500/10 border border-brand-primary/20 rounded-[24px] p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center animate-pulse flex-shrink-0 mt-0.5">
                      <Sparkles size={22} className="text-brand-primary" />
                    </div>
                    <div>
                      <h4 className="font-h text-base font-bold text-brand-primary">Initializing Secure Cloud Connection...</h4>
                      <p className="font-sans text-xs text-brand-on-surface-variant leading-relaxed mt-1">
                        We are booting up our high-performance secure databases on the cloud.
                        Please wait up to <span className="font-bold text-brand-primary">10-15 seconds</span> for live jersey inventories to sync.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-brand-surface-lowest px-4 py-2.5 rounded-xl border border-brand-surface-normal flex-shrink-0 self-start sm:self-center">
                    <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                    <span className="font-sans text-[10px] font-black text-brand-primary uppercase tracking-[0.15em]">Spinning up servers...</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {loading ? (
              // Beautiful Animated Skeleton Cards (4 Items)
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-3xl border border-brand-surface-normal p-4 space-y-4 animate-pulse">
                  {/* Image skeleton */}
                  <div className="aspect-[3/4] bg-brand-surface-normal/40 rounded-2xl w-full" />
                  {/* Category skeleton */}
                  <div className="h-3.5 bg-brand-surface-normal/50 rounded-full w-1/3" />
                  {/* Name skeleton */}
                  <div className="space-y-2">
                    <div className="h-5 bg-brand-surface-normal/60 rounded-full w-11/12" />
                    <div className="h-5 bg-brand-surface-normal/60 rounded-full w-2/3" />
                  </div>
                  {/* Price & Action skeleton */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-6 bg-brand-surface-normal/70 rounded-full w-1/4" />
                    <div className="h-10 w-10 bg-brand-surface-normal/70 rounded-xl" />
                  </div>
                </div>
              ))
            ) : products.length > 0 ? (
              products.map((product) => {
                const displayPrice = product.discount_price ? product.discount_price : product.price;
                const originalPrice = product.discount_price ? product.price : undefined;
                const mappedProduct: Product = {
                  _id: product._id,
                  id: product._id,
                  name: product.name,
                  category: product.category,
                  price: displayPrice,
                  originalPrice: originalPrice,
                  images: product.images || [],
                  image: product.images?.[0] || 'https://images.unsplash.com/photo-1541002442-9f5985aa8023',
                  isNew: true,
                  isSale: !!product.discount_price
                };
                return (
                  <ProductCard 
                    key={product._id} 
                    product={mappedProduct} 
                    isSelectable={isSelectionMode}
                    isSelected={selectedProductIds.includes(product._id)}
                    onSelect={toggleSelection}
                    onQuickAdd={handleQuickAdd}
                  />
                );
              })
            ) : (
              // Fallback empty state if no products are in the database at all
              <div className="col-span-1 md:col-span-4 flex flex-col items-center justify-center py-16 text-center w-full mx-auto">
                <p className="font-sans text-brand-on-surface-variant font-bold">No products available at the moment.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 mb-10">
          <h2 className="font-h text-[32px] font-bold">Trending Now</h2>
        </div>

        <div className="flex gap-4 md:gap-6 overflow-x-auto pb-10 px-6 md:px-[calc((100vw-min(1280px,100vw-48px))/2)] no-scrollbar scroll-smooth">
          {loading ? (
            // Show loading skeleton cards in horizontal scroll (e.g., 4 items)
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="w-[165px] md:w-[280px] bg-white rounded-2xl md:rounded-3xl border border-brand-surface-normal p-3 md:p-4 space-y-3 md:space-y-4 animate-pulse flex-shrink-0">
                <div className="aspect-[3/4] bg-brand-surface-normal/40 rounded-xl md:rounded-2xl w-full" />
                <div className="h-3 bg-brand-surface-normal/50 rounded-full w-1/3" />
                <div className="space-y-2">
                  <div className="h-4 bg-brand-surface-normal/60 rounded-full w-11/12" />
                  <div className="h-4 bg-brand-surface-normal/60 rounded-full w-2/3" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-5 bg-brand-surface-normal/70 rounded-full w-1/4" />
                  <div className="h-8 w-8 md:h-10 md:w-10 bg-brand-surface-normal/70 rounded-lg md:rounded-xl" />
                </div>
              </div>
            ))
          ) : products.length > 0 ? (
            products.map((product) => {
              const displayPrice = product.discount_price ? product.discount_price : product.price;
              const originalPrice = product.discount_price ? product.price : undefined;
              const mappedProduct: Product = {
                _id: product._id,
                id: product._id,
                name: product.name,
                category: product.category,
                price: displayPrice,
                originalPrice: originalPrice,
                images: product.images || [],
                image: product.images?.[0] || 'https://images.unsplash.com/photo-1541002442-9f5985aa8023',
                isNew: true,
                isSale: !!product.discount_price
              };
              return (
                <div key={product._id} className="w-[165px] md:w-[280px] flex-shrink-0">
                  <ProductCard product={mappedProduct} />
                </div>
              );
            })
          ) : (
            <div className="px-6 py-8 text-center text-brand-on-surface-variant font-sans font-bold w-full">
              No trending products at the moment.
            </div>
          )}
        </div>
      </section>

      {/* Bulk Add Floating Bar */}
      <AnimatePresence>
        {(isSelectionMode || selectedProductIds.length > 0) && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[80] w-[90%] max-w-2xl"
          >
            <div className="bg-black/90 backdrop-blur-xl border border-white/10 rounded-[32px] p-4 shadow-2xl flex items-center justify-between gap-6">
              <div className="flex items-center gap-4 pl-4">
                <button 
                  onClick={() => {
                    setIsSelectionMode(false);
                    setSelectedProductIds([]);
                  }}
                  className="text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
                <div>
                  <p className="text-white font-bold text-sm">{selectedProductIds.length} items selected</p>
                  <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">Select items to add in bulk</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {!isSelectionMode && (
                  <button 
                    onClick={() => setIsSelectionMode(true)}
                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-4 rounded-2xl font-sans font-bold text-[10px] uppercase tracking-widest transition-all"
                  >
                    Select More
                  </button>
                )}
                <button 
                  disabled={selectedProductIds.length === 0 || isAddingBulk}
                  onClick={handleBulkAdd}
                  className="bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-sans font-bold text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl shadow-brand-primary/20"
                >
                  {isAddingBulk ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ShoppingBag size={16} />
                  )}
                  {isAddingBulk ? 'Adding...' : `Add to Cart`}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!isSelectionMode && selectedProductIds.length === 0 && (
        <button 
          onClick={() => setIsSelectionMode(true)}
          className="fixed bottom-10 right-10 z-[80] bg-black text-white p-5 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center gap-3 group"
        >
          <div className="bg-brand-primary p-2 rounded-lg group-hover:rotate-12 transition-transform">
            <CheckCircle2 size={18} />
          </div>
          <span className="font-sans font-bold text-xs uppercase tracking-widest pr-2">Select Multi</span>
        </button>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onSuccess={() => {
          if (pendingAction) pendingAction();
          setPendingAction(null);
        }} 
      />
    </div>
  );
}
