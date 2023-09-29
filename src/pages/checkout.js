// pages/single-checkout.js


import SingleCheckoutComponent from "@/Components/CheckoutComponents/SingleCheckoutComponent";
import { ProtectedHOC } from "./_ProtectedHOC";

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useRouter } from "next/router";

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK_KEY);

export default ProtectedHOC(function Checkout() {

   const router = useRouter();

   const { session } = router?.query;

   const options = {
      mode: 'payment',
      amount: 1000 * 100,
      currency: 'bdt',
      // Fully customizable with appearance API.
      appearance: {/*...*/ },
      paymentMethodCreation: 'manual',
   };

   return (
      <Elements stripe={stripePromise} options={options}>
         <SingleCheckoutComponent session={session}></SingleCheckoutComponent>
      </Elements>

   )
});
