import CartCalculation from "@/Components/CartComponents/CartCalculation";
import CartItem from "@/Components/CartComponents/CartItem";
import Spinner from "@/Components/Shared/Spinner/Spinner";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import { useAuthContext } from "@/lib/AuthProvider";
import { useCartContext } from "@/lib/CartProvider";
import RequiredAuth from "@/Middlewares/RequiredAuth";
import Link from "next/link";

export default withOutDashboard(function MyCart() {

   const { userInfo } = useAuthContext();

   const { cartData, cartLoading, cartRefetch } = useCartContext();

   return (
      <RequiredAuth>
         <div className='section_default'>
            <div className="container">

               <div className="row">
                  <div className="col-lg-8 mb-3">
                     <div className="cart_card" style={cartLoading ? { opacity: "0.3" } : { opacity: "1" }}>
                        <h6>Total In Cart ({(cartData?.numberOfProducts && cartData?.numberOfProducts) || 0})</h6>
                        <hr />
                        {
                           Array.isArray(cartData?.products) && cartData?.numberOfProducts > 0 ? cartData?.products.map(product => {
                              return (
                                 <CartItem
                                    key={product?.variationID}
                                    cartRefetch={cartRefetch}
                                    product={product}
                                    cartType={"toCart"}
                                    checkOut={false}
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