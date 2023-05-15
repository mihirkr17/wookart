import React, { useState } from 'react';
import { Interweave } from 'interweave';
import { calculateShippingCost, camelToTitleCase, textToTitleCase } from '@/Functions/common';


const ProductAdditionalDetails = ({ product, userInfo }) => {

   const specs = product?.specification;
   const defShipAddrs = userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress.find(e => e?.default_shipping_address === true);


   function getSpecs(specs = {}) {
      let str = [];
      if (specs) {

         for (const [key, value] of Object.entries(specs)) {
            let pp = <li key={value + Math.round(Math.random() * 999)}>
               <span>{textToTitleCase(key)}</span> <span>{value.split(",#")[0]}</span>
            </li>
            str.push(pp);
         }
      }
      return str;
   }

   return (
      <div className="product-details row pt-4">

         <div className="col-lg-6">

            <div className='p_meta_info'>
               <h6 className='dwhYrQ'>Delivery</h6>

               <div className='pb-3 d-flex align-items-center justify-content-between'>
                  <div className="delivery_meta">
                     <div className="delivery_meta__img">
                        <img src="/ecom/map-location-svgrepo-com.svg" width="28" height="28" alt="" />
                     </div>
                     <div className="delivery_meta__text">
                        {
                           defShipAddrs ?
                              <span>
                                 {
                                    defShipAddrs?.division + ", " + defShipAddrs?.city + ", " + defShipAddrs?.area
                                 }
                              </span>

                              : <span>Please Login</span>
                        }
                     </div>
                  </div>
               </div>

               {
                  product?.fulfilledBy &&
                  <div className='pb-3 d-flex align-items-center justify-content-between'>
                     <div className="delivery_meta">
                        <div className="delivery_meta__img">
                           <img src="/ecom/agreement-svgrepo-com.svg" width="28" height="28" alt="" />
                        </div>
                        <div className="delivery_meta__text">
                           <span>Fulfilled by</span>
                           <div>
                              {camelToTitleCase(product?.fulfilledBy)}
                           </div>
                        </div>
                     </div>
                  </div>
               }

               <div className='pb-3 d-flex align-items-center justify-content-between'>
                  <div className='delivery_meta'>
                     <div className="delivery_meta__img">
                        <img src="/ecom/delivery-truck-svgrepo-com.svg" width="28" height="28" alt="" />
                     </div>
                     <div className="delivery_meta__text">
                        <span>Standard Delivery</span>
                        <div>
                           {
                              (product?.isFreeShipping) ? "Free" : <span className='currency_sign'>{calculateShippingCost(product?.volumetricWeight, defShipAddrs?.area_type)}</span>
                           }
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <div className="p_meta_info">
               <h6 className='dwhYrQ'>
                  Sold By
               </h6>
               <div className='seller_div_wrap'>
                  <div className='seller_div_img'>
                     <img src="/ecom/store-official-ecommerce-svgrepo-com.svg" width="32" height="32" alt="" />
                  </div>
                  <div className='seller_div_text'>
                     <span>{product?.sellerData?.storeName}</span>
                     <button>View Shop</button>
                  </div>
               </div>
            </div>
         </div>

         <div className="col-lg-6">

            <div className='p_meta_info'>
               <h6 className='dwhYrQ'>Specification of {product?.title}</h6>
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


         </div>

         <div className="col-12">
            <div className="p_meta_info">
               <h6 className='dwhYrQ'>Description of {product?.title}</h6>
               <article>
                  {/* <Interweave content={product?.description} /> */}
               </article>
            </div>
         </div>

         {/* </div> */}
      </div>
   );
};

export default ProductAdditionalDetails;