
// Components/StripeComponents/StripePromises.js

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK_KEY);

const options = {
   mode: 'payment',
   amount: 1000 * 100,
   currency: 'bdt',
   // Fully customizable with appearance API.
   appearance: {/*...*/ },
   paymentMethodCreation: 'manual',
};


export default function StripePromises({ children }) {
   return (
      <Elements stripe={stripePromise} options={options}>
         {children}
      </Elements>
   )
}