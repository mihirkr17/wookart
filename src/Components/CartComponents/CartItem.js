import { apiHandler } from '@/Functions/common';
import { faClose, faMinus, faPlus, faTrash, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { useState } from 'react';
import swal from 'sweetalert';


const CartItem = ({ products, cartRefetch, checkOut, cartType, setState, setMessage }) => {
   const [qtyLoading, setQtyLoading] = useState(false);
   const [loading, setLoading] = useState(false);


   const removeItemFromCartHandler = async (title, cartId) => {
      try {

         const willDelete = await swal({
            title: "Are you sure?",
            text: "Want to delete " + title + " from cart ?",
            icon: "warning",
            dangerMode: true,
            confirmButtonText: "Cool"
         });

         if (!willDelete) return;

         setLoading(true);

         const { success, message } = await apiHandler(`/cart/delete-cart-item/${cartId}`, "DELETE", {});

         setLoading(false);

         if (success) {
            swal("Deleted!", "Your imaginary file has been deleted!", "success");

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



   const itemQuantityHandler = async (value, productId, sku, cartId) => {
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
            productId, sku, quantity, cartId
         });

         setQtyLoading(false);

         if (!success) {
            return setMessage(message, 'danger')
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
                           {qtyLoading ? "Loading" : <img src={item?.image?.src ?? ""} alt="" />}
                        </div>

                        {
                           !checkOut ?
                              <div className="ms-2 c_btn">

                                 <button
                                    className='bt9_edit px-2 my-1'
                                    disabled={item?.quantity <= 1 ? true : false}
                                    onClick={() => itemQuantityHandler(parseInt(item?.quantity) - 1, item?.productId, item?.sku, item?._id)}>
                                    <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
                                 </button>

                                 <input
                                    className='border px-2' type="number"
                                    value={item?.quantity || 0}
                                    onChange={(e) => itemQuantityHandler(e.target.value, item?.productId, item?.sku, item?._id)}
                                    maxLength='5'
                                    style={{ width: '50px' }}
                                 />

                                 <button
                                    className='bt9_edit px-2 my-1'
                                    disabled={item?.quantity >= item?.available ? true : false}
                                    onClick={() => itemQuantityHandler(parseInt(item?.quantity) + 1, item?.productId, item?.sku, item?._id)}>
                                    <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
                                 </button>
                              </div> :
                              <small className='text-muted'>Qty: {item?.quantity}</small>

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
                                 <big className='currency_sign text-success fw-bold'>{item?.sellPrice?.toLocaleString()}&nbsp;&nbsp;</big>
                                 <small><strike className='currency_sign text-muted'>{item?.stockPrice?.toLocaleString()}</strike>&nbsp;&nbsp;{-item?.initialDiscount}%</small>
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
                                 cartType !== "buy" && <button className='btn btn-sm' onClick={() => removeItemFromCartHandler(item?.title, item?._id)}>
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