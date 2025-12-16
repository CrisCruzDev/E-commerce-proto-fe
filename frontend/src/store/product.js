import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const initialProductState = {
  products: [],
  productToEdit: null,
  stock: {},
};

export const useProductStore = create(
  persist(
    (set, get) => ({
      ...initialProductState,

      setProductToEdit: product => {
        if (!product || typeof product !== 'object') {
          console.warn('Invalid product passed to setProductToEdit:', product);
          return;
        }

        const sanitized = sanitizeProduct(product);
        set({ productToEdit: sanitized });
      },

      clearProductToEdit: () => set({ productToEdit: null }),

      setStock: (id, newStock) => {
        set(state => ({
          stock: {
            ...state.stock,
            [id]: newStock,
          },
        }));
      },
    }),
    {
      name: 'product-store',
      partialize: state => ({
        products: state.products,
        stock: state.stock,
      }),
    }
  )
);

// 👇 Sanitize function to exclude large fields
function sanitizeProduct(product) {
  const MAX_IMAGE_LENGTH = 1000;
  const MAX_DESCRIPTION_LENGTH = 1000;

  const {
    image,
    description,
    // optionally exclude or shorten arrays
    ...rest
  } = product;

  return {
    ...rest,
    image:
      typeof image === 'string' && image.length <= MAX_IMAGE_LENGTH
        ? image
        : 'Image file too large*',
    description:
      typeof description === 'string'
        ? description.slice(0, MAX_DESCRIPTION_LENGTH)
        : '',
    // optionally include reviews if small: reviews?.slice?.(0, 3),
  };
}
