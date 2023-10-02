import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import ProtectedHOC from '../_ProtectedHOC';
import { useRouter } from 'next/router';
import { useCartContext } from '@/lib/CartProvider';
// import { apiHandler } from '@/Functions/common';
import CartCheckoutComponent from '@/Components/CheckoutComponents/CartCheckOutComponent';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK_KEY);

export default ProtectedHOC(() => {

   const router = useRouter();

   const { checkout, session } = router?.query;

   const { cartData } = useCartContext();

   let totalAmount = cartData?.cartCalculation?.finalAmount || 0;

   if (totalAmount <= 0) return;

   const options = {
      mode: 'payment',
      amount: totalAmount * 100,
      currency: 'bdt',
      // Fully customizable with appearance API.
      appearance: {/*...*/ },
      paymentMethodCreation: 'manual',
   };

   // if (clientSecret)
   return (
      <Elements stripe={stripePromise} options={options}>
         <CartCheckoutComponent totalAmount={totalAmount} session={session} />
      </Elements>
   )
});