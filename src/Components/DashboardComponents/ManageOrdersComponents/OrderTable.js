import ConfirmDialog from '@/Components/Global/ConfirmDialog';
import { apiHandler } from '@/Functions/common';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useState } from 'react';


const OrderTable = ({ setOpenModal, setLabelModal, orders, orderRefetch, setMessage, userInfo, setOpenOrderPaymentInfo }) => {
   const [openBox, setOpenBox] = useState(false);
   const [openActionMenu, setOpenActionMenu] = useState(null);
   const [openCancelReasonForm, setOpenCancelReasonForm] = useState(false);

   const getPaymentInfo = async (piID, order) => {
      try {

         const result = await apiHandler(`/payment/retrieve-payment-intent/${piID}`, "GET"); // response.json();
         result["order"] = order;

         if (result) {
            setOpenOrderPaymentInfo(result);
         }
      } catch (error) {

      }
   }

   const orderCancelHandler = async (e, order) => {
      e.preventDefault();

      if (!order) {
         return;
      }

      let cancelReason = e.target.cancelReason.value || "";

      if (cancelReason === "" || !cancelReason) {
         return;
      }

      const { customerEmail, orderID, seller, trackingID, items } = order;

      const { success, message } = await apiHandler(`/dashboard/store/${userInfo?.store?.name}/order/order-status-management`,
         "POST", {
         type: "canceled",
         customerEmail,
         orderID,
         trackingID,
         cancelReason,
         sellerEmail: seller?.email,
         items
      });

      if (success) {
         setMessage(message, "success")
         orderRefetch();
      } else {
         return setMessage(message, "danger");
      }
   }

   const orderDispatchHandler = async (order) => {
      try {
         const { customerEmail, orderID, seller, trackingID, items } = order;

         if (orderID && customerEmail) {
            const { success, message } = await apiHandler(`/dashboard/store/${userInfo?.store?.name}/order/order-status-management`,
               "POST", { type: "dispatch", orderID, trackingID, customerEmail, sellerEmail: seller?.email, items });
            if (success) {
               setMessage(message, "success")
               orderRefetch();
            } else {
               setMessage(message, "danger");
            }
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }


   return (
      <div>

         {orders && orders.map((odr) => {

            const { orderID, trackingID, customerEmail, paymentMode, shippingAddress, orderStatus, totalAmount, paymentStatus, orderAT, items } = odr;
            return (
               <div className="my_order_items" key={orderID}>
                  <div className="ssg">
                     <div>
                        <small style={{
                           display: "flex",
                           flexDirection: "column",
                           width: "100%",
                           flexWrap: "wrap",
                           justifyContent: "space-between",
                           fontSize: "0.8rem"
                        }}>

                           <span style={{ color: "#d33900" }}><strong>{orderID}</strong></span>
                           <i className='textMute'>Placed on {orderAT?.date + ", " + orderAT?.time}</i>
                           <small>
                              Status: <i style={orderStatus === "canceled" ? { color: "red" } : { color: "green" }}>
                                 {orderStatus}
                              </i>
                           </small>

                        </small>
                     </div>

                     <div style={{ position: "relative" }}>
                        <small>Total: <strong className='currency_sign'>{totalAmount}</strong></small> <br />

                        <button className='manage_order_button' onClick={() => setOpenActionMenu(orderID !== openActionMenu ? orderID : false)}>
                           Option
                        </button>

                        {
                           (openActionMenu === orderID) &&
                           <div className='action_menu'>
                              <ul>
                                 <li>
                                    <button className='status_btn_alt' onClick={() => getPaymentInfo(odr && odr?.paymentIntentID, odr)}>Get Payment Info</button>
                                 </li>

                                 {
                                    (orderStatus === "canceled") &&
                                    <li>
                                       <button className='status_btn_alt' onClick={() => getPaymentInfo(odr && odr?.paymentIntentID, odr)}>Refund Now</button>
                                    </li>
                                 }

                                 {
                                    orderStatus === "dispatch" && <>
                                       <li>
                                          <button className='status_btn_alt' onClick={() => setOpenBox(odr)}>Shipped Now</button>
                                       </li>
                                       <li>
                                          <button className='status_btn_alt' onClick={() => setLabelModal(true && odr)}>Download Label</button>
                                       </li>
                                    </>
                                 }
                                 {
                                    orderStatus === "placed" && <>

                                       <li>
                                          <button className='status_btn_alt' onClick={() => orderDispatchHandler(odr)}>Dispatch Now</button>
                                       </li>
                                       <li>
                                          <button className='status_btn_alt' onClick={() => setOpenCancelReasonForm((orderID !== openCancelReasonForm) ? orderID : false)}>
                                             Cancel Now
                                          </button>
                                          {
                                             (openCancelReasonForm === orderID) &&
                                             <div>
                                                <form className="p-1" onSubmit={(e) => orderCancelHandler(e, odr)}>
                                                   <label htmlFor="cancelReason">Choose a Reason</label>
                                                   <select className='form-select form-select-sm mb-2' name="cancelReason" id="cancelReason">
                                                      <option value="customer_want_to_cancel">Customer want to cancel</option>
                                                   </select>
                                                   <button className='bt9_edit'>Submit</button>
                                                </form>
                                             </div>
                                          }
                                       </li>
                                    </>
                                 }

                                 {
                                    orderStatus === "shipped" && <>
                                       <li>
                                          <button className='status_btn_alt' onClick={() => setOpenBox(odr)}>Completed Now</button>
                                       </li>
                                    </>
                                 }

                              </ul>
                           </div>
                        }
                     </div>
                  </div>


                  <table style={{ marginTop: "5px", overflowX: "auto" }}>

                     <thead>
                        <tr>
                           <th>Image</th>

                           <th>Title</th>
                           <th>Amount (+ charges)</th>
                           <th>Qty</th>
                           <th>Action</th>
                        </tr>
                     </thead>

                     <tbody>
                        {
                           Array.isArray(items) && items.map((nItem, i) => {
                              const { title, baseAmount, quantity, sellingPrice, shippingCharge, image, productID, sku, variationID } = nItem;
                              nItem["orderID"] = orderID;
                              nItem["orderStatus"] = orderStatus;
                              nItem["shippingAddress"] = shippingAddress;
                              nItem["paymentMode"] = paymentMode;
                              nItem["orderAT"] = orderAT;
                              nItem["trackingID"] = trackingID;
                              nItem["customerEmail"] = customerEmail;
                              nItem["paymentStatus"] = paymentStatus;
                              return (
                                 <tr key={i}>
                                    <td><img src={image} alt="product-image" srcSet="" width={30} height={30} /></td>

                                    <td>{title}
                                       <br />
                                       <small className='textMute'>SKU: {sku}</small>
                                    </td>
                                    <td className='currency_sign'>{sellingPrice + shippingCharge}</td>
                                    <td>{quantity}</td>
                                    <td>
                                       <button className="status_btn_alt" onClick={() => setOpenModal(true && nItem)}>Details</button>
                                    </td>
                                 </tr>

                              )
                           })
                        }
                     </tbody>
                  </table>
               </div>
            )
         })
         }

         <ConfirmDialog payload={{
            reference: openBox, openBox, setOpenBox,
            handler: orderDispatchHandler,
            text: `First make sure you downloaded the shipping label.
               So, if downloaded then dispatch this order.`,
            types: "Confirm"
         }} />
      </div>
   );
};

export default OrderTable;