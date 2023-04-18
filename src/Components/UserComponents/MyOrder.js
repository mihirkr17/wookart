import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/lib/AuthProvider';
import Spinner from '../Shared/Spinner/Spinner';
import { useFetch } from '@/Hooks/useFetch';
import Link from 'next/link';
import FilterOption from '../Shared/FilterOption';
import BtnSpinner from '../Shared/BtnSpinner/BtnSpinner';
import { calcTime } from '@/Functions/common';


const MyOrder = () => {
   const { userInfo, setMessage } = useAuthContext();
   const { data, refetch, loading } = useFetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/order/my-order/${userInfo?.email}`);
   const [actLoading, setActLoading] = useState(false);
   const [ratPoint, setRatPoint] = useState("5");
   const [reason, setReason] = useState("");
   const [openCancelForm, setOpenCancelForm] = useState(false);
   const [openReviewForm, setOpenReviewForm] = useState(false);
   const [filterOrder, setFilterOrder] = useState("");
   const [orderItems, setOrderItems] = useState([]);


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

   const removeOrderHandler = async (orderID) => {
      if (window.confirm("Want to cancel this order ?")) {
         const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/order/remove-order/${userInfo?.email}/${orderID}`, {
            method: "DELETE",
            withCredentials: true,
            credentials: "include",
         });

         const resData = await response.json();
         if (response.ok) {
            resData && refetch();
            setMessage(resData?.message, 'success');
         }
      }
   }

   const ratingHandler = async (e) => {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/review/add-product-rating/${productID}`, {
         method: "PUT",
         withCredentials: true,
         credentials: "include",
         headers: {
            "Content-Type": "application/json"
         },
         body: JSON.stringify({ ...review })
      });

      const resData = await response.json();

      if (response.ok) {
         setMessage(resData?.message, 'success');
         setActLoading(false);
         refetch()
      }
   }

   const handleCancelOrder = async (e, order) => {
      e.preventDefault();

      const { orderID } = order;

      if (reason === "Choose Reason" || reason === "") {
         setMessage(<strong className='text-success'>Please Select Cancel Reason...</strong>);
         return;
      } else {
         const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/order/cancel-my-order/${userInfo?.email}`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: userInfo?.email
            },
            body: JSON.stringify({ cancelReason: reason, orderID })
         });

         const resData = await response.json();

         if (response.ok) {
            refetch();
            setMessage(resData?.message, 'success');
         }
      }
   }


   if (loading) return <Spinner></Spinner>;

   return (
      <div className="container">
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
                           const { totalAmount, _id, orderPaymentID, paymentMode, paymentStatus, items } = orderItem;
                           return (
                              <div className="p-2 mb-2 border" key={index}>
                                 <div className="div w-100">
                                    <pre className="text-muted">
                                       Total Amount     : $ {totalAmount}<br />
                                       Payment Mode     : {paymentMode} <br />
                                       Payment Status   : {paymentStatus}

                                    </pre>
                                 </div>

                                 <table className='table'>
                                    <thead>
                                       <tr>
                                          <th>Items</th>
                                          <th>Base Price</th>
                                          <th>Sell Price</th>
                                          <th>Qty</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       {
                                          Array.isArray(items) && items.map((nItem, i) => {
                                             const { title, baseAmount, quantity, sellingPrice } = nItem;
                                             return (
                                                <tr key={i}>
                                                   <td>{title}</td>
                                                   <td>{baseAmount}</td>
                                                   <td>{sellingPrice}</td>
                                                   <td>{quantity}</td>
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



<br /> <br /> <br />
               <div className="row">
                  {
                     orderItems && orderItems.length > 0 ? orderItems.map(order => {

                        const { title, quantity, paymentMode, orderStatus, orderID, sellingPrice, customerEmail,
                           baseAmount, image, productID, sellerData, cancelReason, orderCanceledAT,
                           orderAT, orderPlacedAT, orderShippedAT, isRating, slug, paymentStatus, shippingCharge, isCanceled, refund } = order && order;
                        return (
                           <div className="col-12 mb-3" key={orderID}>
                              <div className="order_card">

                                 <div className="">
                                    <div className="row">
                                       <div className="col-lg-1">
                                          <div className="w-100 text-center h-100 d-flex align-items-center justify-content-center">
                                             <img src={image} alt="" style={{ width: "75px", height: "75px" }} />
                                          </div>
                                       </div>
                                       <div className="col-lg-11">
                                          <div className="row">
                                             <div className="col-lg-5">
                                                <div>
                                                   {title && title.length > 30 ? title.slice(0, 30) + "..." : title} <br />
                                                   <pre className="text-muted">
                                                      Price            : $ {sellingPrice}<br />
                                                      Shipping Charge  : $ {shippingCharge}<br />
                                                      Qty              : {quantity} <br />
                                                      Seller           : {sellerData?.storeName} <br />
                                                      Payment Mode     : {paymentMode} <br />
                                                      Payment Status   : {paymentStatus}

                                                   </pre>
                                                   <small>
                                                      {
                                                         refund && refund?.isRefunded && ("Refunded : " + refund?.isRefunded)
                                                      }
                                                   </small>
                                                </div>
                                             </div>

                                             <div className="col-lg-3">
                                                <p>
                                                   Total Amount : $&nbsp;{baseAmount} <br />
                                                </p>
                                             </div>

                                             <div className="col-lg-4">
                                                {
                                                   isCanceled && <>
                                                      <p>
                                                         <small className="text-muted">
                                                            {"Order Status : " + orderStatus} <br />
                                                            {"Reason : " + cancelReason} <br />
                                                            {"Cancel Time : " + calcTime(orderCanceledAT?.iso, "+6")}
                                                         </small>
                                                      </p>
                                                      <div className="text-end">
                                                         <button className='btn btn-sm text-uppercase text-muted' onClick={() => removeOrderHandler(orderID)}>Remove</button>
                                                      </div>
                                                   </>
                                                }
                                                {
                                                   orderStatus === "pending" ?
                                                      <>
                                                         <p>
                                                            <small className="text-muted">
                                                               {"Order Status : "}<i className="text-success">{orderStatus}</i> <br />
                                                               {"Order Time : " + calcTime(orderAT?.iso, "+6")}
                                                            </small>
                                                         </p>

                                                         <button className="btn btn-sm text-danger"
                                                            onClick={() => setOpenCancelForm(e => e = orderID)}
                                                            style={openCancelForm !== orderID ? { display: "block" } : { display: "none" }}>
                                                            Cancel Order
                                                         </button>

                                                         <div className="py-4" style={openCancelForm === orderID ? { display: "block" } : { display: "none" }}>
                                                            <form onSubmit={(e) => handleCancelOrder(e, { orderID, quantity, productID, customerEmail })} >
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
                                                      </> :
                                                      orderStatus === "placed" ? <p>
                                                         <small className="text-muted">
                                                            {"Order Status : "}<i className="text-success">{orderStatus}</i> <br />
                                                            {"Order Time : " + orderAT} <br />
                                                            {"Order Placed Time : " + orderPlacedAT}
                                                         </small>
                                                      </p> :
                                                         orderStatus === "shipped" ?
                                                            <>
                                                               <p>
                                                                  <small className="text-muted">
                                                                     {"Order Status : "}<i className="text-success">{orderStatus}</i> <br />
                                                                     {"Order Time : " + orderAT} <br />
                                                                     {"Order Placed Time : " + orderPlacedAT} <br />
                                                                     {"Order Shipped Time : " + orderShippedAT}
                                                                  </small>
                                                               </p>
                                                               <div className='d-flex align-items-center justify-content-end' >
                                                                  {isRating ? <Link href={`/product/${slug}#rating`}>Review</Link> :
                                                                     <>
                                                                        <button className="btn btn-sm text-danger" onClick={() => openReviewFormHandler(orderID)} style={openReviewForm !== orderID ? { display: "block" } : { display: "none" }}>
                                                                           Add Review
                                                                        </button>
                                                                        <div className="text-center p-3" style={openReviewForm === orderID ? { display: "block" } : { display: "none" }}>
                                                                           <form onSubmit={ratingHandler} className='d-flex flex-column'>
                                                                              <input type="text" disabled defaultValue={ratPoint} key={ratPoint} />
                                                                              <input type="range" min={1} max={5} step={1} name='rating_point' className='my-2' onChange={(e) => setRatPoint(e.target.value, orderID)} />
                                                                              <textarea type="text" name='rating_description' className='form-control form-control-sm' placeholder='Write a Review' />
                                                                              <input type="hidden" defaultValue={productID} name='product_id' />
                                                                              <input type="hidden" defaultValue={orderID} name='order_id' />
                                                                              <button className='btn btn-sm btn-primary mt-2'>{actLoading === true ? <BtnSpinner text={"Adding Review..."}></BtnSpinner> : "Add Review"}</button>
                                                                           </form>
                                                                           <button className='btn btn-sm' onClick={() => openReviewFormHandler(false)} style={openReviewForm === orderID ? { display: "block" } : { display: "none" }}>Back</button>
                                                                        </div>
                                                                     </>

                                                                  }
                                                               </div>
                                                            </> : ""
                                                }
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )
                     }).reverse() : <p>No Orders Available</p>
                  }
               </div>
            </div>
         </div>

      </div>
   );
};

export default MyOrder;