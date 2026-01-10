import { create } from 'zustand';

export const useCartStore = create(set => ({
  quantity: 1,
  setquantity: () => set(state => ({ quantity: state })),
  increment: () => set(state => ({ quantity: state.quantity + 1 })),
  decrement: () =>
    set(state => ({ quantity: Math.max(1, state.quantity - 1) })),
  resetQuantity: () => set({ quantity: 1 }),

  // Cart Sidebar Toggle
  isCartOpen: false,
  toggleCart: () => set(state => ({ isCartOpen: !state.isCartOpen })),
}));
