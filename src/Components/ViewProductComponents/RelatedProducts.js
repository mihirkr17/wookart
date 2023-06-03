import React from 'react';
import Product from '../Shared/Product';

export default function RelatedProducts({ relatedProducts }) {

   return (
      <div className='product-details pt-4'>
         <div className='p_content_wrapper'>
            <h6 className="h6_title">People also viewed</h6>
            <div className="row product_wrapper w-100">
               {
                  relatedProducts && relatedProducts.map((p, i) => {
                     return (
                        <Product key={i} product={p}></Product>
                     )
                  }).reverse().slice(0, 4)
               }

            </div>
         </div>
      </div>
   );
};