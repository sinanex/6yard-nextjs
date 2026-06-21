"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface CartItem {
  _id?: string;
  product: any;
  size?: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  loading: boolean;
  totalQuantity: number;
  totalAmount: number;
  addToCart: (product: any, size?: string, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  loadCart: () => Promise<void>;
  mergeCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => {
    const price = item.product?.discount_price || item.product?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  // Load cart on initial mount
  useEffect(() => {
    loadCart();
  }, []);

  const saveToLocalStorage = (items: CartItem[]) => {
    localStorage.setItem('kitbay_guest_cart', JSON.stringify(items));
  };

  const getFromLocalStorage = (): CartItem[] => {
    const saved = localStorage.getItem('kitbay_guest_cart');
    return saved ? JSON.parse(saved) : [];
  };

  const loadCart = async () => {
    setLoading(true);
    setCartItems(getFromLocalStorage());
    setLoading(false);
  };

  const mergeCart = async () => {
    // No-op since we are only using localStorage now
    return Promise.resolve();
  };

  const addToCart = async (product: any, size?: string, quantity = 1) => {
    const currentCart = [...cartItems];
    const existingIndex = currentCart.findIndex(
      item => item.product._id === product._id && item.size === size
    );

    if (existingIndex >= 0) {
      currentCart[existingIndex].quantity += quantity;
    } else {
      // Generate a fake ID for local items
      currentCart.push({
        _id: `local_${Date.now()}_${Math.random()}`,
        product,
        size,
        quantity
      });
    }
    setCartItems(currentCart);
    saveToLocalStorage(currentCart);
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    const currentCart = cartItems.map(item => 
      item._id === itemId ? { ...item, quantity } : item
    );
    setCartItems(currentCart);
    saveToLocalStorage(currentCart);
  };

  const removeFromCart = async (itemId: string) => {
    const currentCart = cartItems.filter(item => item._id !== itemId);
    setCartItems(currentCart);
    saveToLocalStorage(currentCart);
  };

  const clearCart = () => {
    setCartItems([]);
    saveToLocalStorage([]);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      totalQuantity,
      totalAmount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loadCart,
      mergeCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

