import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProductStore = create(
  persist(
    (set) => ({
      products: [],
      product: null,
      stock: 0,

      setUpdateProduct: (product) => {
        if (product && typeof product === 'object') {
          const sanitizedProduct = sanitizeProduct(product)
          set({ product: sanitizedProduct })
        } else {
          console.warn('Invalid product passed to setUpdateProduct:', product)
        }
      },
      setStock: (id, newStock) => {
        set((state) => ({
          stock: {
            ...state.stock,
            [id]: newStock,
          },
        }))
      },
    }),
    {
      name: 'product-store',
    },
  ),
)

// 👇 Sanitize function to exclude large fields
function sanitizeProduct(product) {
  const MAX_IMAGE_LENGTH = 1000
  const MAX_DESCRIPTION_LENGTH = 1000

  const {
    image,
    description,
    reviews, // optionally exclude or shorten arrays
    ...rest
  } = product

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
  }
}
