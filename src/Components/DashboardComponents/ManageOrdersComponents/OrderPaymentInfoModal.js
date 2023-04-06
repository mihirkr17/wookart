import ModalWrapper from '@/Components/Global/ModalWrapper';
import React from 'react';


const OrderPaymentInfoModal = ({ data, closeModal, orderRefetch }) => {

   function getAttrs(obj = {}) {

      let str = [];

      for (let [key, value] of Object.entries(obj)) {

         if (typeof value === 'object' || typeof value === "undefined" || !value) {
            key = "";
            value = "";
         };

         str.push(
            (value !== "" && key !== "") && <li key={key}>
               <code>{key.replace(/[_+]/gi, " ").toUpperCase() + " : " + value}</code> <br />
            </li>
         );
      }

      return str.slice(0);
   }


   const refundHandler = async (chargeID, order) => {
      try {

         if (!order) {
            return;
         }

         const { baseAmount, orderID, customerEmail, trackingID } = order;

         const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/payment/refund`, {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               chargeID,
               reason: "requested_by_customer",
               amount: parseInt(baseAmount),
               orderID,
               customerEmail,
               trackingID
            })
         });

         const result = await response.json();

         if (response.ok) {
            orderRefetch();
            closeModal();
         }

      } catch (error) {

      }
   }

   return (
      <ModalWrapper closeModal={closeModal}>
         <div className="row">
            <div className="col-lg-7">
               <i>Payment Information</i> <br />

               <ul>
                  {getAttrs(data?.metadata)}
               </ul>
               {
                  data?.charges?.data && data?.charges?.data.map((item, i) => {

                     return (
                        <div key={i}>
                           {
                              (item?.refunded !== true && data?.order?.orderStatus === "canceled") &&
                              <button className='bt9_withdraw' onClick={() => refundHandler(item?.id, data?.order)}>Refund Now</button>
                           }

                           {
                              item?.refunded === true && <span>Refunded</span>
                           }
                           <address className='py-2'>
                              <i>Billing Details ___</i> <br />
                              <ul>
                                 {
                                    getAttrs(item?.billing_details)
                                 }
                                 {
                                    getAttrs(item?.billing_details?.address)
                                 }
                              </ul>
                           </address>

                           <div className='py-2'>
                              <i>Payment Method Details ___</i> <br />
                              <ul>
                                 {
                                    getAttrs(item?.payment_method_details?.card)
                                 }
                              </ul>
                           </div>

                           <div className='py-2'>
                              <i>Charge Details ___</i> <br />
                              <ul>
                                 {
                                    getAttrs(item)
                                 }
                              </ul>
                           </div>

                        </div>
                     )
                  })
               }
            </div>

            <div className="col-lg-5">
               <i>Order Information</i> <br />
               <ul>
                  {
                     getAttrs(data?.order)
                  }
               </ul>
            </div>
         </div>

      </ModalWrapper>
   );
};

export default OrderPaymentInfoModal;