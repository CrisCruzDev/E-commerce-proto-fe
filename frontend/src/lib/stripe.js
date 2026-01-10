import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe Publishable Key (starts with pk_test_)
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
