// src/Components/UserComponents/ManageOrderModal.js

import { useEffect, useMemo, useRef, useState } from "react";
import ModalWrapper from "../Global/ModalWrapper";
import FilterOption from "../Shared/FilterOption";
import { apiHandler } from "@/Functions/common";
import useMenu from "@/Hooks/useMenu";
import React from "react";
import Spinner from "../Shared/Spinner/Spinner";

function ManageOrderModal({ closeModal, data, setMessage, refetch, userInfo, router }) {
   const [openCancelForm, setOpenCancelForm] = useState(false);
   const [reason, setReason] = useState("");
   const { menuRef, openMenu, setOpenMenu } = useMenu();
   const [cancelLoading, setCancelLoading] = useState(false);

   const { amount, orderStatus, isCanceled,
      paymentMode, customer, orderPlacedAt, supplier, paymentStatus,
      product,
      quantity,
      _id,
      sellingPrice,
      shipping_charge,
      imageUrl,
      productId, sku
   } = data;


   const handleCancelOrder = async (e, order) => {
      e.preventDefault();

      const { orderID, customerEmail, product } = order;

      if (reason === "Choose Reason" || reason === "") {
         setMessage(<strong className='text-success'>Please Select Cancel Reason...</strong>);
         return;
      } else {
         setCancelLoading(true);
         const { message, success } = await apiHandler(`/order/cancel-my-order/${customerEmail}`, "POST", { cancelReason: reason, orderID, product });
         setCancelLoading(false)
         if (success) {
            setMessage(message, 'success');
            closeModal();
            refetch();
         }
      }
   }

   const removeOrderHandler = async (orderID, customerEmail) => {

      if (window.confirm("Want to cancel this order ?")) {
         const { success, message } = await apiHandler(`/order/remove-order/${customerEmail}/${orderID}`, "DELETE", {});

         if (success) {
            setMessage(message, 'success');
            closeModal();
            refetch();
            return;
         }

         return setMessage(message, "danger");
      }
   }


   function cancelTemplate(orderID, customerEmail, product) {
      return (
         <>
            <button className="btn btn-sm text-danger"
               onClick={() => setOpenCancelForm(orderID)}
               style={openCancelForm !== orderID ? { display: "inline-block" } : { display: "none" }}>
               Cancel This Order
            </button>

            {
               cancelLoading ? <p style={{ color: "red" }}>Canceling...</p> :
                  <div className="py-4" style={openCancelForm === orderID ? { display: "block" } : { display: "none" }}>
                     <form onSubmit={(e) => handleCancelOrder(e, { orderID, customerEmail, product })} >
                        <label htmlFor="reason">Select Reason</label>
                        <div className="form-group d-flex">

                           <FilterOption
                              options={[
                                 "Choose Reason",
                                 "i_want_to_order_a_different_product",
                                 "i_am_getting_better_price",
                                 "i_want_to_re_order_using_promo_code",
                                 "i_placed_the_order_by_mistake"
                              ]} filterHandler={setReason} />
                        </div>
                        <button type="submit" className="bt9_warning">Cancel Order</button>
                     </form>
                     <button className='btn btn-sm'
                        onClick={() => setOpenCancelForm(e => e = false)}
                        style={openCancelForm === orderID ? { display: "block" } : { display: "none" }}>
                        Back
                     </button>
                  </div>
            }

         </>
      )
   }

   return (
      <ModalWrapper closeModal={closeModal} >
         <div className="p-1 pt-3" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row"
         }}>
            <span>Order: {_id}
               <br />
               <small className="textMute">Placed on {new Date(orderPlacedAt).toLocaleDateString() + ", " + new Date(orderPlacedAt).toLocaleTimeString()}</small>
            </span>
            <span>Total: <b className="currency_sign">{amount}</b></span>
         </div>

         <hr />

         <div className="p-1 row">
            <div className="col-lg-6" ref={menuRef} style={{ position: "relative" }}>
               <small>Sold by
                  <b onClick={() => setOpenMenu(e => !e)}
                     style={{ color: "blue", cursor: "pointer" }}>
                     &nbsp;{supplier?.store_name}
                  </b>
               </small>

               {
                  openMenu && <div className="sellerInfoMenu">
                     Seller Email: {supplier?.email}
                  </div>
               }
            </div>

            <div className="col-lg-6" style={{ textAlign: "end" }}>
               {
                  orderStatus === "canceled" && isCanceled ?
                     <button className='btn btn-sm text-uppercase text-muted' onClick={() => removeOrderHandler(_id, customer?.email)}>
                        Remove
                     </button> :
                     cancelTemplate(_id, customer?.email, {
                        productID: product?.product_id,
                        listingID: product?.listing_id,
                        sku: product?.sku,
                        quantity,
                        title: product?.title,
                        finalAmount: amount,
                        sellerEmail: supplier?.email
                     })
               }
            </div>
         </div>

         <hr />

         <div className="p-3">

            <div style={{
               display: "flex",
               alignItems: "center",
               justifyContent: "flex-start",
               flexDirection: "row",
               fontSize: "0.8rem",
               flexWrap: "wrap",
               marginBottom: "18px"
            }}>
               <div style={{ marginRight: "14px" }}>
                  <img src={imageUrl ?? ""} width={55} height={55} alt="" />
               </div>
               <div>
                  <b>{product?.title}</b> <br />
                  <small>
                     Selling Price: {sellingPrice} <br />
                     Quantity: {quantity}
                  </small>
               </div>


               {
                  <div className="rv_div" style={{ alignSelf: "center" }}>
                     <button className="bt9_status" onClick={() => router.push(`/rating-review?oid=${_id}&pid=${productId}&sku=${sku}`)}
                     >
                        Add Review
                     </button>
                  </div>
               }

            </div>

         </div>

         <hr />

         <div className="p-3 row" style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexDirection: "row", flexWrap: "wrap"
         }}>
            <div className="col-lg-6">
               <div className="billing-details-content">
                  <div className="bil-title">Shipping Details</div>
                  <address className="shipping_address">
                     <b className="name">{customer?.shipping_address?.name}</b> <br />
                     <p className="details">
                        {customer?.shipping_address?.area}, {customer?.shipping_address?.city}, {customer?.shipping_address?.division} <br />
                        {customer?.shipping_address?.phone_number}
                     </p>
                  </address>
               </div>
            </div>

            <div className="col-lg-6">
               <div className="billing-details-content">
                  <div className="bil-title">Billing Details</div>
                  <table>

                     <tbody>
                        <tr>
                           <td><i className="material-icons"></i>Subtotal ({quantity})</td>
                           <td className="right-t currency_sign">{amount || 0}</td>
                        </tr>
                        <tr>
                           <td><i className="material-icons"></i> Shipping fee</td>
                           <td className="right-t currency_sign">{shipping_charge || 0}</td>
                        </tr>
                        <tr className="br-top">
                           <td>Amount Payable</td>
                           <td className="right-t currency_sign">{amount}</td>
                        </tr>
                        <tr>
                           <td>
                              Payment Status: {paymentStatus} <br />
                              <i className="textMute">Paid by {paymentMode}</i>
                           </td>

                        </tr>
                     </tbody>

                  </table>
               </div>
            </div>
         </div>
      </ModalWrapper>
   )

}

export default React.memo(ManageOrderModal);