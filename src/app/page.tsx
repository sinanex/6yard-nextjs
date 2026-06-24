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





export default function Home() {
  const navigate = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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

    fetch(`${API_BASE_URL}/api/categories`)
      .then(res => res.json())
      .then(data => {
        if (active && Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Error fetching categories:", err));

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
    <>
      <div className="pt-20">
        <>
          <title>6YARD STORE | Best Football Jersey Store in Manjeri, Malappuram, Calicut</title>
          <meta name="description" content="Discover premium football kits, customized jerseys, training tees, and sports accessories at 6YARD STORE. Your ultimate soccer jersey shop serving Manjeri, Malappuram, Kottakkal, Tirur, and Calicut." />
          <meta name="keywords" content="jersey store in manjeri, football jersey shop malappuram, jersey shop in kottakkal, sports wear tirur, calicut football jersey store, customized jersey malappuram, soccer shop kerala, 6yard store, football kits kerala" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:title" content="6YARD STORE | Best Football Jersey Store in Manjeri, Malappuram, Calicut" />
          <meta property="og:description" content="Discover premium football kits, customized jerseys, training tees, and sports accessories at 6YARD STORE. Your ultimate soccer jersey shop serving Manjeri, Malappuram, Kottakkal, Tirur, and Calicut." />
          <meta property="og:image" content="https://lh3.googleusercontent.com/aida-public/AB6AXuBPYEM2U14uueDizRlPyp99Sb1S81WoF0IvYasAtfasqSoVE6URbi1Qk3evzTKtihr4pXEx-6VO7iQmkWpiFXXKYhagpgBsMOMGcNscOcoWI6gjh3-5qjizJ4lf8ToZzfNMAXDAzO2R4mTfkT4K-LPorNkLtnfWrr6LQ0oRMIp6ARhxD3vV3Ovc69KsblSSByd8YDRx0mN6yms3vj_nxMvdJfqnWqWmsZOqREY-HBr0bQqUQuqosFvQYQ559OLkzExmk9uhoRFwpFE" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="6YARD STORE | Best Football Jersey Store in Manjeri, Malappuram, Calicut" />
          <meta name="twitter:description" content="Discover premium football kits, customized jerseys, training tees, and sports accessories at 6YARD STORE. Your ultimate soccer jersey shop serving Manjeri, Malappuram, Kottakkal, Tirur, and Calicut." />
        </>

        {/* Hero Section */}
        {banners.length > 0 && (
          <section className="relative h-[55vh] md:h-[500px] w-full overflow-hidden bg-black">
            <AnimatePresence mode="popLayout" initial={false}>
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end px-6 md:px-[50px] pb-12 md:pb-20 w-full">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="max-w-3xl"
                  >
                    {banners[currentBannerIndex]?.title && (
                      <h1 className="font-h text-white mb-3 md:mb-6 text-[32px] md:text-[72px] leading-[1] font-black uppercase italic tracking-tighter">
                        {banners[currentBannerIndex].title}
                      </h1>
                    )}
                    {banners[currentBannerIndex]?.subtitle && (
                      <p className="font-sans text-sm md:text-xl text-white/70 mb-6 md:mb-10 max-w-xl leading-relaxed">
                        {banners[currentBannerIndex].subtitle}
                      </p>
                    )}
                    {banners[currentBannerIndex]?.buttonText && (
                      <button
                        onClick={() => navigate.push(banners[currentBannerIndex]?.linkUrl || '/')}
                        className="bg-brand-primary hover:bg-brand-primary-hover text-white px-8 py-4 md:px-12 md:py-5 rounded-xl md:rounded-2xl font-sans font-bold uppercase tracking-[0.2em] text-[10px] md:text-xs transition-all hover:scale-[1.05] shadow-2xl shadow-brand-primary/40 cursor-pointer active:scale-95"
                      >
                        {banners[currentBannerIndex].buttonText}
                      </button>
                    )}
                  </motion.div>
                </div>
              </motion.div>
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
        )}

        {/* Categories Section */}
        {categories.length > 0 && (
          <section className="py-3 bg-white w-full">
            <div className="px-2 md:px-[50px] w-full">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                {categories.map((cat, idx) => (
                  <motion.div
                    key={cat._id || cat.name}
                    className="group cursor-pointer transition-all duration-300 relative flex flex-col"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => navigate.push(`/category/${encodeURIComponent(cat.name)}`)}
                  >
                    {cat.imageUrl ? (
                      <div className="w-full aspect-[2/3] overflow-hidden rounded-xl bg-brand-surface-low">
                        <img
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          src={cat.imageUrl}
                          alt={cat.name}
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-[2/3] rounded-xl bg-brand-surface-low flex items-center justify-center">
                        <div className="font-h text-brand-on-surface-variant opacity-20 text-6xl">?</div>
                      </div>
                    )}
                    <p className="font-h text-base font-bold text-brand-on-surface text-center mt-2 tracking-wide">{cat.name}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}



        {/* Trending Section */}
        <section className="py-20 overflow-hidden w-full px-6 md:px-[50px]">
          <div className="mb-10">
            <h2 className="font-h text-[32px] font-bold">Trending Now</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 pb-10">
            {loading ? (
              // Show loading skeleton cards in horizontal scroll (e.g., 4 items)
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl md:rounded-3xl border border-brand-surface-normal p-3 md:p-4 space-y-3 md:space-y-4 animate-pulse">
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
                const isSoldOut = product.stock <= 0;
                const mappedProduct: Product = {
                  _id: product._id,
                  id: product._id,
                  name: product.name,
                  category: product.category,
                  price: displayPrice,
                  originalPrice: originalPrice,
                  images: product.images || [],
                  image: product.images?.[0] || 'https://images.unsplash.com/photo-1541002442-9f5985aa8023',
                  isNew: product.isNew || false,
                  isSale: !!product.discount_price,
                  stock: product.stock,
                  salesTag: isSoldOut ? "Sold Out" : product.salesTag,
                  salesTagColor: isSoldOut ? "#333333" : product.salesTagColor
                };
                return (
                  <div key={product._id} className="w-full">
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



        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => {
            if (pendingAction) pendingAction();
            setPendingAction(null);
          }}
        />

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/919876543210"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[9999] group"
          aria-label="Chat on WhatsApp"
        >
          <div className="relative">
            {/* Pulse ring */}
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
            {/* Button */}
            <div className="relative w-14 h-14 md:w-16 md:h-16 bg-[#25D366] hover:bg-[#1ebe5d] rounded-full flex items-center justify-center shadow-2xl shadow-[#25D366]/40 transition-all duration-300 hover:scale-110 active:scale-95">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="white"
                className="md:w-8 md:h-8"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            {/* Tooltip */}
            <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-black/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              Chat with us!
            </div>
          </div>
        </a>
      </div>
    </>
  );
}
