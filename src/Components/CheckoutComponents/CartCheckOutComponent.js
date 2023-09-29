
// Components/CheckoutComponents/CartCheckoutComponent.js

import { useRouter } from "next/router";
import { CardElement, useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js';
import CartAddress from "../CartComponents/CartAddress";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import CartItem from "../CartComponents/CartItem";
import CartCalculation from "../CartComponents/CartCalculation";
import { useState } from "react";
import { useAuthContext } from "@/lib/AuthProvider";
import { apiHandler } from "@/Functions/common";
import { useCartContext } from "@/lib/CartProvider";


export default function CartCheckoutComponent({ totalAmount, session }) {
   const { authRefetch, userInfo, setMessage } = useAuthContext();
   const router = useRouter();
   const [orderLoading, setOrderLoading] = useState(false);
   const [confirmLoading, setConfirmLoading] = useState(false);
   const { cartData, cartRefetch } = useCartContext();

   const stripe = useStripe();
   const elements = useElements();


   const selectedAddress = (userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress.find(e => e?.default_shipping_address === true)) || null;


   const handleServerResponse = async (response) => {
      if (!response?.success) return setMessage(response?.message, "danger");

      if (response.status === "requires_action") {

         const {
            error,
            paymentIntent
         } = await stripe.handleNextAction({
            clientSecret: response.clientSecret
         });

         if (error) {
            // Show error from Stripe.js in payment form
            return setMessage(error?.message, "danger");
         } else {
            // Actions handled, show success message

            setMessage("Payment success", "success");
         }
      }

      setMessage(response?.message, "success");
      router.push("/user/orders-management");

   }

   const buyBtnHandler = async (e) => {
      try {
         e.preventDefault();

         if (!selectedAddress) {
            return setMessage("Please select shipping address.", "danger");
         }

         if (!stripe || !elements) {
            return setMessage("Card initialization failed !", "danger");
         }

         // Trigger form validation and wallet collection
         const { error: submitError } = await elements.submit();

         if (submitError) {
            return;
         }

         const { error: pmErr, paymentMethod: pm } = await stripe.createPaymentMethod({
            elements,
            params: {
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
               }
            }
         });

         if (pmErr) {
            return setMessage(pmErr?.message, "danger");
         }


         setOrderLoading(true);
         const response = await apiHandler(`/order/cart-purchase/`, "POST", {
            state: "byCart",
            paymentMethodId: pm?.id,
            session
         });
         setOrderLoading(false);

         if (!response?.success) return setMessage(response?.message, "danger");

         return handleServerResponse(response);
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
                     {
                        userInfo?.buyer?.shippingAddress?.length >= 1 ?

                           <CartAddress
                              setMessage={setMessage}
                              authRefetch={authRefetch}
                              addr={userInfo?.shippingAddress ? userInfo?.shippingAddress : []}
                           /> : <Link className="bt9_primary my-3" href={`/user/address-book`}>Select Shipping Address</Link>
                     }
                     <br />

                     <h6>Order Summary</h6>
                     <hr />
                     <div className="row px-3">
                        <CartItem
                           cartType={"toCart"}
                           checkOut={true}
                           products={cartData?.cartItems}
                        />
                     </div>

                  </div>


                  <br />
               </div>
               <div className="col-lg-4 mb-3">

                  <div className="cart_card">
                     <CartCalculation
                        product={(cartData?.cartCalculation && cartData?.cartCalculation)}
                        headTitle={"Order Details"}
                     />

                     <br />

                     <div className='p-1 d-flex align-items-center flex-column'>
                        <h6>Pay With Card</h6>
                        <form style={{
                           width: "100%"
                        }} onSubmit={buyBtnHandler}>
                           <div className="py-4">
                              <PaymentElement />
                              {/* <CardElement id="card-element"
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
                              /> */}
                           </div>
                           {
                              !selectedAddress && <p>Please select shipping address.</p>
                           }

                           {
                              (orderLoading || confirmLoading) ?
                                 <span style={{ padding: "5px 8px" }}>{orderLoading ? "Paying..." : "Confirming..."}</span> : <button className='bt9_checkout' disabled={(cartData?.cartItems && userInfo?.buyer?.defaultShippingAddress) ? false : true} type='submit'>
                                    Confirm Order
                                 </button>
                           }
                        </form>
                     </div>

                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}