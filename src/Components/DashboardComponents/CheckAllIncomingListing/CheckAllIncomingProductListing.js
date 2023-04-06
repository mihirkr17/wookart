import React, { useEffect } from 'react';
import { useState } from 'react';
import { useAdminContext } from '@/lib/AdminProvider';
import { useBaseContext } from '@/lib/BaseProvider';

const CheckAllIncomingProductListing = () => {
   const { data, refetch, triggers } = useAdminContext();
   const [items, setItems] = useState(1);
   const {setMessage} = useBaseContext();
   const qProducts = data && (data?.data?.queueProducts || []);
   const countQueueProduct = data && data?.data?.countQueueProducts;

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
         if (!product) {

         }

         const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/dashboard/admin/take-this-product`, {
            method: "PUT",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: product?._LID
            }
         });

         const result = await response.json();

         if (result?.success === true && result?.statusCode === 200) {
            setMessage(result?.message, "success");
            refetch();
            return;
         } 

         setMessage(result, 'danger');

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
                        <div className="col-lg-12" key={product?._LID}>
                           <div className="card_default card_description">
                              <p>{product?._LID}</p>
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