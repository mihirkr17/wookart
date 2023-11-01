import { apiHandler } from '@/Functions/common';
import { faClose, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';

const CartItem = ({ products, cartRefetch, checkOut, cartType, setState, setMessage }) => {
   const [qtyLoading, setQtyLoading] = useState(false);
   const [loading, setLoading] = useState(false);


   const removeItemFromCartHandler = async (cp) => {
      try {
         setLoading(true);

         const { productId, title, sku } = cp;
         const { success, message } = await apiHandler(`/cart/delete-cart-item/${productId}/${sku}/${cartType && cartType}`, "DELETE", {});

         setLoading(false);

         if (success) {
            setMessage(`${title} ${message}`, 'success');
            cartRefetch();
         } else {
            setMessage(`${title} ${message}`, 'danger');
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      } finally {
         setLoading(false);
      }
   }


   const itemQuantityHandler = async (value, productID, sku, cartID) => {
      try {
         setQtyLoading(true);
         let quantity = parseInt(value);

         if (cartType === 'buy' && setState) {
            setQtyLoading(false);
            setMessage("Quantity updated to " + quantity, "success");
            setState((state) => ({ ...state, quantity }));
            return;
         }

         const { message, success } = await apiHandler(`/cart/update-cart-product-quantity`, "PUT", {
            actionRequestContext: {
               pageUri: '/cart',
               type: cartType,
               pageNumber: 1
            },
            upsertRequest: {
               cartContext: {
                  productID, sku, quantity: quantity, cartID
               }
            }
         });

         setQtyLoading(false);

         if (!success) {
            return setMessage("Something went wrong !", 'danger')
         } else {
            cartRefetch();
            return setMessage(message, 'success');
         };
      } catch (error) {
         return setMessage(error?.message, 'danger');
      }
   }

   function printAttributes(obj = {}) {
      const newObj = Object.entries(obj);
      let str = "";

      for (let [key, value] of newObj) {
         str += `${key}: ${value.split(",")[0]}, `;
      }

      return str.slice(0, str.lastIndexOf(',')) + str.slice(str.lastIndexOf(',') + 1);
   }

   return (
      <>
         {loading && <div className="text-center py-2">Removing...</div>}

         {
            Array.isArray(products) && products.map((item, i) => {

               return (
                  <div key={i} className="mb-2 cart_wrapper">
                     <div className="c_list1">
                        <div className="c_img">
                           {qtyLoading ? "Loading" : <img src={item?.imageUrl ?? ""} alt="" />}
                        </div>

                        {
                           !checkOut &&
                           <div className="ms-2 c_btn">

                              <button
                                 className='badge bg-primary my-1'
                                 disabled={item?.quantity <= 1 ? true : false}
                                 onClick={() => itemQuantityHandler(parseInt(item?.quantity) - 1, item?.productId, item?.sku, item?._id)}>
                                 -
                              </button>

                              <input
                                 className='border px-2' type="number"
                                 value={item?.quantity || 0}
                                 onChange={(e) => itemQuantityHandler(e.target.value, item?.productId, item?.sku, item?._id)}
                                 maxLength='5'
                                 style={{ width: '50px' }}
                              />

                              <button
                                 className='badge bg-primary my-1'
                                 disabled={item?.quantity >= item?.available ? true : false}
                                 onClick={() => itemQuantityHandler(parseInt(item?.quantity) + 1, item?.productId, item?.sku, item?._id)}>
                                 +
                              </button>
                           </div>
                        }
                     </div>

                     <div className="c_list2">
                        <div className='c_meta_info'>

                           <b className="c_title">
                              <Link href={`/product/${item?.slug}?pId=${item?.productId}&sku=${item?.sku}`}>
                                 {item?.title}
                              </Link>
                           </b>

                           <div className="d-flex flex-column">
                              <div>
                                 <big className='currency_sign text-success fw-bold'>{item?.sellingPrice.toLocaleString()}&nbsp;&nbsp;</big>
                                 <small><strike className='currency_sign text-muted'>{item?.price.toLocaleString()}</strike>&nbsp;&nbsp;{-item?.initialDiscount}%</small>
                              </div>


                              <div className='d-flex flex-wrap flex-column'>

                                 <strong>
                                    <small className='text-muted'>Sold By: {item?.storeTitle},  Stock: {item?.stock}</small>
                                 </strong>

                                 <small className='text-muted'>
                                    {
                                       printAttributes(item?.attributes)
                                    }
                                 </small>
                              </div>
                           </div>
                        </div>
                        {
                           !checkOut && <div className="remove_btn text-end">
                              {
                                 cartType !== "buy" && <button className='btn btn-sm' onClick={() => removeItemFromCartHandler(item)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                 </button>
                              }
                           </div>
                        }

                     </div>
                  </div >
               )
            })
         }

      </>
   );
};

export default CartItem;