import ConfirmDialog from '@/Components/Global/ConfirmDialog';
import { apiHandler } from '@/Functions/common';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useState } from 'react';


const OrderTable = ({ orderList, setOpenModal, setLabelModal, orders, orderRefetch, setMessage, userInfo, setOpenOrderPaymentInfo }) => {
   const [openBox, setOpenBox] = useState(false);
   const [openActionMenu, setOpenActionMenu] = useState(null);
   const [openCancelReasonForm, setOpenCancelReasonForm] = useState(false);

   const getPaymentInfo = async (piID, order) => {
      try {
         const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/payment/retrieve-payment-intent/${piID}`, {
            method: "GET",
            withCredentials: true,
            credentials: "include"
         });

         const result = await response.json();
         result["order"] = order;

         if (response.ok) {
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

      const { customerEmail, productID, variationID, _id, listingID, trackingID, quantity } = order;

      const { success, message } = await apiHandler(`/dashboard/store/${userInfo?.seller?.storeInfos?.storeName}/order/order-status-management`,
         "POST", {
         type: "canceled",
         customerEmail, productID, variationID, _id, listingID, trackingID, quantity, cancelReason
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
         const { customerEmail, _id, trackingID } = order;

         if (_id && trackingID && customerEmail) {
            const { success, message } = await apiHandler(`/dashboard/store/${userInfo?.seller?.storeInfos?.storeName}/order/order-status-management`,
               "POST", { type: "dispatch", _id, trackingID, customerEmail });
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


   function gdg(items) {
      return (
         <table className="table" style={{ border: "1px solid black" }}>
            <thead>
               <tr>
                  <th>Item ID</th>
                  <th>Amount</th>
               </tr>
            </thead>
            <tbody>
               {
                  items.map((item, i) => {
                     return (
                        <tr key={i}>
                           <td>{item?.itemID}</td>
                           <td>{item?.baseAmount}</td>
                        </tr>
                     )
                  })
               }
            </tbody>
         </table>
      )

   }


   return (
      <div className='table-responsive-sm'>

         {orders && orders.map((odr) => {

            // const { orderID, orderPaymentID, customerEmail, paymentMode, orderStatus, baseAmount, paymentStatus } = odr;
            const { _id, orderPaymentID, customerEmail, paymentMode, orderStatus, baseAmount, totalAmount, paymentStatus, items } = odr;
            return (
               <div className="card_default card_description" key={_id}>
                  <div className="order_text">
                     <small>
                        Customer Email: {customerEmail} <br />
                        Order Payment ID : {orderPaymentID} <br />
                        Payment Mode: {paymentMode} <br />
                        Payment Status: {paymentStatus} <br />
                        Total Amount : {totalAmount}
                     </small>
                  </div>

                  {
                     gdg(items)
                  }
               </div>
            )
         })
         }


         {/* <table className="table">
            <thead>
               <tr>
                  <th>Order</th>
                  <th>Customer Email</th>
                  <th>Payment Mode</th>
                  <th>Payment Status</th>
                  <th>Total Amount</th>
                  <th>Order Status</th>
                  <th>Action</th>
               </tr>
            </thead>
            <tbody>
               {
                  orders && orders.map((odr) => {

                     // const { orderID, orderPaymentID, customerEmail, paymentMode, orderStatus, baseAmount, paymentStatus } = odr;
                     const { _id, orderPaymentID, customerEmail, paymentMode, orderStatus, baseAmount, paymentStatus, items } = odr;
                     return (

                        <tr key={_id}>
                           <td>
                              <pre>
                                 <span>Order ID   : {_id}</span> <br />
                                 <span>Payment ID : {orderPaymentID}</span>
                              </pre>
                           </td>
                           <td>{customerEmail}</td>
                           <td>{paymentMode}</td>
                           <td>{paymentStatus === "paid" && <span className='badge_success'>{paymentStatus}</span>}</td>
                           <td>$&nbsp;{baseAmount}</td>
                           <td>{orderStatus}</td>

                           <td style={{ position: "relative" }}>
                              <button style={{
                                 border: "none",
                                 padding: "0.4rem",
                                 background: "transparent",
                                 fontSize: "1rem"
                              }} onClick={() => setOpenActionMenu(_id !== openActionMenu ? _id : false)}>
                                 <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
                              </button>

                              {
                                 (openActionMenu === _id) &&
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
                                       <li>
                                          <button className="status_btn_alt" onClick={() => setOpenModal(true && odr)}>Details</button>
                                       </li>
                                       {
                                          orderStatus === "dispatch" && <>
                                             <li>
                                                <button className='status_btn_alt' onClick={() => setOpenBox(odr)}>Placed Now</button>
                                             </li>
                                          </>
                                       }
                                       {
                                          orderStatus === "placed" && <>
                                             <li>
                                                <button className='status_btn_alt' onClick={() => setOpenBox(odr)}>Shipped Now</button>
                                             </li>
                                          </>
                                       }
                                       {
                                          orderStatus === "pending" && <>
                                             <li>
                                                <button className='status_btn_alt' onClick={() => setOpenBox(odr)}>Dispatch Now</button>
                                             </li>
                                             <li>
                                                <button className='status_btn_alt' onClick={() => setLabelModal(true && odr)}>Download Label</button>
                                             </li>
                                             <li>
                                                <button className='status_btn_alt' onClick={() => setOpenCancelReasonForm((_id !== openCancelReasonForm) ? _id : false)}>
                                                   Cancel Now
                                                </button>
                                                {
                                                   (openCancelReasonForm === _id) &&
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
                           </td>
                        </tr>

                     )
                  })
               }
            </tbody>

         </table> */}

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