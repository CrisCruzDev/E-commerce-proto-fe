import { create } from 'zustand'

export const useCartStore = create((set) => ({
  globalQuantity: 1,
  setGlobalQuantity: () => set((state) => ({ globalQuantity: state })),
  increment: () => set((state) => ({ quantity: state.quantity + 1 })),
  decrement: () =>
    set((state) => ({ quantity: Math.max(1, state.quantity - 1) })),
  resetQuantity: () => set({ quantity: 1 }),
}))
