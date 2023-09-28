
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


   let productIds = cartData?.cart_context && cartData?.cart_context?.map((p) => p?.productId);

   const stripe = useStripe();
   const elements = useElements();

   // console.log(totalAmount);

   const tm = totalAmount;

   const selectedAddress = (userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress.find(e => e?.default_shipping_address === true)) || null;


   const handleServerResponse = async (response) => {
      if (response?.message) return setMessage(response?.message, "danger");

      if (response.status === "requires_action") {
         // Use Stripe.js to handle the required next action
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

            return setMessage("Payment success", "success");
         }
      }

      let products = cartData?.cart_context && cartData?.cart_context;
      setOrderLoading(true);

      const { productInfos, message, success } =
         await apiHandler(`/order/cart-purchase/`, "POST", {
            state: "byCart",
            cartItems: products, totalAmount,
            paymentIntentId: response?.paymentIntentId
         });

      setOrderLoading(false);

      setMessage("Payment success 2", "success");

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


         const data = await apiHandler(`/payment/create-payment-intent`, "POST", {
            totalAmount: tm, session, paymentMethodId: pm?.id, productIds: productIds.join(", ") || ""
         });

         // if (!clientSecret) return setMessage("Payment intent creation failed !", "danger");

         return handleServerResponse(data);

         // Confirm the PaymentIntent using the details collected by the Payment Element
         const { error: err } = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
               return_url: 'https://example.com/order/123/complete',
            },
         });

         console.log(err);
         return setMessage(err?.message, "danger");

         // Use your card Element with other Stripe.js APIs
         const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card });

         if (error) {
            return setMessage(error?.message, "danger")
         }

         let products = cartData?.cart_context && cartData?.cart_context;

         if (!Array.isArray(products) || products.length <= 0) {
            return setMessage("Please select product in your cart !", "danger");
         }

         setOrderLoading(true);

         const { orderPaymentID, paymentIntentID, orderIDs, totalAmount, productInfos, message, success } =
            await apiHandler(`/order/cart-purchase/`, "POST", { state: "byCart", cartItems: products, totalAmount });

         setOrderLoading(false);


         if (!success || !clientSecret || !orderPaymentID) {
            return setMessage(message, "danger");
         }

         setMessage(message, "success");

         // const resutl = await Promise.all(paymentData?.map(async (pData) => {
         //    const {clientSecret, orderPaymentID} = pData;

         //    const { paymentIntent, error: intErr } = await stripe.confirmCardPayment(
         //       clientSecret,
         //       {
         //          payment_method: {
         //             card: card,
         //             billing_details: {
         //                name: selectedAddress?.name,
         //                email: userInfo?.email,
         //                phone: selectedAddress?.phone_number,
         //                address: {
         //                   city: selectedAddress?.city,
         //                   state: selectedAddress?.division,
         //                   line1: selectedAddress?.area,
         //                   line2: selectedAddress?.landmark,
         //                   country: "BD"
         //                }
         //             },
         //             metadata: {
         //                order_id: orderPaymentID
         //             },
         //          },
         //       },
         //    );

         //    if (intErr) {
         //       setOrderLoading(false);
         //       return setMessage(intErr?.message, "danger");
         //    }

         // }));

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
               orderIDs,
               clientSecret,
               productInfos,
               orderState: "byCart"
            });

            if (success) {
               cartRefetch();
               setMessage("Order confirmed.", "success");
               setConfirmLoading(false);

               return router.push("/user/orders-management");
            }
         }





         // if (Array.isArray(products) && products.length >= 0 && paymentMethod) {

         //    setOrderLoading(true);

         //    const { clientSecret, orderPaymentID, orderItems, message, success } = await apiHandler(`/order/set-order/`, "POST", { state: "byCart", paymentMethod }, userInfo?.email);

         //    if (success) {

         //       if (success && clientSecret && orderPaymentID && orderItems) {

         //          setMessage(message, "success");

         //          const { paymentIntent, error: intErr } = await stripe.confirmCardPayment(
         //             clientSecret,
         //             {
         //                payment_method: {
         //                   card: card,
         //                   billing_details: {
         //                      name: selectedAddress?.name,
         //                      email: userInfo?.email,
         //                      phone: selectedAddress?.phone_number,
         //                      address: {
         //                         city: selectedAddress?.city,
         //                         state: selectedAddress?.division,
         //                         line1: selectedAddress?.area,
         //                         line2: selectedAddress?.landmark,
         //                         country: "BD"
         //                      }
         //                   },
         //                   metadata: {
         //                      order_id: orderPaymentID
         //                   },
         //                },
         //             },
         //          );

         //          if (intErr) {
         //             setOrderLoading(false);
         //             return setMessage(intErr?.message, "danger");
         //          }

         //          if (paymentIntent?.id && paymentIntent?.payment_method && paymentIntent?.status === "succeeded") {
         //             setMessage("Payment succeeded.", "success");
         //             setConfirmLoading(true);
         //             setOrderLoading(false);

         //             const { success } = await apiHandler(`/order/confirm-order`, "POST", {
         //                orderPaymentID: orderPaymentID,
         //                paymentIntentID: paymentIntent?.id,
         //                paymentMethodID: paymentIntent?.payment_method,
         //                orderItems: orderItems
         //             }, clientSecret);

         //             if (success) {
         //                setMessage("Order confirmed.", "success");
         //                setConfirmLoading(false);

         //                return router.push("/user/orders-management");
         //             }
         //          }
         //       }

         //    } else {
         //       setMessage(message, "danger");
         //       setOrderLoading(false);
         //    }
         // }
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
                           products={cartData?.cart_context}
                        />
                     </div>

                  </div>


                  <br />
               </div>
               <div className="col-lg-4 mb-3">

                  <div className="cart_card">
                     <CartCalculation
                        product={(cartData?.cart_calculation && cartData?.cart_calculation)}
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
                                 <span style={{ padding: "5px 8px" }}>{orderLoading ? "Paying..." : "Confirming..."}</span> : <button className='bt9_checkout' disabled={(cartData?.cart_context && userInfo?.buyer?.defaultShippingAddress) ? false : true} type='submit'>
                                    Pay Now
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