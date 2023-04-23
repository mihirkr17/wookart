import { useState } from 'react';
import { faCartShopping, faHandshake, faLocationPin, faTruck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BtnSpinner from '../Shared/BtnSpinner/BtnSpinner';
import { apiHandler, calculateShippingCost, camelToTitleCase } from '@/Functions/common';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCartContext } from '@/lib/CartProvider';


export default function ProductContents({ product, variationID, setMessage, userInfo }) {
   const [addCartLoading, setAddCartLoading] = useState(false);
   const router = useRouter();

   const { cartRefetch, cartData } = useCartContext();

   const defShipAddrs = userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress.find(e => e?.default_shipping_address === true);

   let inCart = Array.isArray(cartData?.products) && cartData?.products.find(e => e?.variationID === variationID);

   // add to cart handler
   const addToCartHandler = async (pId, _lid, vId, params) => {
      try {
         if (!userInfo?.email) {
            router.push('/login');
            return;
         }

         setAddCartLoading(true);

         if (product?.variations?.stock === "in") {

            const { success, message } = await apiHandler(`/cart/add-to-cart`, "POST", {
               quantity: 1,
               productID: pId,
               listingID: _lid,
               variationID: vId,
               action: params
            });

            setAddCartLoading(false);

            if (success) {
               cartRefetch();
               setMessage(message, "success");
               router.push('/my-cart');
               return;
            }

            return setMessage(message, "danger");
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }

   return (
      <div className='row w-100'>
         <div className="col-lg-8">
            <article>

               <h5 className="product_title py-2">
                  <span className='textMute'>{product?.brand}</span> <br />
                  {product?.title}
               </h5>

               <div className="product_rating_model">
                  <small>{product?.ratingAverage || 0} out of 5</small>
               </div>

               <div className="product_price_model">
                  <big><span className="currency_sign"></span>{product?.pricing?.sellingPrice || product?.pricing?.price}</big>

                  <div>
                     <strike>
                        <i className='currency_sign'>{product?.pricing?.price}</i>
                     </strike>
                     <span>
                        ({product?.pricing?.discount || 0}%) off
                     </span>
                  </div>
               </div>


               <small className='text-muted'>
                  <i>
                     {product?.variations?.stock === "out" ? <span className='badge_failed'>Out of Stock</span> :
                        "Hurry, Only " + product?.variations?.available + " Left !"}
                  </i>
               </small>



               <br />

               {
                  product?.swatch && Array.isArray(product?.swatch) &&
                  <div className="p-3 my-4 d-flex align-items-center justify-content-start flex-column">
                     {
                        <div className="d-flex align-items-center justify-content-start w-100">


                           <div className="px-3 d-flex flex-row">

                              {
                                 product?.swatch.map((e, i) => {

                                    let hex = e?.variant?.color.split(",")[1];

                                    return (

                                       <div key={i} className='d-flex align-items-center justify-content-center flex-column'>
                                          {
                                             e?.variant?.color &&
                                             <Link className={`swatch_size_btn ${e._vrid === variationID ? 'active' : ''}`}
                                                href={`/product/${product?.slug}?pId=${product?._id}&vId=${e._vrid}`}>
                                                <div style={{
                                                   backgroundColor: hex,
                                                   display: 'block',
                                                   width: '20px',
                                                   height: '20px',
                                                   borderRadius: "100%"
                                                }}>
                                                </div>
                                                {e?.variant?.sizes && <span>{e?.variant?.sizes}</span>}
                                                {e?.variant?.ram && <span>{e?.variant?.ram}</span>}
                                                {e?.variant?.rom && <span>{e?.variant?.rom}</span>}
                                             </Link>
                                          }

                                       </div>
                                    )
                                 })
                              }
                           </div>
                        </div>

                     }
                  </div>
               }

               <br />

               {
                  product?.bodyInfo?.keyFeatures && <ul>
                     {
                        Array.isArray(product?.bodyInfo?.keyFeatures) ? product?.bodyInfo?.keyFeatures.map((item, index) => {
                           return (
                              <li style={{ color: "green" }} key={index}>* {item}</li>
                           )
                        }) : ""
                     }
                  </ul>
               }
            </article>

            {
               <div className="py-3 mt-4 product_handler">

                  {
                     (!inCart || typeof inCart === 'undefined') ?
                        <button
                           className='addToCartBtn'
                           disabled={product?.variations?.stock === "out" ? true : false}
                           onClick={() => addToCartHandler(product?._id, product?._lid, product?.variations?._vrid, "toCart")}
                        >
                           {
                              addCartLoading ? <BtnSpinner text={"Adding..."} /> : <>
                                 <FontAwesomeIcon icon={faCartShopping} /> Add To Cart
                              </>
                           }
                        </button> :
                        <button className='ms-4 addToCartBtn' onClick={() => router.push('/my-cart')}>
                           Go To Cart
                        </button>
                  }
                  {
                     product?.variations?.stock === "in" &&
                     <Link href={{
                        pathname: `/single-checkout`,
                        query: {
                           data: JSON.stringify({
                              listingID: product?._lid,
                              productID: product?._id,
                              variationID: product?.variations?._vrid,
                              quantity: 1,
                              customerEmail: userInfo?.email
                           }),
                           oTracker: `buy.${product?.title}`
                        }
                     }}

                        as={`/single-checkout?oTracker=buy.${product?.title}`}
                        className='ms-4 buyBtn'
                     >
                        Buy Now
                     </Link>
                  }
               </div>
            }
         </div>

         <div className="col-lg-4 product_right_side_col">
            <h6>Delivery</h6>

            <div className="pb-2 d-flex align-items-center justify-content-between">
               <div className='pe-2'>
                  <FontAwesomeIcon icon={faLocationPin} />
               </div>
               <div className='textMute'>
                  {
                     defShipAddrs ?
                        <address>
                           <span>
                              {
                                 defShipAddrs?.division + ", " + defShipAddrs?.city + ", " + defShipAddrs?.area
                              }
                           </span>
                        </address>
                        : "Please Login"
                  }
               </div>
            </div>
            <hr />

            {
               product?.fulfilledBy &&
               <div className='pb-3 d-flex align-items-center justify-content-between'>
                  <div className='textMute'>
                     <FontAwesomeIcon icon={faHandshake} /> &nbsp;
                     Fulfilled by
                  </div>
                  <div>
                     {camelToTitleCase(product?.fulfilledBy)}
                  </div>
               </div>
            }



            <div className='pb-2 d-flex align-items-center justify-content-between'>
               <div className='textMute'>
                  <FontAwesomeIcon icon={faTruck} /> &nbsp;
                  Standard Delivery
               </div>

               <div>
                  {
                     (product?.isFreeShipping) ? "Free" : <span className='currency_sign'>{calculateShippingCost(product?.volumetricWeight, defShipAddrs?.area_type)}</span>
                  }
               </div>
            </div>

            <hr />

            <div className="py-3">
               <small className='textMute'>
                  Sold By : &nbsp;&nbsp;
               </small>
               <span className='seeMore'>
                  {product?.sellerData?.storeName}
               </span>
            </div>
         </div>
      </div>
   );
};