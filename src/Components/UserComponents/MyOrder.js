
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
         setOrderItems(data?.data?.module?.orders && data?.data?.module?.orders.filter(p => p?.orderStatus === filterOrder))
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

   console.log(orderItems);

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
                           const { final_amount, order_status, payment, customer, shipping_charge, product, quantity, order_id, order_placed_at } = orderItem;

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

                                          <span style={{ color: "#d33900" }}><strong>{order_id}</strong></span>
                                          <i className='textMute'>Placed on {order_placed_at?.date + ", " + order_placed_at?.time}</i>
                                          <small>
                                             Status: <i style={order_status === "canceled" ? { color: "red" } : { color: "green" }}>
                                                {order_status}
                                             </i>
                                          </small>

                                       </small>
                                    </div>

                                    <div>
                                       <small>Total: <strong className='currency_sign'>{final_amount}</strong></small> <br />
                                       <button className='manage_order_button' onClick={() => setManageOrderModal(orderItem)}>
                                          Manage Order
                                       </button> <br />
                                       {
                                           <button className="bt9_trans text_primary mt-2" onClick={() => router.push(`/rating-review?oid=${order_id}&pid=${product?.product_id}&vid=${product?.variation_id}`)}
                                          >
                                             Rate & Review Product
                                          </button>
                                       }
                                    </div>
                                 </div>


                                 <table style={{ marginTop: "5px", overflowX: "auto" }}>
                                    <tbody>
                                       <tr>
                                          <td><img src={product?.assets?.images[0] ?? ""}
                                             alt="product-image" srcSet="" width="35" height="35"
                                             style={{ objectFit: "contain" }}
                                          />
                                          </td>
                                          <td><b>{product?.title}</b></td>
                                          <td>
                                             <b className='currency_sign'>{product?.selling_price}</b>
                                          </td>
                                          <td><b>{quantity}</b></td>
                                       </tr>
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