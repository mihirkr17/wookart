import React, { useState } from 'react';
import { calculateShippingCost, camelToTitleCase, getSpecs, sanitizeHtml, textToTitleCase } from '@/Functions/common';
import MoreInfoModal from './MoreInfoModal';
import { useRouter } from 'next/router';
import ProductReviews from './ProductReviews';


const ProductAdditionalDetails = ({ product, userInfo }) => {

   const router = useRouter();

   const specs = product?.specification;
   const defShipAddrs = userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress.find(e => e?.default_shipping_address === true);

   return (
      <div className="product-details pt-4">

         <div className='p_content_wrapper'>
            <h6 className='h6_title'>Specification of {product?.title}</h6>
            <div className="product-details__items">
               <ul>
                  {
                     getSpecs(product?.variations?.attrs)
                  }
                  {
                     getSpecs(product?.variations?.variant)
                  }
                  {
                     getSpecs(specs)
                  }
               </ul>
            </div>
         </div>

         <div className="p_content_wrapper">
            <h6 className='h6_title'>Description of {product?.title}</h6>
            <article dangerouslySetInnerHTML={sanitizeHtml(product?.description)}></article>
         </div>


         <ProductReviews product={product} userInfo={userInfo} />


      </div>
   );
};

export default ProductAdditionalDetails;