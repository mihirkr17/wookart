// src/Components/UserComponents/ManageOrderModal.js

import { useState } from "react";
import ModalWrapper from "../Global/ModalWrapper";
import FilterOption from "../Shared/FilterOption";
import { apiHandler } from "@/Functions/common";

export default function ManageOrderModal({ closeModal, data, setMessage, refetch }) {
   const [openCancelForm, setOpenCancelForm] = useState(false);
   const [reason, setReason] = useState("");
   const { totalAmount, orderStatus, isCanceled, paymentStatus, customerEmail, paymentMode, items, orderID, orderAT, sellerStore, shippingAddress } = data;

   const subTotal = items?.reduce((p, c) => p + c?.quantity, 0);
   const baseAmounts = items?.reduce((p, c) => p + (c?.sellingPrice * c?.quantity), 0);
   const shippingFees = items?.reduce((p, c) => p + c?.shippingCharge, 0);


   const handleCancelOrder = async (e, order) => {
      e.preventDefault();

      const { orderID, customerEmail, items } = order;

      if (reason === "Choose Reason" || reason === "") {
         setMessage(<strong className='text-success'>Please Select Cancel Reason...</strong>);
         return;
      } else {
         const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/order/cancel-my-order/${customerEmail}`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: customerEmail
            },
            body: JSON.stringify({ cancelReason: reason, orderID, orderItems: items })
         });

         const resData = await response.json();

         if (response.ok) {
            setMessage(resData?.message, 'success');
            closeModal();
            refetch();
         }
      }
   }

   const removeOrderHandler = async (orderID, customerEmail) => {
      if (window.confirm("Want to cancel this order ?")) {
         const { success, message } = await apiHandler(`/order/remove-order/${customerEmail}/${orderID}`, "DELETE");

         if (success) {
            setMessage(message, 'success');
            closeModal();
            refetch();
            return;
         }

         return setMessage(message, "danger");
      }
   }



   function cancelTemplate(orderID, customerEmail, items) {
      return (
         <>
            <button className="btn btn-sm text-danger"
               onClick={() => setOpenCancelForm(orderID)}
               style={openCancelForm !== orderID ? { display: "inline-block" } : { display: "none" }}>
               Cancel This Order
            </button>

            <div className="py-4" style={openCancelForm === orderID ? { display: "block" } : { display: "none" }}>
               <form onSubmit={(e) => handleCancelOrder(e, { orderID, customerEmail, items })} >
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
               <button className='btn btn-sm' onClick={() => setOpenCancelForm(e => e = false)} style={openCancelForm === orderID ? { display: "block" } : { display: "none" }}>Back</button>
            </div>
         </>
      )
   }

   return (
      <ModalWrapper closeModal={closeModal} >
         <div className="p-1 pt-3" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row"
         }}>
            <span>Order: {orderID}
               <br />
               <small className="textMute">Placed on {orderAT?.date + ", " + orderAT?.time}</small>
            </span>
            <span>Total: $<b>{totalAmount}</b></span>
         </div>

         <hr />

         <div className="p-1 row">
            <div className="col-lg-6">
               <small>Sold by <b style={{ color: "blue" }}>{sellerStore}</b></small>
            </div>

            <div className="col-lg-6" style={{ textAlign: "end" }}>
               {
                  orderStatus === "canceled" && isCanceled ?
                     <button className='btn btn-sm text-uppercase text-muted' onClick={() => removeOrderHandler(orderID, customerEmail)}>
                        Remove
                     </button> :
                     cancelTemplate(orderID, customerEmail, items)
               }
            </div>
         </div>

         <hr />

         <div className="p-3">
            {
               Array.isArray(items) && items?.map((item, index) => {
                  const { image, title, itemID, quantity, sellingPrice } = item;
                  return (
                     <div key={itemID} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-start",
                        flexDirection: "row",
                        fontSize: "0.8rem",
                        flexWrap: "wrap"
                     }}>
                        <div style={{ marginRight: "14px" }}>
                           <img src={image} width={55} height={55} alt="" />
                        </div>
                        <div>
                           <b>{title}</b> <br />
                           <small>
                              Selling Price: ${sellingPrice} <br />
                              Quantity: {quantity}
                           </small>
                        </div>
                     </div>
                  )
               })
            }
         </div>

         <hr />

         <div className="p-3 row" style={{
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexDirection: "row", flexWrap: "wrap"
         }}>
            <div className="col-lg-6">
               <div className="billing-details-content">
                  <div className="bil-title">Shipping Details</div>
                  <address className="shipping_address">
                     <b className="name">{shippingAddress?.name}</b> <br />
                     <p className="details">
                        {shippingAddress?.area}, {shippingAddress?.city}, {shippingAddress?.division} <br />
                        {shippingAddress?.phone_number}
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
                           <td><i className="material-icons"></i>Subtotal ({subTotal || 0})</td>
                           <td className="right-t">${baseAmounts || 0}</td>
                        </tr>
                        <tr>
                           <td><i className="material-icons"></i> Shipping fee</td>
                           <td className="right-t">${shippingFees}</td>
                        </tr>
                        <tr className="br-top">
                           <td>Amount Payable</td>
                           <td className="right-t">${totalAmount}</td>
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