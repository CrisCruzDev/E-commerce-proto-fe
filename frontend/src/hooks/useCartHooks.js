import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItemQty,
} from '../api/cartApi';
import toast from 'react-hot-toast';
import { getProductById } from '../api/productApi';

export const useGetCart = () =>
  useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const cart = await getCart();

      const enrichedItems = await Promise.all(
        cart.items.map(async item => {
          try {
            const fullProduct = await getProductById(
              item.product._id || item.product
            );

            return {
              ...item,
              product: fullProduct,
            };
          } catch (err) {
            console.error('Could not fetch product for cart item', err);
            return null; // Handle deleted products
          }
        })
      );
      // 3. Filter out any nulls (deleted products)
      return enrichedItems.filter(Boolean);
    },
  });

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, qty }) => addToCart({ id, qty }),
    onSuccess: (data, variables) => {
      console.log('variables.id: ', variables.id);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart');
      queryClient.invalidateQueries({
        queryKey: ['getProductById', variables.id],
      });
    },
    onError: err => {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to add item to cart.';
      toast.error('Add to cart error');
    },
  });

  return mutation;
};

export const useUpdateCartQty = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ product_id, action }) =>
      updateCartItemQty(product_id, action),

    // Optimistic Update: Update UI immediately
    onMutate: async ({ product_id, action }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);

      queryClient.setQueryData(['cart'], oldCart => {
        if (!oldCart || !oldCart.items) return oldCart;

        const newItems = oldCart.items.map(item => {
          if (item.product._id === product_id) {
            const newQty =
              action === 'increment' ? item.quantity + 1 : item.quantity - 1;
            return { ...item, quantity: Math.max(1, newQty) };
          }
          return item;
        });

        return { ...oldCart, items: newItems };
      });

      return { previousCart };
    },

    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },

    onError: (err, variables, context) => {
      // Rollback if server says "Not enough stock"
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      toast.error(err.response?.data?.message || 'Failed to update quantity');
    },
  });
};

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: product_id => removeFromCart(product_id),
    onMutate: async ({ product_id }) => {
      await queryClient.cancelQueries(['cart']);
      const previousCart = queryClient.getQueryData(['cart']);

      queryClient.setQueryData(['cart'], oldCartData => {
        if (!oldCartData || !oldCartData.items) return oldCartData;

        const updatedItems = oldCartData.items.filter(
          cartItem => cartItem.product._id !== product_id
        );

        return { ...oldCartData, items: updatedItems };
      });

      return { previousCart };
    },
    onSuccess: data => {
      queryClient.setQueryData(['cart'], data.data);
      toast.success('Item Removed');
      queryClient.invalidateQueries(['cart']);
      closeConfirmModal();
    },

    onError: (err, variables, context) => {
      console.log('onError:', err);
    },
  });

  return mutation;
};
