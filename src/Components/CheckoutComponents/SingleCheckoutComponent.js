// Components/CheckoutComponents/SingleCheckoutComponent.js


import CartCalculation from "../CartComponents/CartCalculation";
import CartItem from "../CartComponents/CartItem";
import { useAuthContext } from "@/lib/AuthProvider";
import { faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CartAddress from "../CartComponents/CartAddress";
import { apiHandler } from "@/Functions/common";


export default function SingleCheckoutComponent() {
   const router = useRouter();

   const { data: queryData, oTracker } = router.query;

   const { userInfo, authLoading, authRefetch, setMessage } = useAuthContext();
   const [data, setData] = useState({});
   const [productData, setProductData] = useState((queryData && JSON.parse(queryData)) || {});
   const [orderLoading, setOrderLoading] = useState(false);

   const stripe = useStripe();
   const elements = useElements();

   const selectedAddress = userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress.find(e => e?.default_shipping_address === true);


   useEffect(() => {

      const fetchData = setTimeout(() => {
         (async () => {

            const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/product/purchase`, {
               method: "POST",
               withCredentials: true,
               credentials: "include",
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify(productData)
            });

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
         let clientSecret;
         let orderPaymentID;

         let product = data?.product ? data?.product : null;

         if (!product) {
            return setMessage("Please select product first", "danger");
         }

         if (!stripe || !elements) {
            return;
         }

         const card = elements.getElement(CardElement);

         if (!card) {
            return;
         }

         if (card === null) {
            return;
         }

         // Use your card Element with other Stripe.js APIs
         const { error, paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card });


         if (error) {
            return setMessage(error?.message, "danger");
         }

         setOrderLoading(true);

         if (data?.container_p?.finalAmounts && paymentMethod) {

            const { success, message, clientSecret, productInfos, orderPaymentID, totalAmount } = await apiHandler(`/order/single-purchase`, "POST", {
               productID: product?.productID,
               listingID: product?.listingID,
               variationID: product?.variationID,
               quantity: product?.quantity,
               customerEmail: product?.customerEmail,
               state: "byPurchase"
            });

            if (!success) {
               setMessage(message, "danger");
               return;
            };

            const { paymentIntent, error } = await stripe.confirmCardPayment(
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

            if (error) {
               setOrderLoading(false);
               return setMessage(error?.message, "danger");
            }

            if (!paymentIntent?.id) {
               setOrderLoading(false);
               return;
            }

            setOrderLoading(true);


            if (!paymentIntent?.payment_method) {
               return setMessage("Payment method failed !", "danger");
            }

            if (paymentIntent?.id && paymentIntent?.payment_method && paymentIntent?.status === "succeeded") {
               setMessage("Payment succeeded.", "success");

               setOrderLoading(false);

               const { success } = await apiHandler(`/order/confirm-order`, "POST", {
                  orderPaymentID,
                  paymentIntentID: paymentIntent?.id,
                  paymentMethodID: paymentIntent?.payment_method,
                  productInfos,
                  orderState: "byPurchase"
               });

               if (success) {
                  setMessage("Order confirmed.", "success");
                  return router.push("/user/orders-management");
               }
            }

            return;

            data["paymentMethodID"] = paymentIntent?.payment_method;

            const result = await apiHandler(`/order/confirm-single-purchase-order`, "POST", data);

            if (result.success) {
               setOrderLoading(false);
               return router.push("/user/orders-management");

            } else {
               setOrderLoading(false);
            }



            // const { success, message, clientSecret, orderPaymentID } = await apiHandler(`/payment/create-payment-intent`, "POST", {
            //    totalAmount: parseInt(data?.container_p?.finalAmounts)
            // });

            // if (!success) {
            //    setOrderLoading(false);
            //    return setMessage(message, "danger");
            // }

            // if (clientSecret && orderPaymentID) {

            //    const { paymentIntent, error } = await stripe.confirmCardPayment(
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

            //    if (error) {
            //       setOrderLoading(false);
            //       return setMessage(error?.message, "danger");
            //    }

            //    if (!paymentIntent?.id) {
            //       setOrderLoading(false);
            //       return;
            //    }

            //    setOrderLoading(true);

            //    const result = await apiHandler(`/order/single-purchase`, "POST", {
            //       productID: product?.productID,
            //       listingID: product?.listingID,
            //       variationID: product?.variationID,
            //       quantity: product?.quantity,
            //       customerEmail: product?.customerEmail,
            //       state: "byPurchase",
            //       orderPaymentID,
            //       paymentMethodID: paymentIntent?.payment_method,
            //       paymentIntentID: paymentIntent?.id,
            //    }, userInfo?.email);

            //    if (result.success) {
            //       setOrderLoading(false);
            //       return router.push("/user/orders-management");

            //    } else {
            //       setOrderLoading(false);
            //    }
            // } else {
            //    setOrderLoading(false);
            //    return setMessage("Payment intent creation failed !", "danger");
            // }

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
                              state={productData}
                              setState={setProductData}
                              setMessage={setMessage}
                              product={data?.product && data?.product}
                           />
                        }
                     </div>

                  </div>
               </div>
               <div className="col-lg-4 mb-3">
                  <div className="cart_card">

                     <CartCalculation
                        product={data?.container_p && data?.container_p}
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

                           {
                              (orderLoading) ?
                                 <span style={{ padding: "5px 8px" }}>Confirming...</span> :
                                 <button className='bt9_checkout' disabled={((data?.product && selectedAddress)) ? false : true} type='submit'>
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
   )
}
