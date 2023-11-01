import { useRouter } from "next/router";
import ProtectedHOC from "./_ProtectedHOC";
import { useFetch } from "@/Hooks/useFetch";
// import { initProgressBar } from "@/Functions/ProgressBar";
import ProgressBar from "@/Components/Shared/ProgressBar";



export default ProtectedHOC(() => {
   const router = useRouter();

   const { order_id, item_id } = router?.query;

   // if (!order_id || !item_id) {
   //    router.push("/user/orders-management");
   // }

   const { data } = useFetch((order_id && item_id) && `/order/${order_id}/${item_id}/details`);

   const order = data?.order && data?.order;


   const selectOrder = Array.isArray(order?.items) && order?.items.find(item => item?.itemId === parseInt(item_id));

   function printAttributes(obj = {}) {
      const newObj = Object.entries(obj);
      let str = "";

      for (let [key, value] of newObj) {

         if (typeof value === "string") {

            if (key === "addrsID") continue;

            if (key === "name") {
               continue;
            }

            if (key === "phone_number") continue;

            if (key === "area_type") continue;

            str += `${value.split(",")[0]}, `;
         }

      }

      return str.slice(0, str.lastIndexOf(',')) + str.slice(str.lastIndexOf(',') + 1);
   }

   // const Progress = new ProgressBar();


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
                              order?.shippingAddress?.phone_number
                           }</i>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="col-12 my-3">
               <div className="card_default">
                  <div className="card_description">
                     <div className="d-flex justify-content-between flex-wrap gap-3">


                        <div className="p-1 d-flex flex-row gap-2">
                           <div className="d-flex align-items-start justify-content-center">
                              <img src={selectOrder?.imageUrl} alt="product-image" width="65" height="65" />
                           </div>

                           <div>
                              <span className="card-title">{selectOrder?.title}</span> <br />
                              <small className="text-muted">
                                 Store: {selectOrder?.storeTitle} <br />
                                 Qty: {selectOrder?.quantity} pcs <br />
                                 {printAttributes(selectOrder?.attributes)}
                      
                              </small> <br />

                              <span className="currency_sign">
                                 {selectOrder?.amount}
                              </span>

                           </div>
                        </div>

                        <div className="p-1">
                           <button className="btn btn-sm btn-warning" onClick={() => router.push(`/rating-review?oid=${order_id}&pid=${selectOrder?.productId}&sku=${selectOrder?.sku}`)}>
                              Write a review</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {
               Array.isArray(order?.items) && order?.items.length > 1 &&

               <div className="col-12 my-3">
                  <h6>Other Items In This Order</h6>
                  <div className="row">
                     {
                        order?.items.filter(fi => (fi?.itemId !== parseInt(item_id))).map((item) => {
                           const { itemId, amount, imageUrl, title, attributes } = item;

                           return (
                              <div key={itemId} className="col-12 mb-3" style={{ cursor: "pointer" }}
                                 onClick={() => router.push(`/order-details?order_id=${order_id}&item_id=${itemId}`)}
                                 title="About this order !"
                              >
                                 <div className="card_default">
                                    <div className="card_description">
                                       <div className="d-flex">
                                          <div className="p-1">
                                             <img src={imageUrl} alt="product-image" width="65" height="65" />
                                          </div>
                                          <div className="p-1">
                                             <span className="card-title">{title}</span> <br />
                                             <small className="text-muted">
                                                Store: {selectOrder?.storeTitle} <br />
                                                {printAttributes(attributes)}
                                             </small> <br />
                                             <span className="currency_sign">
                                                {amount}
                                             </span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )
                        })
                     }
                  </div>
               </div>
            }
         </div>
      </div>
   )
});