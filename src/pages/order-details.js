import { useRouter } from "next/router";
import ProtectedHOC from "./_ProtectedHOC";
import { useFetch } from "@/Hooks/useFetch";
// import { initProgressBar } from "@/Functions/ProgressBar";
import ProgressBar from "@/Components/Shared/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faCheckToSlot, faCircleCheck } from "@fortawesome/free-solid-svg-icons";



export default ProtectedHOC(() => {
   const router = useRouter();

   const { order_id, item_id } = router?.query;

   // if (!order_id || !item_id) {
   //    router.push("/user/orders-management");
   // }

   const { data } = useFetch((order_id && item_id) && `/order/${order_id}/${item_id}/details`);

   const order = data?.data?.order && data?.data?.order;


   const selectOrder = Array.isArray(order?.items) && order?.items.find(item => item?.itemId === parseInt(item_id));

   function printAttributes(obj = {}) {
      const newObj = Object.entries(obj);
      let str = "";

      for (let [key, value] of newObj) {

         if (typeof value === "string") {

            if (key === "id") continue;

            if (key === "name") {
               continue;
            }

            if (key === "phoneNumber") continue;

            if (key === "areaType") continue;

            str += `${value.split(",")[0]}, `;
         }

      }

      return str.slice(0, str.lastIndexOf(',')) + str.slice(str.lastIndexOf(',') + 1);
   }

   // const Progress = new ProgressBar();

   const orderStatusProgressData = [
      {
         status: "pending",
         title: "Pending"
      },
      {
         status: "placed",
         title: "Placed"

      }, {
         status: "shipped",
         title: "Shipped",

      }, {
         status: "delivered",
         title: "Delivered"
      }
   ]

   return (
      <div className="container py-4">
         <div className="row">
            <div className="col-12 my-3">
               <div className="card_default">
                  <div className="card_description">
                     <h5 className="mb-3">Delivery Address</h5>
                     <div className="card-text d-flex flex-column align-items-start">
                        <div className="d-flex flex-column">
                           <span className="mb-3" style={{ fontWeight: "500" }}>{order?.shippingAddress?.name}</span>
                           <i style={{ fontSize: "0.9rem" }}>{printAttributes(order?.shippingAddress)}</i>
                        </div>

                        <div className="d-flex flex-column">
                           <span className="mt-4" style={{ fontWeight: "500" }}>Phone Number</span>
                           <i style={{ fontSize: "0.9rem" }}>{
                              order?.shippingAddress?.phoneNumber
                           }</i>
                        </div>
                     </div>
                  </div>
               </div>
            </div>


            <div className="col-12 my-3">
               <div className="py-2 card_default card_description mb-2">
                  <div className="d-flex align-items-center justify-content-between flex-row">

                     <p style={{
                        margin: 0,
                        lineHeight: 1,
                        fontSize: "1rem",
                        padding: "8px 0"
                     }}>
                        <b style={{}}>Total items in this order {order?.items.length || 0}</b>
                        <span style={{ paddingBottom: "5px", display: "block" }}>Order #{order?._id}</span>
                        <small className="text-muted">
                           Placed On: {new Date(order?.orderPlacedAt).toLocaleString()}
                        </small>
                     </p>

                     <p>
                        Total: <span className="currency_sign">
                           {order?.totalAmount || 0}
                        </span>
                     </p>
                  </div>
               </div>
               <div className="row">
                  {
                     order?.items?.map((item) => {
                        const { _id, amount, image, title, storeTitle, sellPrice, quantity, status } = item;

                        return (
                           <div key={_id} className="col-12 mb-3" style={{ cursor: "pointer" }}
                              // onClick={() => router.push(`/order-details?order_id=${order_id}&item_id=${_id}`)}
                              title="About this order !"
                           >
                              <div className="card_default">
                                 <div className="card_description">
                                    <div className="py-3">

                                       {

                                          Array.isArray(status) && status.some((stat => (stat?.name !== "canceled"))) &&


                                          <div className="row d-flex justify-content-center">
                                             <div className="col-12">

                                                <div className="d-flex align-items-center justify-content-center flex-column">
                                                   <ul id="progressbar" className="text-center w-100 d-flex align-items-center justify-content-center">

                                                      {
                                                         Array.isArray(orderStatusProgressData) && orderStatusProgressData?.map(progress => {
                                                            const isTrue = Array.isArray(status) && status.some(sta => sta.name === progress?.status);

                                                            return (
                                                               <li key={progress.value} className={`step0 ${isTrue ? "active" : ""}`}>

                                                                  <b>
                                                                     {progress?.title}
                                                                  </b>
                                                                  <span className="step0_ico">
                                                                     {isTrue ?
                                                                        <FontAwesomeIcon icon={faCheck} /> :
                                                                        ""
                                                                     }
                                                                  </span>
                                                               </li>
                                                            )
                                                         })
                                                      }
                                                   </ul>

                                                   <div style={{
                                                      background: "#ebebeb",
                                                      padding: "8px 20px",
                                                      borderRadius: "5px"
                                                   }}>
                                                      {
                                                         Array.isArray(status) && status.map((s) => {
                                                            return (
                                                               <p style={{ margin: 0 }} key={s?.name}>
                                                                  <small className="text-muted">
                                                                     {new Date(s?.time).toLocaleString()}
                                                                  </small>
                                                                  <small>&nbsp;&nbsp;{s?.msg}</small></p>
                                                            )
                                                         }).reverse()
                                                      }
                                                   </div>
                                                </div>
                                             </div>
                                          </div>
                                       }
                                    </div>

                                    <div className="table-responsive">
                                       <table className="table table-bordered">
                                          <thead>
                                             <tr>
                                                <th>Photo</th>
                                                <th>Product</th>
                                                <th>Qty</th>
                                                <th>Price</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             <tr>

                                                <td>
                                                   <div className="p-1">
                                                      <img src={image?.src} alt="product-image" width="55" height="55" />
                                                   </div>
                                                </td>
                                                <td>
                                                   <span className="card-title">{title}</span><br />
                                                   <small className="text-muted">
                                                      Sold By: {storeTitle}
                                                   </small>
                                                </td>
                                                <td>
                                                   {quantity}
                                                </td>
                                                <td>
                                                   <span className="currency_sign">
                                                      {sellPrice}
                                                   </span>
                                                </td>

                                             </tr>
                                          </tbody>
                                       </table>
                                    </div>

                                 </div>
                              </div>
                           </div>
                        )
                     })
                  }
               </div>
            </div>

         </div>
      </div>
   )
});



