
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
import { useRouter } from 'next/router';


const MyOrder = () => {
   const { userInfo, setMessage } = useAuthContext();
   const { data, refetch, loading } = useFetch(userInfo?.email && `/order/my-order/${userInfo?.email}`);
   const [actLoading, setActLoading] = useState(false);
   const [ratPoint, setRatPoint] = useState("5");
   const [filterOrder, setFilterOrder] = useState("");
   const [orderItems, setOrderItems] = useState([]);
   const [manageOrderModal, setManageOrderModal] = useState(false);
   const router = useRouter();

   useEffect(() => {
      if (filterOrder === "" || filterOrder === "all") {
         setOrderItems(data?.data?.module?.orders && data?.data?.module?.orders)
      } else {
         setOrderItems(data?.data?.module?.orders && data?.data?.module?.orders.filter(p => p?.itemStatus === filterOrder))
      }
   }, [data, filterOrder]);

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


   function printAttributes(obj = {}) {
      const newObj = Object.entries(obj);
      let str = "";

      for (let [key, value] of newObj) {
         str += `${key}: ${value.split(",")[0]}, `;
      }

      return str.slice(0, str.lastIndexOf(',')) + str.slice(str.lastIndexOf(',') + 1);
   }


   function orderDetailHandler(orderId, itemId) {
      router.push(`/order-details?order_id=${orderId}&item_id=${itemId}`);
   }

   return (
      <div className="container">
         {
            manageOrderModal && <ManageOrderModal
               setMessage={setMessage}
               userInfo={userInfo}
               refetch={refetch}
               closeModal={() => setManageOrderModal(false)}
               data={manageOrderModal}
               router={router}
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
                           const { amount, status, title, orderId, sellPrice, attributes, image, productId, sku, quantity, _id } = orderItem;

                           const lastStatus = Array.isArray(status) && status[status.length - 1];
                           return (
                              <div className="my_order_items" key={_id}>
                                 <div className="ssg" onClick={() => orderDetailHandler(orderId, _id)}>

                                    <div>
                                       <img src={image?.src ?? ""}
                                          alt="product-image" srcSet="" width="40" height="40"
                                          style={{ objectFit: "contain" }}
                                       />
                                    </div>

                                    <div className='d-flex flex-column'>
                                       <small>
                                          <span style={{ color: "#d33900" }}><strong>{title}</strong></span>
                                       </small>
                                     
                                    </div>

                                      <small className='text-muted'>
                                       Qty:
                                          {
                                             quantity
                                          }
                                       </small>

                                    <strong className='currency_sign'>{amount}</strong>

                                    <div>
                                       <small>
                                          Status: <i style={lastStatus?.name === "canceled" ? { color: "red" } : { color: "green" }}>
                                             {lastStatus?.name}
                                          </i>
                                       </small> <br />
                                       <i className='textMute'>
                                          Placed on {new Date(lastStatus?.time).toLocaleDateString() + ", " + new Date(lastStatus?.time).toLocaleTimeString()}
                                       </i>

                                       {/* <button className='manage_order_button' onClick={() => setManageOrderModal(orderItem)}>
                                          Manage Order
                                       </button> <br />
                                       {
                                          <button className="bt9_trans text_primary mt-2" onClick={() => router.push(`/rating-review?oid=${_id}&pid=${productId}&sku=${sku}`)}
                                          >
                                             Rate & Review Product
                                          </button>
                                       } */}
                                    </div>
                                 </div>


                                 {/* <table style={{ marginTop: "5px", overflowX: "auto" }}>
                                    <tbody>
                                       <tr>
                                          <td><img src={imageUrl ?? ""}
                                             alt="product-image" srcSet="" width="35" height="35"
                                             style={{ objectFit: "contain" }}
                                          />
                                          </td>
                                          <td><b>{title}</b></td>
                                          <td>
                                             <b className='currency_sign'>{sellingPrice}</b>
                                          </td>
                                          <td><b>{quantity}</b></td>
                                       </tr>
                                    </tbody>
                                 </table> */}
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