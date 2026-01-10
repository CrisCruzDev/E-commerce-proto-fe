import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useGetCart } from '../hooks/useCartHooks';
import { useState } from 'react';
import { apiHandler } from '../api/apiHandler';
import api from '../api/axiosInstance';
import CheckoutSkeleton from '../components/cartPageComponents/CheckoutSkeleton';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Copy, Info } from 'lucide-react';
import { calculateShipping } from '../utils/cartUtils';

const CheckoutPage = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cartData, isLoading: isCartLoading } = useGetCart();
  const cartItems = Array.isArray(cartData) ? cartData : cartData?.items || []; //Added fallback for checkout re-render to check array

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product?.price * item.quantity,
    0
  );
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const shippingCost = calculateShipping(totalQuantity);

  const totalPrice = subtotal + shippingCost;

  console.log('cartItems', cartItems);

  const copyTestCard = () => {
    navigator.clipboard.writeText('4242424242424242');
    toast.success('Card number copied!');
  };

  const handleCheckout = async e => {
    console.log('submit fired');

    e.preventDefault();
    if (!stripe || !elements || cartItems.length === 0) return;

    setIsProcessing(true);
    setError('');

    try {
      // Stripe Card Validation
      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentMethod } =
        await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

      if (stripeError) throw new Error(stripeError.message);

      // Submit Payment + Stock Update + Email
      await apiHandler(() =>
        api.post('/orders/checkout', {
          orderItems: cartItems.map(item => ({
            product: item.product._id,
            name: item.product.name,
            price: item.product.price,
            qty: item.quantity,
            image: item.product.image || 'default.jpg',
          })),
          totalPrice: totalPrice,
          paymentMethod: 'Stripe',
          paymentMethodId: paymentMethod.id,
          shippingAddress: {
            address: '123 Fake St',
            city: 'Manila',
            postalCode: '1000',
            country: 'PH',
          },
        })
      );

      //empty cart
      queryClient.setQueryData(['cart'], { items: [] });
      queryClient.invalidateQueries(['cart']);

      navigate('/success', { replace: true });
    } catch (error) {
      setError(error.message || 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isCartLoading) return <CheckoutSkeleton />;

  return (
    <div className='max-w-4xl mx-auto p-4 md:p-8 font-mono min-h-screen'>
      <h2 className='font-bebas text-3xl md:text-5xl mb-6 md:mb-10 border-b border-black pb-4'>
        SECURE CHECKOUT
      </h2>

      <div className='flex flex-col md:flex-row gap-10 md:gap-16'>
        {/* LEFT: Order Summary (Shows first on mobile) */}
        <div className='w-full md:w-1/2 order-1 md:order-1'>
          <h3 className='text-sm font-bold uppercase tracking-widest mb-4 text-gray-400'>
            Your Items
          </h3>
          <div className='space-y-4 mb-6'>
            {cartItems.map(item => (
              <div
                key={item._id}
                className='flex justify-between items-end border-b border-gray-100 pb-2'
              >
                <div className='flex flex-col'>
                  <span className='text-sm font-bold uppercase'>
                    {item.product.name}
                  </span>
                  <span className='text-xs text-gray-500'>
                    QTY: {item.quantity}
                  </span>
                </div>
                <span className='text-sm font-bold'>
                  ${(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className='pb-3'>
            <div className='flex justify-between text-xs'>
              <p className='font-semibold'>SUBTOTAL: </p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <div className='flex justify-between text-xs'>
              <p className='font-semibold'>SHIPPING: </p>
              <p>${shippingCost.toFixed(2)}</p>
            </div>
          </div>

          <div className='flex justify-between items-center bg-gray-50 p-4 border-l-4 border-black'>
            <span className='font-bold'>TOTAL AMOUNT</span>
            <span className='text-2xl font-bold'>${totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* RIGHT: Stripe Form */}
        <div className='w-full md:w-1/2 order-2 md:order-2'>
          <h3 className='text-sm font-bold uppercase tracking-widest mb-4 text-gray-400'>
            Payment Details
          </h3>
          <form onSubmit={handleCheckout} className='space-y-6'>
            {/* INFO BOX FOR TEST CARD */}
            <div className='bg-zinc-100 border-l-4 border-zinc-800 p-4 mb-4'>
              <div className='flex items-center gap-2 mb-2'>
                <Info size={16} />
                <span className='text-xs font-bold uppercase tracking-tighter'>
                  Test Mode Active
                </span>
              </div>
              <p className='text-[11px] leading-relaxed text-gray-600 mb-3'>
                This store is in demo mode. Please use the following card
                details to complete your "purchase".
              </p>
              <div
                onClick={copyTestCard}
                className='flex items-center justify-between bg-white border border-gray-300 p-2 cursor-pointer hover:border-black transition-all'
              >
                <code className='text-xs font-bold'>4242 4242 4242 4242</code>
                <span className='text-[10px] flex items-center gap-1 font-bold text-gray-400 uppercase'>
                  <Copy size={12} /> Click to Copy
                </span>
              </div>
              <div className='flex gap-4 mt-2'>
                <div className='text-[10px] text-gray-500 font-bold uppercase'>
                  EXP: <span className='text-black'>12/29</span>
                </div>
                <div className='text-[10px] text-gray-500 font-bold uppercase'>
                  CVC: <span className='text-black'>123</span>
                </div>
              </div>
            </div>

            {/* STRIPE CARD INPUT */}
            <div className='space-y-2'>
              <label className='text-[10px] font-black uppercase text-gray-400'>
                Card Information
              </label>
              <div className='border border-black p-4 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        color: '#000',
                        '::placeholder': { color: '#aab7c4' },
                      },
                    },
                  }}
                />
              </div>
            </div>

            <button
              disabled={isProcessing || cartItems.length === 0}
              className='w-full bg-black text-white py-4 font-bebas text-2xl tracking-widest hover:bg-zinc-800 transition-all disabled:bg-gray-300 cursor-pointer'
            >
              {isProcessing
                ? 'AUTHORIZING...'
                : `CONFIRM ORDER — $${totalPrice.toFixed(2)}`}
            </button>

            {error && (
              <p className='text-red-500 text-xs mt-2 font-bold italic'>
                !! {error}
              </p>
            )}
            <p className='text-[10px] text-gray-400 text-center uppercase tracking-tighter'>
              By clicking confirm, you agree to our terms of service (Demo Only)
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
