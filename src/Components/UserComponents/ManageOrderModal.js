// src/Components/UserComponents/ManageOrderModal.js

import { useEffect, useMemo, useRef, useState } from "react";
import ModalWrapper from "../Global/ModalWrapper";
import FilterOption from "../Shared/FilterOption";
import { apiHandler } from "@/Functions/common";
import useMenu from "@/Hooks/useMenu";
import React from "react";
import Spinner from "../Shared/Spinner/Spinner";

function ManageOrderModal({ closeModal, data, setMessage, refetch, userInfo }) {
   const [openCancelForm, setOpenCancelForm] = useState(false);
   const [reason, setReason] = useState("");
   const { menuRef, openMenu, setOpenMenu } = useMenu();
   const [openReviewForm, setOpenReviewForm] = useState(false);
   const [ratingPoints, setRatingPoints] = useState("5");
   const [reviewLoading, setReviewLoading] = useState(false);
   const [cancelLoading, setCancelLoading] = useState(false);

   const { final_amount, order_status, is_canceled,
      payment, customer,
      items, orderID, order_placed_at, supplier,
      product,
      quantity,
      order_id,
      shipping_charge
   } = data;


   const openReviewFormHandler = (itemID) => {
      if (itemID === openReviewForm) {
         setOpenReviewForm(false);
      } else {
         setOpenReviewForm(itemID);
      }
   }

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
               cancelLoading ? <p style={{color: "red"}}>Canceling...</p> :
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



   async function handleProductReview(e) {
      try {
         e.preventDefault();
         const productReview = e.target.productReview.value;
         const itemID = e.target.itemID.value;
         const productID = e.target.productID.value;
         const ratingWeight = e.target.ratingWeight.value;



         let lengthOfImg = e.target.images.files.length;

         if (lengthOfImg >= 6) {
            return setMessage("Maximum 5 image can upload !", "danger");
         }

         setReviewLoading(true);
         const promises = [];
         for (let i = 0; i < lengthOfImg; i++) {
            const formData = new FormData();
            formData.append('file', e.target.images.files[i]);
            formData.append('upload_preset', 'review_images');

            promises.push(
               fetch('https://api.cloudinary.com/v1_1/duixvo0uu/image/upload', {
                  method: 'POST',
                  body: formData,
               }).then(response => response.json())
                  .catch(error => console.error('Error:', error))
            );
         }

         const responses = await Promise.all(promises);

         let imgUrls = responses?.map(img => img?.secure_url);

         const { success, message } = await apiHandler(`/review/add-product-rating`, "POST", {
            name: userInfo?.fullName, productReview, orderID, productID, itemID, ratingWeight, reviewImage: imgUrls ?? []
         });

         setReviewLoading(false);

         if (success) {
            setOpenReviewForm(false);
            setMessage(message, "success");
            return refetch();
         }

         return setMessage(message, "danger");

      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }

   return (
      <ModalWrapper closeModal={closeModal} >
         <div className="p-1 pt-3" style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row"
         }}>
            <span>Order: {order_id}
               <br />
               <small className="textMute">Placed on {order_placed_at?.date + ", " + order_placed_at?.time}</small>
            </span>
            <span>Total: <b className="currency_sign">{final_amount}</b></span>
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
                  order_status === "canceled" && is_canceled ?
                     <button className='btn btn-sm text-uppercase text-muted' onClick={() => removeOrderHandler(order_id, customer?.email)}>
                        Remove
                     </button> :
                     cancelTemplate(order_id, customer?.email, {
                        productID: product?.product_id,
                        listingID: product?.listing_id,
                        variationID: product?.variation_id,
                        quantity,
                        title: product?.title,
                        finalAmount: final_amount,
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
                  <img src={product?.assets?.images[0] ?? ""} width={55} height={55} alt="" />
               </div>
               <div>
                  <b>{product?.title}</b> <br />
                  <small>
                     Selling Price: {product?.selling_price} <br />
                     Quantity: {quantity}
                  </small>
               </div>


               {
                  (order_status === "completed") && <div className="rv_div" style={{ alignSelf: "center" }}>
                     <button className="status_btn" onClick={() => setOpenReviewForm(openReviewForm === order_id ? false : order_id)}>
                        Add Review
                     </button>

                     {
                        openReviewForm === order_id && <form
                           className="review_form"
                           encType="multipart/form-data"
                           style={{ backgroundColor: "white", padding: "10px" }}
                           onSubmit={handleProductReview}>

                           <div className="input_group">
                              <label htmlFor="images">Review images</label> <br />
                              <input type="file" accept="image/*" name="images" id="images" multiple />
                           </div>

                           <div className="input_group">
                              <label htmlFor="ratingWeight">Select Stars ({ratingPoints})</label> <br />
                              <input type="range" name="ratingWeight" id="ratingWeight" min="1"
                                 max="5" step="1"
                                 onChange={(e) => setRatingPoints(e.target.value || "5")} />
                           </div>

                           <div className="input_group">
                              <label htmlFor="productReview">Write product review</label> <br />
                              <textarea name="productReview" id="productReview" cols="30" rows="5"></textarea>
                           </div>

                           <div className="input_group">
                              <input type="hidden" id="productID" name="productID" value={productID} />
                              <input type="hidden" id="itemID" name="itemID" value={itemID} />

                              {
                                 reviewLoading ? <p>Loading...</p> : <button className="bt9_edit">Submit</button>
                              }

                           </div>
                        </form>
                     }
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
                           <td className="right-t currency_sign">{product?.base_amount || 0}</td>
                        </tr>
                        <tr>
                           <td><i className="material-icons"></i> Shipping fee</td>
                           <td className="right-t currency_sign">{shipping_charge}</td>
                        </tr>
                        <tr className="br-top">
                           <td>Amount Payable</td>
                           <td className="right-t currency_sign">{final_amount}</td>
                        </tr>
                        <tr>
                           <td>
                              Payment Status: {payment?.status} <br />
                              <i className="textMute">Paid by {payment?.mode}</i>
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