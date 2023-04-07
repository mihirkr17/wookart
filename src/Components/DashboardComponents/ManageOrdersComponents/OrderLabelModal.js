import React, { useEffect, useRef } from 'react';
import Pdf from "react-to-pdf";
import QRCode from "qrcode";
import ModalWrapper from '@/Components/Global/ModalWrapper';


const OrderLabelModal = ({ data, closeModal, userInfo }) => {
   const ref = useRef();
   const canvasRef = useRef();
   const { orderID, trackingID, paymentMode, orderAT, quantity, shippingAddress, packaged, shippingCharge, baseAmount } = data && data;

   useEffect(() => {
      let str = "OrderID: " + orderID + ", Total Amount: " + baseAmount + " USD" + ", Quantity: " + quantity;

      QRCode.toCanvas(
         canvasRef.current,
         str || " ",
         (error) => error && console.error(error)
      );
   }, [orderID, baseAmount, quantity]);

   return (
      <ModalWrapper closeModal={closeModal}>
         <div>
            <Pdf targetRef={ref} filename={`WooKart-OID-${orderID}.pdf`}>
               {({ toPdf }) => <button className='status_btn' onClick={toPdf}>Generate Pdf</button>}
            </Pdf>
         </div>
         <div className="wrapper mx-auto card_default card_description" style={{ width: "384px", height: "624px", margin: "1rem 0", padding: "1rem" }} ref={ref}>
            
            <p style={{textAlign: "center", padding: "0.3rem 0"}}>
               WooKart Sales Order
            </p>
            
            <div className="d-flex align-items-center justify-content-around flex-wrap">
               <small><strong>Order ID : {orderID}</strong></small>
               <small><strong>Tracking ID : {trackingID}</strong></small>
            </div>

            <small className="py-1 text-center">
               Order Creation Date : {orderAT?.date} at {orderAT?.time}
            </small>

            <hr />

            <div className="barcode p-1" style={{ width: "100%", display: "flex" }}>
               <canvas style={{ width: "100px" }} ref={canvasRef}></canvas>

               <pre style={{ fontSize: "0.7rem", margin: "auto" }}>
                  Total Amount    : <b>{baseAmount} USD</b> <br />
                  Quantity        : {quantity} <br />
                  Shipping Charge : {shippingCharge} USD <br />
                  Weight          : {packaged?.weight} Kg <br />
                  Payment Mode    : {paymentMode}
               </pre>
            </div>

            <hr />

            <div className="p-1">
               <div className='shipping_details d-flex align-items-start justify-content-between flex-column' style={{
                  border: "1px solid black",
                  width: "100%"
               }}>

                  <div className='p-2' style={{
                     width: "100%"
                  }}>
                     <h6 style={{ fontSize: "0.9rem" }}>Recipient : {shippingAddress?.name}</h6>
                     <p style={{ fontSize: "0.8rem" }}>
                        <small>
                           {shippingAddress?.area},&nbsp;{shippingAddress?.city},&nbsp;
                           {shippingAddress?.division},&nbsp;{shippingAddress?.postal_code} <br />
                           Landmark : {shippingAddress?.landmark} <br />
                           Phone Number : {shippingAddress?.phone_number} <br />
                        </small>
                     </p>
                  </div>

                  <div className='p-2' style={{
                     borderTop: "1px solid black",
                     width: "100%"
                  }}>
                     <h6 style={{ fontSize: "0.9rem" }}>Shipper Name : {userInfo?.seller?.storeInfos?.storeName}</h6>
                     <p style={{ fontSize: "0.8rem" }}>
                        <small>
                           {userInfo?.seller?.address?.area},&nbsp;{userInfo?.seller?.address?.city}, <br />
                           {userInfo?.seller?.address?.country},&nbsp;{userInfo?.seller?.address?.postal_code} <br />
                           Phone : {userInfo?.phone}
                        </small>
                     </p>
                  </div>
               </div>
            </div>
         </div>
      </ModalWrapper>
   );
};

export default OrderLabelModal;