import { useState } from 'react';
import type { CartItem, Cart } from './types';

export const useCartStore = () => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setItems(prev => {
      const existingItem = prev.find(i => i.productId === item.productId);
      
      if (existingItem) {
        return prev.map(i => 
          i.productId === item.productId 
            ? { ...i, quantity: i.quantity + (item.quantity || 1) }
            : i
        );
      }
      
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getCart = (): Cart => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    return {
      items,
      totalItems,
      totalPrice,
      discount: 0, // Можно добавить логику скидок
      finalPrice: totalPrice
    };
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCart
  };
};
