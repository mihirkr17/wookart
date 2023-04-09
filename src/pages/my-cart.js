import CartCalculation from "@/Components/CartComponents/CartCalculation";
import CartItem from "@/Components/CartComponents/CartItem";
import Spinner from "@/Components/Shared/Spinner/Spinner";
import { CookieParser, deleteAuth } from "@/Functions/common";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import { useAuthContext } from "@/lib/AuthProvider";
import RequiredAuth from "@/Middlewares/RequiredAuth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default withOutDashboard(function MyCart() {

   const [cartLoading, setCartLoading] = useState(false);
   const [cartData, setCartData] = useState({});
   const [cartError, setCartError] = useState("");
   const [cartRef, setCartRef] = useState(false);
   const { userInfo, setMessage } = useAuthContext();

   const cartRefetch = () => setCartRef(e => !e);

   useEffect(() => {

      const { cart_data } = CookieParser();

      const startFetch = setTimeout(() => {
         (async () => {
            try {
               setCartLoading(true);

               const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/cart/cart-context`, {
                  method: "POST",
                  withCredentials: true,
                  credentials: "include",
                  headers: {
                     "Content-type": "application/json"
                  },
                  body: cart_data
               });

               const result = await response.json();

               if (response.status === 401) {
                  deleteAuth();
               }

               if (!response.ok) {
                  setCartLoading(false);
               }

               if (result?.statusCode === 200 && result?.success === true) {
                  setCartLoading(false);
                  setCartData(result?.data?.module);
               }
            } catch (error) {
               setCartError(error?.message);
            } finally {
               setCartLoading(false);
            }
         })();
      }, 0);

      return () => clearTimeout(startFetch);
   }, [cartRef]);

   return (
      <RequiredAuth>
         <div className='section_default'>
            <div className="container">

               <div className="row">
                  <div className="col-lg-8 mb-3">
                     <div className="cart_card">
                        <h6>Total In Cart ({(cartData?.numberOfProducts && cartData?.numberOfProducts) || 0})</h6>
                        <hr />
                        {
                           cartLoading ? <Spinner></Spinner> : Array.isArray(cartData?.products) && cartData?.numberOfProducts > 0 ? cartData?.products.map(product => {
                              return (
                                 <CartItem
                                    key={product?.variationID}
                                    cartRefetch={cartRefetch}
                                    product={product}
                                    cartType={"toCart"}
                                    checkOut={false}
                                    items={cartData?.numberOfProducts}
                                 />
                              )
                           }) :
                              <div className="card_default">
                                 <div className="card_description">
                                    <h3 className="cart_title">No Product Available In Your Cart</h3>
                                 </div>
                              </div>
                        }
                     </div>
                  </div>
                  <div className="col-lg-4 mb-3">
                     <div className="cart_card">
                        <CartCalculation
                           product={cartData?.container_p && cartData?.container_p}
                        />

                        <br />

                        <div className="text-center">

                           {
                              cartData?.numberOfProducts <= 0 ? "Please Add Product To Your Cart" :
                                 <Link className='bt9_checkout' href={{
                                    pathname: `/checkout`,
                                    query: {
                                       spa: `${userInfo?._uuid + "cart.proceed_to_checkout"}`,
                                       data: JSON.stringify(cartData && cartData)
                                    }
                                 }} as={`/checkout?spa=${userInfo?._uuid + "cart.proceed_to_checkout"}`}>
                                    Proceed To Checkout
                                 </Link>
                           }
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </RequiredAuth>
   )
}, [])