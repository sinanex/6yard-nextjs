"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, ShoppingBag, Heart, Shield, Truck, Verified, Star, Plus, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import { API_BASE_URL } from '@/config';
import { Product } from '@/types';
import AuthModal from '@/components/AuthModal';
import { useCart } from '@/context/CartContext';

const PRODUCT_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAQ38GlBp8aAxQiOSE483yc-jVtTv1lt7uPjbJPMqq3BnoBXAnwpLhriKduHt78pWPxt4xoy1fHnfGwE-Z4nwkIhmuD6SKOzj8fAilcBGsvR72hRYVnuhnY_jmPdmyIXyqjEgTmkBI6H39e7RH1PlUPj0lLJ2YJdi5szTSKj2rXwdus87pu3lNAOKiOpjwDco5G41Z4R5-DruwUZz3q6YoKdx9EFu5vVb-j5u6CZEBZVgEpiSLB8z4V6aRuzIXd4KsBh6xpiqKxvXQ',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCbEJMVpwIFu8oMmXCrtUm1USGw8g1BRK0aTKZvWjqjWh6mM8JkJFv-W8g9a0mG7CtCYrYmuMJkOHCkfksKbklq8DmLIGu_XTDbWlPU47PgU_Z_QjhKkygQe1WCNou2X-u6eROcgBZeudaiUxNWrJJGXf83kEvjIpWc-m9P-AlLntC3jCDrpXuBPEK72Y-vJTGsnTCXsODZf6IW9MO0Rb1mwshHlcwuSx1HIWBNMiXd1WF5HIokD1eQPtkR2jNXJG7dnrP2LVy4uJ8',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCC7tE90YgglT6siA2IUT4S8TysQKQdUIid1ZqEQ460L8rqmCexHtiiNOFwv4zuNNHX8y9MiRzed8MU4kYS_e4mvR-cfNPM7HiUwY3ttekqBePhYSEYycRI5DeeKj1gm0Jhm4ww5lHaXuAmWW0Jc8U_b938BvOuohas2NTPYWsPu02Awgj7L-Q3SWN2WwlOr1YEBz5X8IGp2JbeVghxLxdMRfUpDvwi-0l0Ac9pJ64RhfKQOv5_0X_2r28wCmanmTuT8ItByThlkKc',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDiQQyjZTQu4Fl13vJOreMurpzVLckTYpibU2t0XBZyW_i5jvFHksqJ92Amdp1P1fbP4FCKLVfxHTqqaC7-vc0DpK1DK-1aFahNxBYpx38NkntlUzdBI4sp958CRZt6_mMFud2NkIyOEGRB9Dsr5weW1ZRB3v_5GJXNPeUbnc9MThPUfgbQBY3jpuTIsRurKKwU-nA9HUc3akV8wK1ysB393fcCkKE61O_2KMJpbvOqkjGFyHv47Wq0mY5ky3Smv0H-aWnexuXhJH0'
];

const RELATED_PRODUCTS: Product[] = [
  { _id: 'rem-1', id: 'rem-1', name: 'Match Day Shorts 24/25', category: 'Training', price: 45.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtsxW-3BYThB30FuJIwHJ2rtE_YfYgZP0cPJNGbVT8GG5oyTAgZwqPuUgHNKR61dZf__VjyRpUfOjyfoT8hwxZ5phVhkr9j4hvU3j2RrHW0nkHdU_CvyjrueugLGgrxZXnZhfbnpT1UUCm8jwrEkLK2LOMbYYS6pzyXCMtfOif1us9e_b4vq16-p1XrrqpPN0TPp890Xio5EVJJsP3EZR4zsvBAYEWtW0jgc2lLPz2qP0QTWbGdEWy6LBp2_JBgSIysR9v7Fk7BE8', images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAtsxW-3BYThB30FuJIwHJ2rtE_YfYgZP0cPJNGbVT8GG5oyTAgZwqPuUgHNKR61dZf__VjyRpUfOjyfoT8hwxZ5phVhkr9j4hvU3j2RrHW0nkHdU_CvyjrueugLGgrxZXnZhfbnpT1UUCm8jwrEkLK2LOMbYYS6pzyXCMtfOif1us9e_b4vq16-p1XrrqpPN0TPp890Xio5EVJJsP3EZR4zsvBAYEWtW0jgc2lLPz2qP0QTWbGdEWy6LBp2_JBgSIysR9v7Fk7BE8'] },
  { _id: 'rem-2', id: 'rem-2', name: 'Home Socks 24/25', category: 'Training', price: 18.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-1t0-egD2l-PeCCChC_jzV3QTUqEh8aeaeDCnU5k1mwoqj32vGHGZ_cr_sukPN-sMT7EUul0AKyW0tXAefZgnHtdurIdeivHvAq43LOhK5SkgQ3LpySG2A0k33VPCqgZUBXVyWdv74QA_s3yJ7oIQVPspVGKhLmROqMrHuXJvPkV3C2EL2z3Gpu0IzsmNs96zXCr3psBs7lbwqAQJv9RR_4LDenyCPMPGZoyMSxYVXAM6b4qBJNYpx4tjYLNGYbsyUHIi4Jj6VRk', images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuA-1t0-egD2l-PeCCChC_jzV3QTUqEh8aeaeDCnU5k1mwoqj32vGHGZ_cr_sukPN-sMT7EUul0AKyW0tXAefZgnHtdurIdeivHvAq43LOhK5SkgQ3LpySG2A0k33VPCqgZUBXVyWdv74QA_s3yJ7oIQVPspVGKhLmROqMrHuXJvPkV3C2EL2z3Gpu0IzsmNs96zXCr3psBs7lbwqAQJv9RR_4LDenyCPMPGZoyMSxYVXAM6b4qBJNYpx4tjYLNGYbsyUHIi4Jj6VRk'] },
  { _id: 'rem-3', id: 'rem-3', name: 'Elite Performance Cleats', category: 'Football', price: 199.99, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDQNUc3ftOij7Bj9Ezh-tRGZHvg24ciwytkQqrWSTJ1khsiZwsCf0rOM3qtsvVkq8kfUrk-ifOCbbRHyqh2D7UuzG-z7EqPHecGHCMTQPYQt-EsRWo8GvUG3p_RFySePC9SPUsZMeWfHTUwT0SAH8i-pap61Z0YVNyKw0RBfANImxjONbXnco8G2uZw_tV42iEUrY3lPJaaT3r1yJsZk74yzdL8AogwHiVuyuJgCEQ8Y4668cS2hXlPqgnvHFRfqipgEB6mxSsGaFo', images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDQNUc3ftOij7Bj9Ezh-tRGZHvg24ciwytkQqrWSTJ1khsiZwsCf0rOM3qtsvVkq8kfUrk-ifOCbbRHyqh2D7UuzG-z7EqPHecGHCMTQPYQt-EsRWo8GvUG3p_RFySePC9SPUsZMeWfHTUwT0SAH8i-pap61Z0YVNyKw0RBfANImxjONbXnco8G2uZw_tV42iEUrY3lPJaaT3r1yJsZk74yzdL8AogwHiVuyuJgCEQ8Y4668cS2hXlPqgnvHFRfqipgEB6mxSsGaFo'] },
  { _id: 'rem-4', id: 'rem-4', name: 'Anthem Jacket 24/25', category: 'Training', price: 110.00, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC_sVWjkZ9pxd6d_4QyWv9cFZPk0khxtskZ2an-DetgIdgTj9OQFgu3YM5z0OTUhNr_8IgPtW7Y1GbiatnIdSbkMDJMVXr3vOls1IvUmtGKnF5nymsOcAf22N_snjPpsc53SYNV_Cx0Zfz0Nrh3SlKZJFzI2LxI7rJFqV9GA6FxxVrDGIK7o4x-2tTw94iETn6pVkJqxOAMr-2OF3sXJyypAGZZui7rv-u192RQ87LDi27XyupZDOoF6zMxi2I6tvAkSTAE9nC1rDE', images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuC_sVWjkZ9pxd6d_4QyWv9cFZPk0khxtskZ2an-DetgIdgTj9OQFgu3YM5z0OTUhNr_8IgPtW7Y1GbiatnIdSbkMDJMVXr3vOls1IvUmtGKnF5nymsOcAf22N_snjPpsc53SYNV_Cx0Zfz0Nrh3SlKZJFzI2LxI7rJFqV9GA6FxxVrDGIK7o4x-2tTw94iETn6pVkJqxOAMr-2OF3sXJyypAGZZui7rv-u192RQ87LDi27XyupZDOoF6zMxi2I6tvAkSTAE9nC1rDE'] },
];

export default function ProductDetail() {
  const { id } = useParams() as { id: string };
  const navigate = useRouter();
  const [selectedSize, setSelectedSize] = useState('M');
  const [activeImage, setActiveImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>('specs');
  const [isAdding, setIsAdding] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ transformOrigin: 'center' });
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [lastTap, setLastTap] = useState<number>(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const [reviewsList, setReviewsList] = useState<{ rating: number, text: string, name: string, date: string }[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, text: '', name: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.text.trim() || !newReview.name.trim()) return;
    setIsSubmittingReview(true);
    try {
      const reviewData = {
        ...newReview,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      };
      
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      
      if (!res.ok) throw new Error("Failed to submit review");
      
      setReviewsList([reviewData, ...reviewsList]);
      setNewReview({ rating: 5, text: '', name: '' });
    } catch (err) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(2.2)',
    });
  };

  const handleMouseEnter = () => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomStyle({
      transformOrigin: 'center',
      transform: 'scale(1)',
    });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setTouchStartX(touch.clientX);
    setTouchStartY(touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isZoomed && e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const x = ((touch.clientX - rect.left) / rect.width) * 100;
      const y = ((touch.clientY - rect.top) / rect.height) * 100;
      setZoomStyle({
        transformOrigin: `${x}% ${y}%`,
        transform: 'scale(2.2)',
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null || touchStartY === null) return;

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const diffX = touchStartX - endX;
    const diffY = touchStartY - endY;

    const productImages = product?.images && product.images.length > 0 ? product.images : PRODUCT_IMAGES;

    if (!isZoomed) {
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        if (diffX > 0) {
          setActiveImage((prev) => (prev + 1) % productImages.length);
        } else {
          setActiveImage((prev) => (prev - 1 + productImages.length) % productImages.length);
        }
        setTouchStartX(null);
        setTouchStartY(null);
        return;
      }
    }

    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTap < DOUBLE_TAP_DELAY) {
      if (isZoomed) {
        setIsZoomed(false);
        setZoomStyle({ transformOrigin: 'center', transform: 'scale(1)' });
      } else {
        setIsZoomed(true);
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((endX - rect.left) / rect.width) * 100;
        const y = ((endY - rect.top) / rect.height) * 100;
        setZoomStyle({
          transformOrigin: `${x}% ${y}%`,
          transform: 'scale(2.2)',
        });
      }
      setLastTap(0);
    } else {
      setLastTap(now);
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  useEffect(() => {
    if (!id) return;

    // List of static mock ids
    const mockIds = ['1', '2', '3', '4', '5', '6', '7', '8', 'rem-1', 'rem-2', 'rem-3', 'rem-4'];
    if (mockIds.includes(id)) {
      setProduct({
        _id: id,
        name: id === '1' ? 'Manchester Home Kit 24/25' :
          id === '2' ? 'Elite Vapour Training Tee' :
            id === '3' ? 'London Away Kit 24/25' :
              id === '4' ? 'National Pro Match Jersey' :
                id === '5' ? 'Premium Red Kit' :
                  id === '6' ? 'Sky Blue Fan Jersey' :
                    id === '7' ? 'Pro Training Black' :
                      id === '8' ? 'National Home Kit' : 'Match Gear',
        price: id === '1' ? 89.99 : id === '2' ? 54.99 : id === '3' ? 84.99 : id === '4' ? 79.99 : 89.99,
        discount_price: undefined,
        category: 'Football',
        description: 'Blends heritage with cutting-edge HEAT.RDY technology. Designed for peak performance on the pitch and premium style in the stands.',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Red', 'White'],
        images: PRODUCT_IMAGES
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then(data => {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        }
        if (data.reviews) {
          setReviewsList(data.reviews);
        }
      })
      .catch(err => {
        console.error("Fetch detail error:", err);
        // Default fallback if any live fetch fails
        setProduct({
          _id: id,
          name: 'Manchester Home Kit 24/25',
          price: 89.99,
          discount_price: undefined,
          category: 'Football',
          description: 'Blends heritage with cutting-edge HEAT.RDY technology. Designed for peak performance on the pitch and premium style in the stands.',
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Red', 'White'],
          images: PRODUCT_IMAGES
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;

    setIsAdding(true);
    try {
      await addToCart(product, selectedSize, 1);
      navigate.push('/cart');
    } catch (err) {
      alert('Failed to add to cart');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;

    setIsBuying(true);
    try {
      await addToCart(product, selectedSize, 1);
      navigate.push('/checkout');
    } catch (err) {
      alert('Failed to process order');
    } finally {
      setIsBuying(false);
    }
  };

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-brand-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary"></div>
      </div>
    );
  }

  const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', '3XL', '4XL'];
  const rawSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL'];
  const sizes = [...rawSizes].sort((a, b) => {
    const idxA = SIZE_ORDER.indexOf(a.toUpperCase());
    const idxB = SIZE_ORDER.indexOf(b.toUpperCase());
    if (idxA === -1 && idxB === -1) return a.localeCompare(b);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });
  const productImages = product.images && product.images.length > 0 ? product.images : PRODUCT_IMAGES;

  const currentPrice = product.discount_price || product.price;
  const firstImage = productImages[0];
  const schemaMarkup = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": firstImage,
    "description": product.description || `Buy premium ${product.name} at 6YARD STORE. engineered for the fans, designed for the pros.`,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "INR",
      "price": currentPrice,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    }
  };

  return (
    <main className="max-w-[1280px] mx-auto px-6 pt-24 pb-20">
      <>
        <title>{`6YARD | ${product.name}`}</title>
        <meta name="description" content={product.description || `Get your hands on the premium ${product.name} from 6YARD. High performance athletic gear, premium sizes, and custom prints available.`} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:title" content={`6YARD | ${product.name}`} />
        <meta property="og:description" content={product.description || `Get your hands on the premium ${product.name} from 6YARD. High performance athletic gear, premium sizes, and custom prints available.`} />
        <meta property="og:image" content={firstImage} />
        <meta property="product:price:amount" content={String(currentPrice)} />
        <meta property="product:price:currency" content="INR" />

        {/* Structured JSON-LD Schema Markup */}
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      </>

      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs font-sans text-brand-on-surface-variant mb-8 uppercase tracking-widest">
        <Link className="hover:text-brand-primary transition-colors" href="/">Home</Link>
        <ChevronRight size={14} />
        <Link className="hover:text-brand-primary transition-colors" href="/">Shop</Link>
        <ChevronRight size={14} />
        <span className="text-brand-on-surface font-black">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            className="relative aspect-[4/5] rounded-xl overflow-hidden bg-white shadow-xl group border border-brand-surface-normal cursor-zoom-in"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              alt="Main Product"
              className={cn(
                "w-full h-full object-cover select-none pointer-events-none origin-center",
                isZoomed ? "" : "transition-transform duration-300 ease-out"
              )}
              style={isZoomed ? zoomStyle : { transform: 'scale(1)', transformOrigin: 'center' }}
              src={productImages[activeImage]}
            />
            <div className="absolute top-4 left-4 bg-brand-primary text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-[0.2em] pointer-events-none select-none z-10">
              NEW ARRIVAL
            </div>

            {/* Desktop Hint */}
            <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none select-none hidden md:block z-10">
              Hover to Zoom
            </div>

            {/* Mobile Swipe Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full z-10 select-none pointer-events-none">
              {productImages.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    activeImage === idx ? "bg-white w-4" : "bg-white/40"
                  )}
                />
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-4 gap-4">
            {productImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={cn(
                  "aspect-square rounded-xl overflow-hidden border-2 transition-all duration-300",
                  activeImage === idx ? "border-brand-primary scale-95 shadow-lg" : "border-transparent hover:opacity-70"
                )}
              >
                <img className="w-full h-full object-cover" src={img} alt={`Thumb ${idx}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-8">
          <div>
            <span className="text-brand-primary font-sans font-bold uppercase tracking-[0.3em] text-[10px]">Official Merchandise</span>
            <h1 className="font-h text-[40px] text-brand-on-surface mt-2 mb-4 leading-[1.1] font-bold">{product.name}</h1>
            <div className="flex items-center gap-4">
              <span className="font-h text-[32px] text-brand-primary font-bold">₹{(product.discount_price || product.price).toFixed(2)}</span>
              {product.discount_price && (
                <span className="text-brand-on-surface-variant line-through text-lg opacity-40">₹{product.price.toFixed(2)}</span>
              )}
            </div>
          </div>

          <p className="font-sans text-brand-on-surface-variant leading-relaxed">
            {product.description}
          </p>

          {/* Size Selection */}
          <div className="space-y-4">
            <div className="flex justify-between items-center text-[10px] border-b border-brand-surface-normal pb-2">
              <span className="font-sans font-bold text-brand-on-surface uppercase tracking-widest">SELECT SIZE</span>
              <button onClick={() => setIsSizeGuideOpen(!isSizeGuideOpen)} className="font-sans text-brand-primary font-bold underline underline-offset-4 hover:opacity-70">Size Guide</button>
            </div>

            <AnimatePresence>
              {isSizeGuideOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="py-2">
                    <img src="/sizechart.png" alt="Size Chart" className="w-full h-auto rounded-xl border border-brand-surface-normal shadow-sm" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-wrap gap-3">
              {sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center border-2 font-h transition-all active:scale-90",
                    selectedSize === size
                      ? "border-brand-primary font-bold"
                      : "border-brand-surface-normal text-brand-on-surface-variant hover:border-brand-primary-hover"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4">
            <button
              onClick={handleAddToCart}
              disabled={isAdding || isBuying}
              className="w-full bg-white border-2 border-brand-surface-normal hover:border-brand-primary text-brand-on-surface font-sans font-bold py-5 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
              <AnimatePresence mode="wait">
                {isAdding ? (
                  <motion.div
                    key="adding"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], rotate: [0, -10, 10, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6 }}
                    >
                      <ShoppingBag size={20} />
                    </motion.div>
                    ADDING...
                  </motion.div>
                ) : (
                  <motion.div
                    key="add"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    <ShoppingBag size={20} />
                    ADD TO CART
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isAdding || isBuying}
              className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-sans font-bold py-5 rounded-xl shadow-2xl shadow-brand-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-widest text-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
              <AnimatePresence mode="wait">
                {isBuying ? (
                  <motion.div
                    key="buying"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    PROCESSING...
                  </motion.div>
                ) : (
                  <motion.div
                    key="buy"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    className="flex items-center gap-3"
                  >
                    BUY NOW
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 gap-4 pt-8 border-t border-brand-surface-normal">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-surface-low flex items-center justify-center text-brand-primary">
                <Truck size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest">Free Shipping</span>
                <span className="text-[10px] text-brand-on-surface-variant opacity-60">Orders over ₹1500</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-surface-low flex items-center justify-center text-brand-primary">
                <Verified size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold tracking-widest">Authentic</span>
                <span className="text-[10px] text-brand-on-surface-variant opacity-60">100% Genuine Gear</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Accordions */}
      <div className="mt-24 max-w-4xl mx-auto space-y-4">
        {[
          {
            id: 'specs', title: 'Product Specifications', content: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-brand-on-surface-variant font-sans py-4">
                <ul className="space-y-3 list-disc list-inside marker:text-brand-primary">
                  <li>100% Recycled Polyester Mock Eyelet</li>
                  <li>HEAT.RDY Moisture-wicking technology</li>
                  <li>Mesh underarm inserts for airflow</li>
                  <li>Ribbed crewneck and cuffs</li>
                </ul>
                <ul className="space-y-3 list-disc list-inside marker:text-brand-primary">
                  <li>Slim athletic fit</li>
                  <li>Official embroidered club crest</li>
                  <li>Product code: MN-HME-2425</li>
                  <li>Imported</li>
                </ul>
              </div>
            )
          },
          { id: 'shipping', title: 'Shipping & Returns', content: <p className="py-4 text-brand-on-surface-variant">Standard shipping (3-5 days) available for all orders. Returns accepted within 30 days of delivery.</p> },
          {
            id: 'reviews', title: `Customer Reviews (${reviewsList.length})`, content: (
              <div className="py-4 space-y-8">
                {/* Add Review Form */}
                <form onSubmit={handleAddReview} className="bg-brand-surface-lowest border border-brand-surface-normal p-6 rounded-2xl space-y-4">
                  <h3 className="font-h font-bold text-lg">Write a Review</h3>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button type="button" key={star} onClick={() => setNewReview({ ...newReview, rating: star })} className="text-brand-primary transition-transform active:scale-90">
                        <Star size={24} fill={star <= newReview.rating ? "currentColor" : "none"} />
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      required
                      value={newReview.name}
                      onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                      className="w-full bg-brand-surface border border-brand-surface-normal rounded-xl px-4 py-3 font-sans outline-none focus:border-brand-primary"
                    />
                    <textarea
                      placeholder="Share your thoughts about this product..."
                      required
                      rows={3}
                      value={newReview.text}
                      onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                      className="w-full bg-brand-surface border border-brand-surface-normal rounded-xl px-4 py-3 font-sans outline-none focus:border-brand-primary resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingReview || !newReview.text.trim() || !newReview.name.trim()}
                    className="bg-brand-primary hover:bg-brand-primary-hover text-white font-sans font-bold py-3 px-6 rounded-xl uppercase tracking-widest text-xs transition-all disabled:opacity-50">
                    {isSubmittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>

                {/* List Reviews */}
                <div className="space-y-6">
                  {reviewsList.map((review, idx) => (
                    <div key={idx} className="border-b border-brand-surface-normal pb-6 last:border-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-sans font-bold text-brand-on-surface">{review.name}</div>
                          <div className="text-[10px] text-brand-on-surface-variant uppercase tracking-widest mt-1">{review.date}</div>
                        </div>
                        <div className="flex items-center text-brand-primary">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} />
                          ))}
                        </div>
                      </div>
                      <p className="font-sans text-brand-on-surface-variant text-sm mt-3 leading-relaxed">"{review.text}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )
          },
        ].map(section => (
          <div key={section.id} className="border-b border-brand-surface-normal">
            <button
              onClick={() => setOpenAccordion(openAccordion === section.id ? null : section.id)}
              className="w-full flex justify-between items-center text-left py-6 group"
            >
              <span className="font-h text-xl font-bold group-hover:text-brand-primary transition-colors">{section.title}</span>
              {openAccordion === section.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <AnimatePresence>
              {openAccordion === section.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  {section.content}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>


      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => handleAddToCart()}
      />
    </main>
  );
}
