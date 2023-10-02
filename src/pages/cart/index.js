import React from 'react';
import ProtectedHOC from '../_ProtectedHOC';
import CartCalculation from '@/Components/CartComponents/CartCalculation';
import Link from 'next/link';
import CartItem from '@/Components/CartComponents/CartItem';
import { useAuthContext } from '@/lib/AuthProvider';
import { useCartContext } from '@/lib/CartProvider';
import { v4 as uuidv4 } from 'uuid';

const Cart = () => {
   const { userInfo, setMessage } = useAuthContext();

   const { cartData, cartLoading, cartRefetch } = useCartContext();


   return (
      <div className='section_default'>
         <div className="container">

            <div className="row">
               <div className="col-lg-8 mb-3">
                  <div className="cart_card" style={cartLoading ? { opacity: "0.3" } : { opacity: "1" }}>
                     <h6>Total In Cart ({(cartData?.numberOfProduct && cartData?.numberOfProduct) || 0})</h6>
                     <hr />
                     {

                        (Array.isArray(cartData?.cartItems) && cartData?.cartItems.length >= 1) ? <CartItem
                           cartRefetch={cartRefetch}
                           products={cartData?.cartItems}
                           cartType={"toCart"}
                           setMessage={setMessage}
                           checkOut={false}
                        />
                           :
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
                        product={cartData?.cartCalculation && cartData?.cartCalculation}
                     />

                     <br />

                     <div className="text-center">

                        {
                           cartData?.numberOfProducts <= 0 ? "Please Add Product To Your Cart" :
                              <Link className='bt9_checkout' href={`/cart/checkout?session=${uuidv4()}`}>
                                 PROCEED TO CHECKOUT
                              </Link>
                        }
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>

   )
};

export default ProtectedHOC(Cart);