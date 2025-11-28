import { create } from 'zustand';

export const useUIStore = create(set => ({
  mobileOpen: false,
  setMobileOpen: v => set({ mobileOpen: v }),

  //Scroll
  scrollTo: null,
  setScrollTo: hash => set({ scrollTo: hash }),
  consumeScrollTo: () => set({ scrollTo: null }),

  // Admin key modal flow
  requestKeyOpen: false,
  verifyKeyOpen: false,

  openRequestKey: () => set({ requestKeyOpen: true }),
  closeRequestKey: () => set({ requestKeyOpen: false }),

  openVerifyKey: () => set({ verifyKeyOpen: true }),
  closeVerifyKey: () => set({ verifyKeyOpen: false }),
}));
