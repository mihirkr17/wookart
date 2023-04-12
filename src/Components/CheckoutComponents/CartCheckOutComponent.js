
// Components/CheckoutComponents/CartCheckoutComponent.js

import { useRouter } from "next/router";
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CartAddress from "../CartComponents/CartAddress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import CartItem from "../CartComponents/CartItem";
import CartCalculation from "../CartComponents/CartCalculation";
import { useState } from "react";
import { useAuthContext } from "@/lib/AuthProvider";
import { apiHandler } from "@/Functions/common";


export default function CartCheckoutComponent() {
   const { authRefetch, userInfo, setMessage } = useAuthContext();
   const router = useRouter();
   const { data } = router.query;
   const [state, setState] = useState((data && JSON.parse(data)) || {});

   const [orderLoading, setOrderLoading] = useState(false);
   const [confirmLoading, setConfirmLoading] = useState(false);

   const stripe = useStripe();
   const elements = useElements();

   const selectedAddress = (userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress.find(e => e?.default_shipping_address === true)) || null;


   const buyBtnHandler = async (e) => {
      try {
         e.preventDefault();

         if (!selectedAddress) {
            return setMessage("Please select shipping address.", "danger");
         }

         if (!stripe || !elements) {
            return;
         }

         const card = elements.getElement(CardElement);

         if (card === null) {
            return;
         }

         // Use your card Element with other Stripe.js APIs
         const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card });

         if (error) {
            return setMessage(error?.message, "danger")
         }

         let products = state?.products && state?.products;

         if (Array.isArray(products) && products.length >= 0 && paymentMethod) {

            setOrderLoading(true);

            const { clientSecret, orderPaymentID, orderItems, message, success } = await apiHandler(`/order/set-order/`, "POST", { state: "byCart", paymentMethod }, userInfo?.email);

            if (success) {

               setOrderLoading(false);

               if (success && clientSecret && orderPaymentID && orderItems) {

                  setMessage(message, "success");

                  const { paymentIntent, error: intErr } = await stripe.confirmCardPayment(
                     clientSecret,
                     {
                        payment_method: {
                           card: card,
                           billing_details: {
                              name: selectedAddress?.name,
                              email: userInfo?.email,
                              phone: selectedAddress?.phone_number,
                              address: {
                                 city: selectedAddress?.city,
                                 state: selectedAddress?.division,
                                 line1: selectedAddress?.area,
                                 line2: selectedAddress?.landmark,
                                 country: "BD"
                              }
                           },
                           metadata: {
                              order_id: orderPaymentID
                           },
                        },
                     },
                  );

                  if (intErr) {
                     setOrderLoading(false);
                     return setMessage(intErr?.message, "danger");
                  }

                  if (paymentIntent?.id && paymentIntent?.payment_method && paymentIntent?.status === "succeeded") {
                     setMessage("Payment succeeded.", "success");
                     setConfirmLoading(true);
                     setOrderLoading(false);

                     const { success } = await apiHandler(`/order/confirm-order`, "POST", {
                        orderPaymentID: orderPaymentID,
                        paymentIntentID: paymentIntent?.id,
                        paymentMethodID: paymentIntent?.payment_method,
                        orderItems: orderItems
                     }, clientSecret);

                     if (success) {
                        setMessage("Order confirmed.", "success");
                        setConfirmLoading(false);

                        return router.push("/user/orders-management");
                     }
                  }
               }

            } else {
               setMessage(message, "danger");
               setOrderLoading(false);
            }
         }
      } catch (error) {
         setMessage(error?.message, 'danger');
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            <div className="mb-4">
               <Link href='/my-cart'> <FontAwesomeIcon icon={faLeftLong} /> Back To Cart</Link>
            </div>

            <div className="row">
               <div className="col-lg-8 mb-3">
                  <div className="cart_card">
                     <CartAddress
                        setMessage={setMessage}
                        authRefetch={authRefetch}
                        addr={userInfo?.buyer?.shippingAddress ? userInfo?.buyer?.shippingAddress : []}
                     />
                     <br />

                     <h6>Order Summary</h6>
                     <hr />
                     <div className="row px-3">
                        {
                           Array.isArray(state?.products) && state?.products.filter(p => p?.stock === "in").map((product) => {
                              return (
                                 <CartItem
                                    cartType={"toCart"}
                                    checkOut={true}
                                    product={product}
                                    key={product?.variationID}
                                 />
                              )
                           })
                        }
                     </div>

                  </div>


                  <br />
               </div>
               <div className="col-lg-4 mb-3">

                  <div className="cart_card">
                     <CartCalculation
                        product={(state?.container_p && state?.container_p)}
                        headTitle={"Order Details"}
                     />

                     <br />

                     <div className='p-1 d-flex align-items-center flex-column'>
                        <h6>Pay With Card</h6>
                        <form style={{
                           width: "100%"
                        }} onSubmit={buyBtnHandler}>
                           <div className="py-4">
                              <CardElement
                                 options={{
                                    style: {
                                       base: {
                                          iconColor: '#c4f0ff',
                                          color: '#000',
                                          fontWeight: '500',
                                          fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                                          fontSize: '16px',
                                          fontSmoothing: 'antialiased',
                                          ':-webkit-autofill': {
                                             color: '#fce88',
                                          },
                                          '::placeholder': {
                                             color: '#87BBFG',
                                          },
                                       },
                                       invalid: {
                                          color: '#9e2146',
                                       }
                                    }
                                 }}
                              />
                           </div>
                           {
                              !selectedAddress && <p>Please select shipping address.</p>
                           }

                           <button className='bt9_checkout' disabled={((state?.products && userInfo?.buyer?.defaultShippingAddress) || !orderLoading) ? false : true} type='submit'>
                              {
                                 orderLoading ? "Paying..." : confirmLoading ? "Confirming...." : "Pay Now"
                              }
                           </button>
                        </form>
                     </div>

                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}