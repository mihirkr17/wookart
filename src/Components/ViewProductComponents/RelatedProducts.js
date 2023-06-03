import React from 'react';
import Product from '../Shared/Product';
import Link from 'next/link';

export default function RelatedProducts({ relatedProducts }) {

   return (
      <div className='product-details pt-4'>
         <div className='p_content_wrapper'>
            <h6 className="h6_title">People also viewed</h6>
            <div className="row product_wrapper w-100">
               {
                  relatedProducts && relatedProducts.map((product, i) => {
                     return (
                        <div key={i} className='product_card product_card_rel my-2'>

                           <Link href={`/product/${product?.slug}?pId=${product?._id}&vId=${product?._vrid}&oTracker=${product?._vrid}`}>

                              <div className="product_card_img product_card_img_rel ">
                                 <img src={product?.image && product?.image} alt='' />
                              </div>
                              <article className='product_card_description'>
                                 <div className="product_title product_title_rel">
                                    <span>{product?.brand}</span>
                                    <h1>
                                       {product?.title && product?.title.length > 20 ? product?.title.slice(0, 20) + "..." : product?.title}
                                    </h1>
                                    <small>{product?.packageInfo?.inTheBox}</small>
                                 </div>

                                 <div className='product_meta'>

                                    <div className="rating_model">
                                       <small>{product?.ratingAverage || 0} ({product?.reviews && product?.reviews.length})</small>
                                    </div>

                                    <div className="price_model">
                                       <big><span className='dollar_Symbol currency_sign'></span>{product?.pricing?.sellingPrice || product?.pricing?.price}</big>
            
                                       {
                                          product?.shipping?.isFree && product?.shipping?.isFree && <small className='text-center'>Free Shipping</small>
                                       }
                                    </div>


                                 </div>
                              </article>
                           </Link>
                        </div>
                     )
                  }).reverse().slice(0, 4)
               }

            </div>
         </div>
      </div>
   );
};