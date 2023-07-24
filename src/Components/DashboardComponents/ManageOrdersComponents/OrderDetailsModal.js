import ModalWrapper from '@/Components/Global/ModalWrapper';
import React from 'react';

const OrderDetailsModal = ({ data, closeModal }) => {
   const { order_id, product, customer, trackingID, payment, shipping_charge, order_status, quantity, order_placed_at, packaged } = data && data;


   function getAttrs(obj = {}, optStr = "") {

      let str = [];

      for (let [key, value] of Object.entries(obj)) {

         if (typeof value === 'object' || typeof value === "undefined" || !value) {
            key = "";
            value = "";
         };

         str.push(
            <li key={key}><small>{key.replace(/[_+]/gi, " ").toUpperCase()} : {value + optStr} </small></li>
         )
      }

      return str.slice(0, 6);
   }

   return (
      <ModalWrapper closeModal={closeModal}>
         <div className="table-responsive">
            <table className='table '>
               <thead>
                  <tr>
                     <th>Order Details</th>
                  </tr>
               </thead>
               <tbody>
                  <tr>
                     <th>Product</th>
                     <td>
                        <img src={product?.image ?? ""} alt="" style={{ width: "55px", height: "55px" }} />&nbsp;&nbsp;
                        <span>{product?.title}</span>
                     </td>
                  </tr>
                  <tr>
                     <th>order_id</th>
                     <td>{order_id}</td>
                  </tr>
                  <tr>
                     <th>SKU</th>
                     <td>{product?.sku}</td>
                  </tr>
                  <tr>
                     <th>Variation ID</th>
                     <td>{product?.variation_id}</td>
                  </tr>
                  {
                     trackingID &&
                     <tr>
                        <th>Tracking ID</th>
                        <td>{trackingID}</td>
                     </tr>
                  }
                  <tr>
                     <th>Customer Email</th>
                     <td>{customer?.email}</td>
                  </tr>
                  <tr>
                     <th>Price</th>
                     <td>{product?.selling_price} Tk</td>
                  </tr>
                  <tr>
                     <th>Quantity</th>
                     <td>{quantity}</td>
                  </tr>
                  <tr>
                     <th>Shipping Charge</th>
                     <td>{shipping_charge} Tk</td>
                  </tr>
                  <tr>
                     <th>Base Total</th>
                     <td>{product?.base_amount} Tk</td>
                  </tr>
                  <tr>
                     <th>Payment Mode</th>
                     <td>{payment?.mode}</td>
                  </tr>
                  <tr>
                     <th>Payment Status</th>
                     <td>{payment?.status}</td>
                  </tr>
                  <tr>
                     <th>Order Status</th>
                     <td>{order_status}</td>
                  </tr>
                  <tr>
                     <th>Order Start Time</th>
                     <td>{order_placed_at?.time} / Date: {order_placed_at?.date}</td>
                  </tr>
                  {
                     data?.time_placed ?
                        <tr>
                           <th>Order Placed Time</th>
                           <td>{data?.time_placed}</td>
                        </tr> : ""
                  }
                  {
                     data?.time_shipped ?
                        <tr>
                           <th>Order Shipped Time</th>
                           <td>{data?.time_shipped}</td>
                        </tr> : ""
                  }
                  <tr>
                     <th>Shipping Address</th>
                     <td>
                        <ul>
                           {
                              getAttrs(customer?.shipping_address)
                           }
                        </ul>
                     </td>
                  </tr>

                  <tr>
                     <th>In The Box</th>
                     <td>{packaged?.inTheBox}</td>
                  </tr>
                  <tr>
                     <th>Package Dimension</th>
                     <td>
                        <ul>
                           <li><small>WEIGHT : {packaged?.weight} kg</small></li>
                           {getAttrs(packaged?.dimension, " cm")}
                        </ul>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </ModalWrapper>
   );
};

export default OrderDetailsModal;