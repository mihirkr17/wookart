import { apiHandler } from '@/Functions/common';
import { useAuthContext } from '@/lib/AuthProvider';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';

const CartItem = ({ product: cartProduct, cartRefetch, checkOut, cartType, state, setState }) => {
   const [qtyLoading, setQtyLoading] = useState(false);
   const [loading, setLoading] = useState(false);
   const { setMessage } = useAuthContext();

   //  Remove product from cartProduct && cartProduct handler
   const removeItemFromCartHandler = async (cp) => {
      try {
         setLoading(true);

         const { productID, title, variationID } = cp;
         const result = await apiHandler(`/cart/delete-cart-item/${cartType && cartType}?vr=${variationID}`, "DELETE", {}, productID);

         if (result?.success) {
            setMessage(`${title} ${result?.message}`, 'success');
            cartRefetch();
         } else {
            setMessage(`${title} ${result?.message}`, 'danger');
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      } finally {
         setLoading(false);
      }
   }


   const itemQuantityHandler = async (value, productID, variationID, cartID) => {
      try {
         setQtyLoading(true);
         let quantity = parseInt(value);

         if (cartType === 'buy' && state) {
            setQtyLoading(false);
            let qty = (state.quantity = quantity);
            setMessage("Quantity updated to " + qty, "success");
            setState({ ...state, qty });
            return;
         }

         const { message, success, statusCode } = await apiHandler(`/cart/update-cart-product-quantity`, "PUT", {
            actionRequestContext: {
               pageUri: '/my-cart',
               type: cartType,
               pageNumber: 1
            },
            upsertRequest: {
               cartContext: {
                  productID, variationID, quantity: quantity, cartID
               }
            }
         }, productID);

         setQtyLoading(false);

         if (success === true && statusCode >= 200) {
            cartRefetch();
            setMessage(message, 'success');
            return;
         }

         setMessage(message, 'danger');

      } catch (error) {
         return setMessage(error?.message, 'danger');
      }
   }

   function getVariant(obj = {}) {
      const newObj = Object.entries(obj);
      const arr = [];

      for (let [key, value] of newObj) {
         arr.push(
            <small key={key} className="text-muted">{key}:&nbsp;{value.split(",")[0]}</small>
         );
      }

      return arr;
   }

   return (
      <>
         {loading && <div className="text-center py-2">Removing...</div>}
         <div className="mb-2 cart_wrapper">
            <div className="c_list1">
               <div className="c_img">
                  {qtyLoading ? "Loading" : <img src={cartProduct?.image && cartProduct?.image} alt="" />}
               </div>

               {
                  !checkOut &&
                  <div className="ms-2 c_btn">

                     <button
                        className='badge bg-primary my-1'
                        disabled={cartProduct && cartProduct?.quantity <= 1 ? true : false}
                        onClick={() => itemQuantityHandler(parseInt(cartProduct?.quantity) - 1, cartProduct?.productID, cartProduct?.variationID, cartProduct?.cartID)}>
                        -
                     </button>

                     <input
                        className='border px-2' type="number"
                        value={cartProduct?.quantity || 0}
                        onChange={(e) => itemQuantityHandler(e.target.value, cartProduct?.productID, cartProduct?.variationID, cartProduct?.cartID)}
                        maxLength='3'
                        style={{ width: '50px' }}
                     />

                     <button
                        className='badge bg-primary my-1'
                        disabled={cartProduct && cartProduct?.quantity >= cartProduct && cartProduct?.variations?.available ? true : false}
                        onClick={() => itemQuantityHandler(parseInt(cartProduct?.quantity) + 1, cartProduct?.productID, cartProduct?.variationID, cartProduct?.cartID)}>
                        +
                     </button>
                  </div>
               }
            </div>

            <div className="c_list2">
               <div className='c_meta_info'>

                  <b className="c_title">
                     <Link href={`/product/${cartProduct?.slug}?pId=${cartProduct?.productID}&vId=${cartProduct?.variationID}`}>
                        {cartProduct && cartProduct?.title}
                     </Link>
                  </b>

                  <div className="c_meta">
                     <big className="c_price currency_sign">
                        {cartProduct?.sellingPrice}
                     </big>
                     {
                        getVariant(cartProduct?.variant)
                     }
                     <small className="text-muted">Qty : {cartProduct?.quantity}</small>
                     <small className="text-muted">Stock : {cartProduct?.stock}</small>
                  </div>
               </div>
               {
                  !checkOut && <div className="remove_btn text-end">
                     {
                        cartType !== "buy" && <button className='btn btn-sm' onClick={() => removeItemFromCartHandler(cartProduct)}>
                           <FontAwesomeIcon icon={faClose} />
                        </button>
                     }
                  </div>
               }

            </div>
         </div>
      </>
   );
};

export default CartItem;