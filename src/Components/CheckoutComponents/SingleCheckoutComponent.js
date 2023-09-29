// Components/CheckoutComponents/SingleCheckoutComponent.js


import CartCalculation from "../CartComponents/CartCalculation";
import CartItem from "../CartComponents/CartItem";
import { useAuthContext } from "@/lib/AuthProvider";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CardElement, useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js';
import CartAddress from "../CartComponents/CartAddress";
import { CookieParser, apiHandler, deleteAuth } from "@/Functions/common";


export default function SingleCheckoutComponent() {
   const router = useRouter();

   const { data: queryData, session } = router.query;

   const { userInfo, authLoading, authRefetch, setMessage } = useAuthContext();
   const [data, setData] = useState({});
   const [productData, setProductData] = useState((queryData && JSON.parse(queryData)) || {});
   const [orderLoading, setOrderLoading] = useState(false);

   const stripe = useStripe();
   const elements = useElements();

   const selectedAddress = userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress.find(e => e?.default_shipping_address === true);

   useEffect(() => {

      const cookie = CookieParser();

      const fetchData = setTimeout(() => {
         (async () => {

            const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/product/purchase`, {
               method: "POST",
               credentials: "include",
               headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${cookie?.appSession ? cookie?.appSession : ""}`
               },
               body: JSON.stringify(productData)
            });

            if (response.status === 401) { return deleteAuth() };

            const result = await response.json();

            if (result?.success) {
               setData(result?.data?.module);
            }
         })();
      }, 0);

      return () => clearTimeout(fetchData);
   }, [productData]);



   const buyBtnHandler = async (e) => {
      try {
         e.preventDefault();

         if (!stripe || !elements) {
            return;
         }

         // const card = elements.getElement(CardElement);

         // if (!card) {
         //    return;
         // }

         // if (card === null) {
         //    return;
         // }

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

         const { productId, quantity, sku } = JSON.parse(queryData);

         if (productId && quantity && sku && pm) {

            const response = await apiHandler(`/order/single-purchase`, "POST", {
               productId,
               sku,
               quantity,
               paymentMethodId: pm?.id,
               session
            });


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
         } else {
            return setMessage("Missing fields !", "danger");
         }
      } catch (error) {
         return setMessage(error?.message, "danger");
      } finally {
         setOrderLoading(false);
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
                  <div className='cart_card'>

                     <CartAddress
                        authRefetch={authRefetch}
                        setMessage={setMessage}
                        addr={userInfo && userInfo?.buyer?.shippingAddress ? userInfo?.buyer?.shippingAddress : []}
                     />

                     <br />
                     <h6>Order Summary</h6>
                     <hr />
                     <div className="row px-3">
                        {
                           <CartItem
                              cartType={"buy"}
                              checkOut={false}
                              setState={setProductData}
                              setMessage={setMessage}
                              products={data?.cartItems && data?.cartItems}
                           />
                        }
                     </div>

                  </div>
               </div>
               <div className="col-lg-4 mb-3">
                  <div className="cart_card">

                     <CartCalculation
                        product={data?.cartCalculation && data?.cartCalculation}
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
                              {/* <CardElement
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
                              (orderLoading) ?
                                 <span style={{ padding: "5px 8px" }}>Confirming...</span> :
                                 <button className='bt9_checkout' disabled={((data?.cartItems && selectedAddress)) ? false : true} type='submit'>
                                    Confirm Now
                                 </button>
                           }
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}
