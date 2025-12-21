import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const initialProductState = {
  products: [],
  productToEdit: null,
};

export const initialFormState = {
  currentStep: 1,
  //for forms in create/edit product
  draftFormData: {
    name: '',
    price: '',
    image: '',
    description: '',
    category: '',
    brand: '',
    stock: '',
  },
};

export const useProductStore = create(
  persist(
    (set, get) => ({
      ...initialProductState,
      ...initialFormState,

      setProductToEdit: product => {
        if (!product) return;
        set({
          productToEdit: product,
          draftFormData: product, // Fill the draft immediately
          currentStep: 1,
        });
      },
      clearProductToEdit: () => set({ productToEdit: null }),

      // 💡 Methods to update draft and steps
      updateDraftData: newData =>
        set(state => ({
          draftFormData: { ...state.draftFormData, ...newData },
        })),
      setCurrentStep: step => set({ currentStep: step }),
      resetCreateForm: () =>
        set({
          draftFormData: initialFormState.draftFormData,
          currentStep: 1,
          productToEdit: null,
        }),
    }),
    {
      name: 'product-store',
      partialize: state => ({
        products: state.products,
        draftFormData: state.draftFormData,
        currentStep: state.currentStep,
      }),
    }
  )
);
