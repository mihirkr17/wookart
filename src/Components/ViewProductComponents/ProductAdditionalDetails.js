import React, { useState } from 'react';
import { calculateShippingCost, camelToTitleCase, getSpecs, sanitizeHtml, textToTitleCase } from '@/Functions/common';
import MoreInfoModal from './MoreInfoModal';


const ProductAdditionalDetails = ({ product, userInfo }) => {
   const [openMoreInfo, setOpenMoreInfo] = useState(false);

   const specs = product?.specification;
   const defShipAddrs = userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress.find(e => e?.default_shipping_address === true);

   return (
      <div className="product-details row pt-4">

         <div className="col-lg-6">

            <div className='p_content_wrapper'>
               <h6 className='dwhYrQ'>Delivery</h6>

               <div className='pb-3'>
                  <div className="p_content">
                     <div className="p_content__img">
                        <img src="/ecom/map-location-svgrepo-com.svg" width="28" height="28" alt="" />
                     </div>
                     <div className="p_content__text">
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


               <div className='pb-3'>
                  <div className="p_content">
                     <div className="p_content__img">
                        <img src="/ecom/agreement-svgrepo-com.svg" width="28" height="28" alt="" />
                     </div>
                     <div className="p_content__text">
                        <span>Fulfilled by</span>
                        <div>
                           {camelToTitleCase(product?.fulfilledBy)}
                        </div>
                     </div>
                  </div>
               </div>


               <div className='pb-3'>
                  <div className='p_content'>
                     <div className="p_content__img">
                        <img src="/ecom/delivery-truck-svgrepo-com.svg" width="28" height="28" alt="" />
                     </div>
                     <div className="p_content__text">
                        <span>Standard Delivery</span>
                        <div>
                           {
                              (product?.isFreeShipping) ? "Free" :
                                 <span className='currency_sign'>
                                    {calculateShippingCost(product?.volumetricWeight, defShipAddrs?.area_type)}
                                 </span>
                           }
                        </div>
                     </div>
                  </div>
               </div>

               <div className="pb-3">
                  <button className="more_info_btn" onClick={() => setOpenMoreInfo(product)}>
                     More Information
                  </button>

                  {openMoreInfo && <MoreInfoModal data={openMoreInfo} closeModal={() => setOpenMoreInfo(false)} />}

               </div>
            </div>

            <div className="p_content_wrapper">
               <h6 className='dwhYrQ'>
                  Sold By
               </h6>
               <div className='seller_div_wrap'>
                  <div className='seller_div_img'>
                     <img src="/ecom/store-official-ecommerce-svgrepo-com.svg" width="32" height="32" alt="" />
                  </div>
                  <div className='seller_div_text'>
                     <span>{product?.supplier?.store_name}</span>
                     <button>View Shop</button>
                  </div>
               </div>
            </div>

            <div className="row p_mouka">
               <div className="col-4 mouka">
                  <div className="p-1">
                     <img src="/ecom/discount-svgrepo-com.svg" width="32" height="32" alt="" />
                  </div>
                  <span>Lowest Price</span>
               </div>
               <div className="col-4 mouka">
                  <div className="p-1">
                     <img src="/ecom/cash-dollar-svgrepo-com.svg" width="32" height="32" alt="" />
                  </div>
                  <span>Cash On Delivery</span>
               </div>
               <div className="col-4 mouka">
                  <div className="p-1">
                     <img src="/ecom/deliver-svgrepo-com .svg" width="32" height="32" alt="" />
                  </div>
                  <span>7-days Return</span>
               </div>
            </div>
         </div>

         <div className="col-lg-6">

            <div className='p_content_wrapper'>
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
            <div className="p_content_wrapper">
               <h6 className='dwhYrQ'>Description of {product?.title}</h6>
               <article dangerouslySetInnerHTML={sanitizeHtml(product?.description)}></article>
            </div>
         </div>
      </div>
   );
};

export default ProductAdditionalDetails;