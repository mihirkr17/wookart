import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { ProtectedHOC } from '../_ProtectedHOC';
import { useRouter } from 'next/router';
import { useCartContext } from '@/lib/CartProvider';
// import { apiHandler } from '@/Functions/common';
import CartCheckoutComponent from '@/Components/CheckoutComponents/CartCheckOutComponent';

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK_KEY);

export default ProtectedHOC(() => {

   const router = useRouter();

   const { checkout, session } = router?.query;

   const { cartData } = useCartContext();

   let totalAmount = cartData?.cart_calculation?.finalAmount || 0;

   // console.log(totalAmount);

   // const [clientSecret, setClientSecret] = useState("");
   // const [paymentIntId, setPaymentIntId] = useState("");

   // useEffect(() => {
   //    const setTimed = setTimeout(async () => {
   //       const { clientSecret, paymentIntentId } = await apiHandler(`/payment/create-payment-intent`, "POST", { totalAmount, session });

   //       if (clientSecret) {
   //          setClientSecret(clientSecret);
   //          setPaymentIntId(paymentIntentId);
   //       }
   //       else {
   //          router.push("/cart");
   //       }
   //    }, 100);

   //    return () => clearTimeout(setTimed);
   // }, [totalAmount, session, router]);


   // if (checkout !== "checkout") return;

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