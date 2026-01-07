import { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  image: string;
  store: string;
  discount: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from database when user logs in
  const loadCartFromDB = useCallback(async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading cart:', error);
        return;
      }

      const items: CartItem[] = (data || []).map((item) => ({
        id: item.product_id,
        name: item.name,
        price: Number(item.price),
        originalPrice: Number(item.original_price),
        quantity: item.quantity,
        image: item.image || '',
        store: item.store || '',
        discount: Number(item.discount) || 0,
      }));

      setCartItems(items);
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadCartFromDB();
  }, [loadCartFromDB]);

  const addToCart = async (item: Omit<CartItem, 'quantity'>) => {
    if (!user) return;

    const existingItem = cartItems.find((i) => i.id === item.id);

    if (existingItem) {
      await updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      // Add to local state first for immediate UI update
      setCartItems((prev) => [...prev, { ...item, quantity: 1 }]);

      // Then sync to database
      try {
        const { error } = await supabase.from('cart_items').insert({
          user_id: user.id,
          product_id: item.id,
          name: item.name,
          price: item.price,
          original_price: item.originalPrice,
          quantity: 1,
          image: item.image,
          store: item.store,
          discount: item.discount,
        });

        if (error) {
          console.error('Error adding to cart:', error);
          // Rollback on error
          setCartItems((prev) => prev.filter((i) => i.id !== item.id));
        }
      } catch (error) {
        console.error('Error adding to cart:', error);
        setCartItems((prev) => prev.filter((i) => i.id !== item.id));
      }
    }
  };

  const removeFromCart = async (id: string) => {
    if (!user) return;

    const itemToRemove = cartItems.find((item) => item.id === id);
    
    // Update local state first
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    // Then sync to database
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (error) {
        console.error('Error removing from cart:', error);
        // Rollback on error
        if (itemToRemove) {
          setCartItems((prev) => [...prev, itemToRemove]);
        }
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      if (itemToRemove) {
        setCartItems((prev) => [...prev, itemToRemove]);
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user) return;

    if (quantity === 0) {
      await removeFromCart(id);
      return;
    }

    const previousItem = cartItems.find((item) => item.id === id);
    
    // Update local state first
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );

    // Then sync to database
    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (error) {
        console.error('Error updating quantity:', error);
        // Rollback on error
        if (previousItem) {
          setCartItems((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, quantity: previousItem.quantity } : item
            )
          );
        }
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      if (previousItem) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, quantity: previousItem.quantity } : item
          )
        );
      }
    }
  };

  const clearCart = async () => {
    if (!user) return;

    const previousItems = [...cartItems];
    
    // Clear local state first
    setCartItems([]);

    // Then sync to database
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        // Rollback on error
        setCartItems(previousItems);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      setCartItems(previousItems);
    }
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
