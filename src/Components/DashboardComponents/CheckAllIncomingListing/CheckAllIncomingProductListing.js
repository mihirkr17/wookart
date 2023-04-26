import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAdminContext } from '@/lib/AdminProvider';
import { useBaseContext } from '@/lib/BaseProvider';
import { apiHandler } from '@/Functions/common';

const CheckAllIncomingProductListing = () => {
   const { data, refetch, triggers } = useAdminContext();
   const [items, setItems] = useState(1);
   const { setMessage } = useBaseContext();
   const qProducts = data && (data?.queueProducts || []);
   const countQueueProduct = data && data?.countQueueProducts;

   useEffect(() => {
      const cc = countQueueProduct && Math.ceil(countQueueProduct / 3)
      setItems(cc);
   }, [countQueueProduct]);


   let pageBtn = [];

   for (let i = 1; i <= items; i++) {
      pageBtn.push(i);
   }


   // handlers
   const takeThisProductHandler = async (product) => {
      try {
         if (!product)
            return;

         const { success, message, statusCode } = await apiHandler(`/dashboard/admin/take-this-product`, "PUT", { listingID: product?._lid });

         if (success === true && statusCode === 200) {
            setMessage(message, "success");
            refetch();
            return;
         }

         setMessage(message, 'danger');

      } catch (error) {

      }
   }

   return (
      <div className='section_default'>
         <div className="container">

            <h5>Incoming Listing</h5>
            <div className="row">
               {
                  Array.isArray(qProducts) && qProducts.map((product) => {
                     return (
                        <div className="col-lg-12" key={product?._lid}>
                           <div className="card_default card_description">
                              <p>{product?._lid}</p>
                              <button className='bt9_edit' onClick={() => takeThisProductHandler(product)}>Take This Product</button>
                           </div>
                        </div>
                     )
                  })
               }
            </div>

            <div>
               <div className="py-3 text-center pagination_system">
                  <ul className='pagination justify-content-center pagination-sm'>
                     {items >= 0 ? pageBtn.map((p, i) => {
                        return (
                           <button className='page-item' key={i} onClick={() => triggers(p)}>
                              {p}
                           </button>
                        );
                     }) : ""}
                  </ul>
               </div>
            </div>
         </div>
      </div>
   );
};

export default CheckAllIncomingProductListing;