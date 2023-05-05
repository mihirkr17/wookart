
// src/Components/UserComponents/MyOrder.js

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuthContext } from '@/lib/AuthProvider';
import Spinner from '../Shared/Spinner/Spinner';
import { useFetch } from '@/Hooks/useFetch';
import FilterOption from '../Shared/FilterOption';
import BtnSpinner from '../Shared/BtnSpinner/BtnSpinner';
import { apiHandler, calcTime } from '@/Functions/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import ManageOrderModal from './ManageOrderModal';


const MyOrder = () => {
   const { userInfo, setMessage } = useAuthContext();
   const { data, refetch, loading } = useFetch(userInfo?.email && `/order/my-order/${userInfo?.email}`);
   const [actLoading, setActLoading] = useState(false);
   const [ratPoint, setRatPoint] = useState("5");
   const [openReviewForm, setOpenReviewForm] = useState(false);
   const [filterOrder, setFilterOrder] = useState("");
   const [orderItems, setOrderItems] = useState([]);
   const [manageOrderModal, setManageOrderModal] = useState(false);

   useEffect(() => {
      if (filterOrder === "" || filterOrder === "all") {
         setOrderItems(data?.data?.module?.orders && data?.data?.module?.orders)
      } else {
         setOrderItems(data?.data?.module?.orders && data?.data?.module?.orders.filter(p => p?.orderStatus === filterOrder))
      }
   }, [data, filterOrder]);

   const openReviewFormHandler = (orderID) => {
      if (orderID === openReviewForm) {
         setOpenReviewForm(false);
      } else {
         setOpenReviewForm(orderID);
      }
   }

   const ratingHandler = async (e) => {
      try {
         e.preventDefault();
         setActLoading(true);
         let ratingPoint = e.target.rating_point.value;
         let ratingDesc = e.target.rating_description.value;
         let productID = e.target.product_id.value;
         let orderID = e.target.order_id.value;
         let ratingId = Math.floor(Math.random() * 1000000);

         let review = {
            ratingId, orderID: parseInt(orderID), rating_customer: userInfo?.fullName, rating_point: ratingPoint, rating_description: ratingDesc
         }


         const resData = await apiHandler(`/review/add-product-rating/${productID}`, "PUT", { ...review });

         if (response.ok) {
            setMessage(resData?.message, 'success');
            setActLoading(false);
            refetch()
         }
      } catch (error) {

      }
   }


   if (loading) return <Spinner></Spinner>;

   return (
      <div className="container">
         {
            manageOrderModal && <ManageOrderModal
               setMessage={setMessage}
               refetch={refetch}
               closeModal={() => setManageOrderModal(false)}
               data={manageOrderModal}
            />

         }
         <h5 className="py-4 text-start">
            My Orders
         </h5>

         <div className="row">
            <div className="col-lg-12">
               <FilterOption
                  options={["all", "pending", "placed", "shipped", "canceled"]}
                  filterHandler={setFilterOrder}
               />
            </div>
            <div className="col-lg-12 pt-3">
               <h6>{orderItems && orderItems.length > 0 ? "Total : " + orderItems.length + " Orders" : "You Have No Orders In Your History"}</h6>


               <div className="row">
                  <div className="col-12">
                     {
                        Array.isArray(orderItems) && orderItems.map((orderItem, index) => {
                           const { totalAmount, _id, orderStatus, isCanceled, paymentStatus, customerEmail, items, orderID, orderAT, sellerStore } = orderItem;
                           return (
                              <div className="my_order_items" key={index}>
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

                                    <div>
                                       <small>Total: <strong className='currency_sign'>{totalAmount}</strong></small> <br />
                                       <button className='manage_order_button' onClick={() => setManageOrderModal(orderItem)}>
                                          Manage Order
                                       </button>

                                       {
                                          orderStatus === "completed" && <button onClick={() => openReviewFormHandler(orderID)}>Add Review</button>
                                       }
                                    </div>
                                 </div>


                                 <table style={{ marginTop: "5px", overflowX: "auto" }}>

                                    <thead>
                                       <tr>
                                          <th>Image</th>
                                          <th>Title</th>
                                          <th>Amount (+ charge)</th>
                                          <th>Qty</th>
                                       </tr>
                                    </thead>

                                    <tbody>
                                       {
                                          Array.isArray(items) && items.map((nItem, i) => {
                                             const { title, baseAmount, quantity, sellingPrice, shippingCharge, image, productID, slug, variationID } = nItem;
                                             return (
                                                <tr key={i}>
                                                   <td><img src={image} alt="product-image" srcSet="" width={30} height={30} /></td>
                                                   <td>{title}</td>
                                                   <td className='currency_sign'>{sellingPrice + shippingCharge}</td>
                                                   <td>{quantity} Pcs</td>
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

                  </div>
               </div>
            </div>
         </div >

      </div >
   );
};


export default MyOrder;