
// Components/StripeComponents/StripePromises.js

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK_KEY);

export default function StripePromises({ children }) {
   return (
      <Elements stripe={stripePromise}>
         {children}
      </Elements>
   )
}