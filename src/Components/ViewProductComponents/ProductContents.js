import { useRef, useState } from 'react';
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BtnSpinner from '../Shared/BtnSpinner/BtnSpinner';
import { apiHandler, calculateShippingCost, camelToTitleCase } from '@/Functions/common';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCartContext } from '@/lib/CartProvider';
import MoreInfoModal from './MoreInfoModal';
import { v4 as uuidv4 } from 'uuid';


export default function ProductContents({ product, sku, setMessage, userInfo }) {
   const [addCartLoading, setAddCartLoading] = useState(false);
   const [openMoreInfo, setOpenMoreInfo] = useState(false);
   const pinRef = useRef(null);
   const router = useRouter();
   const { asPath } = router;
   const { cartRefetch, cartData } = useCartContext();
   const [address, setAddress] = useState([]);

   const defShipAddrs = userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress.find(e => e?.default_shipping_address === true);

   let inCart = Array.isArray(cartData?.products) && cartData?.products.find(e => e?.sku === sku);

   // add to cart handler
   const addToCartHandler = async (pId, sku, params) => {
      try {


         setAddCartLoading(true);

         if (product?.variation?.stock === "in") {

            const { success, message } = await apiHandler(`/cart/add-to-cart`, "POST", {
               quantity: 1,
               productId: pId,
               sku,
               action: params
            }, () => router.push(`/login?redirect_to=${encodeURIComponent(asPath)}`));

            setAddCartLoading(false);

            if (success) {
               cartRefetch();
               setMessage(message, "success");
               router.push('/cart');
               return;
            }

            return setMessage(message, "danger");
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }

   const addToWishlist = async (product) => {

      let wishlistProduct = {
         _id: product._id,
         title: product.title,
         slug: product.slug,
         brand: product.brand,
         image: product.images[0],
         pricing: product?.pricing?.sellingPrice,
         stock: product?.stockInfo?.stock,
         user_email: userInfo?.email,
         seller: product?.seller?.name
      }


      const { success, message } = await apiHandler(`/wishlist/add-to-wishlist/${userInfo?.email}`, "POST", wishlistProduct);

      if (success) {
         await authRefetch();
         setMessage(<p className='py-2 text-success'><small><strong>{message}</strong></small></p>);
      }
   }

   const removeToWishlist = async (productID) => {
      const { success, message } = await apiHandler(`/wishlist/remove-from-wishlist/${productID}`, "DELETE");

      if (success) {
         await authRefetch();
         setMessage(<p className='py-2 text-success'><small><strong>{message}</strong></small></p>);
      }
   }

   function variantLooping(obj) {
      let str = "";

      for (const key in obj) {
         str += `${key}: ${obj[key]}, `;
      }

      return str.slice(0, -2);
   }


   function handleVariation(sku) {
      return router.push(`/product/${product?.slug}?pId=${product?._id}&sku=${sku}`);
   }

   async function handleLocation() {

      if (pinRef.current === null) return;

      const pinCode = pinRef.current?.value;
      const url = `https://nominatim.openstreetmap.org/search.php?q=${pinCode}&polygon_geojson=1&countrycodes=bd&format=jsonv2`;
      const fullUrl = `https://nominatim.openstreetmap.org/search?postalcode=${pinCode}&format=json`
      const response = await fetch(url, {
         method: "GET"
      });

      const result = await response.json();

      setAddress(result);
   }

   return (
      <div style={{ width: "100%" }}>
         <div className="container">
            <div className="row">

               <div className="col-lg-7">

                  <article>

                     <div className="product_title py-2">
                        <span className='textMute'>{product?.brand}</span>

                        <h2>{product?.title}</h2>
                     </div>

                     <div className="product_rating_model">
                        <small>{product?.ratingAverage || 0} out of 5</small>
                     </div>

                     <div className="product_price_model">
                        <big>
                           <span className="currency_sign"></span>
                           {product?.pricing?.sellingPrice?.toLocaleString() || product?.pricing?.price?.toLocaleString()}
                        </big>

                        <div>
                           <strike>
                              <i className='currency_sign'>{product?.pricing?.price?.toLocaleString()}</i>
                           </strike>
                           <span>
                              ({product?.pricing?.discount || 0}%) off
                           </span>
                        </div>
                     </div>


                     <small className='text-muted'>
                        <i>
                           {product?.variation?.stock === "out" ? <span className='badge_failed'>Out of Stock</span> :
                              product?.variation?.available <= 10 ?
                                 "Hurry, Only " + product?.variation?.available + " Left !" : ""}
                        </i>
                     </small>



                     <br />
                     {
                        Array.isArray(product?.swatch) &&
                        <div className='swatch_wrapper'>
                           <label htmlFor="swatch">Variation :</label>
                           <select name="swatch" id="swatch" className='form-select form-select-sm' defaultValue={sku || ""} onChange={e => handleVariation(e.target.value)}>

                              {
                                 product?.swatch?.map((swatch, index) => {

                                    let attribute = swatch?.attributes;
                           

                                    return (
                                       <option key={index} disabled={(swatch?.stock === "out" && swatch?.sku === sku ) ? true : false} value={swatch?.sku}>
                                          {variantLooping(attribute)}
                                       </option>
                                    )
                                 })
                              }
                           </select>


                        </div>
                     }

                     <br />

                     {
                        product?.highlights && <ul>
                           {
                              product?.highlights?.map((item, index) => {
                                 return (
                                    <li style={{ color: "green" }} key={index}>* {item}</li>
                                 )
                              })
                           }
                        </ul>
                     }
                  </article>


                  <div className="py-3 mt-4 product_handler">

                     <button className='ph_btn addToCartBtn'
                        onClick={() => (inCart ? router.push('/cart') :
                           addToCartHandler(product?._id, product?.variation?.sku, "toCart"))}>
                        <FontAwesomeIcon icon={faCartShopping} />&nbsp;
                        {inCart ? "Go To Cart" : addCartLoading ? <BtnSpinner text={"Adding..."} /> : "Add To Cart"}
                     </button>

                     {
                        product?.variation?.stock === "in" &&
                        <Link href={{
                           pathname: `/checkout`,
                           query: {
                              data: JSON.stringify({
                                 productId: product?._id,
                                 sku: product?.variation?.sku,
                                 quantity: 1
                              }),
                              session: `${uuidv4()}`
                           }
                        }}

                           as={`/checkout?session=${uuidv4()}`}
                           className='buyBtn ph_btn'
                        >
                           Buy Now
                        </Link>
                     }

                     {/* <button title={`${product?.inWishlist ? "Remove from wishlist" : "Add to wishlist"}`}
className={`wishlistBtn ph_btn ${product?.inWishlist ? "active" : ""}`}
onClick={() => (product?.inWishlist ? removeToWishlist(product?._id) : addToWishlist(product))}>
<FontAwesomeIcon icon={faHeart} />
</button> */}


                  </div>

               </div>


               <div className="col-lg-5">

                  <div className='p_content_wrapper'>
                     <h6 className='h6_title'>Delivery</h6>

                     <div className='pb-3'>
                        <div className="p_content">
                           <div className="p_content__img">
                              <img src="/ecom/location-address.svg" width="24" height="24" alt="" />
                           </div>
                           <div className="p_content__text">
                              {
                                 defShipAddrs ?
                                    <span>
                                       {
                                          defShipAddrs?.division + ", " + defShipAddrs?.city + ", " + defShipAddrs?.area
                                       }
                                    </span>

                                    : <div className='d-flex align-items-center justify-content-between position-relative'>
                                       <input type="number" name="pin_code" id="pin_code" ref={pinRef} className='form-control form-control-sm' />
                                       <button className='btn btn-sm btn-primary' onClick={handleLocation}>Check</button>

                                       <ul className="py-2 list-group position-absolute" style={{
                                          top: "30px",
                                          right: "0",
                                          zIndex: 1,
                                          width: "calc(100% + 20%)"
                                       }}>
                                          {
                                             address && address?.map((addr, index) => {
                                                return (
                                                   <li className='list-group-item' key={index}>{addr?.display_name}</li>
                                                )
                                             })
                                          }
                                       </ul>
                                    </div>

                              }
                           </div>
                        </div>
                     </div>


                     <div className='pb-3'>
                        <div className="p_content">
                           <div className="p_content__img">
                              <img src="/ecom/handshake-deal.svg" width="24" height="24" alt="" />
                           </div>
                           <div className="p_content__text">
                              <span>Fulfilled by</span>
                              <span>
                                 {camelToTitleCase(product?.fulfilledBy)}
                              </span>
                           </div>
                        </div>
                     </div>


                     <div className='pb-3'>
                        <div className='p_content'>
                           <div className="p_content__img">
                              <img src="/ecom/delivery-package-shipping.svg" width="24" height="24" alt="" />
                           </div>
                           <div className="p_content__text">
                              <span>Standard Delivery</span>

                              {
                                 (product?.isFreeShipping) ? <span>Free</span> :
                                    <span className='currency_sign'>
                                       {calculateShippingCost(product?.volumetricWeight, defShipAddrs?.area_type)}
                                    </span>
                              }

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
                     <h6 className='h6_title'>
                        Sold By
                     </h6>
                     <div className='seller_div_wrap'>
                        <div className='seller_div_img'>
                           <img src="/ecom/store-official-ecommerce-svgrepo-com.svg" width="28" height="28" alt="" />
                        </div>
                        <div className='seller_div_text'>
                           <span>{product?.storeTitle}</span>
                           <button onClick={() => router.push(`/store/${product?.storeTitle}?id=${product?.storeId}`)}>View Shop</button>
                        </div>
                     </div>
                  </div>

                  <div className="row p_ppl">
                     <div className="col-4 p_ppl_it">
                        <div className="p_ppl_it_img">
                           <img src="/ecom/discount-svgrepo-com.svg" width="28" height="28" alt="" />
                        </div>
                        <span>Lowest Price</span>
                     </div>
                     <div className="col-4 p_ppl_it">
                        <div className="p_ppl_it_img">
                           <img src="/ecom/cash-dollar-svgrepo-com.svg" width="28" height="28" alt="" />
                        </div>
                        <span>Cash On Delivery</span>
                     </div>
                     <div className="col-4 p_ppl_it">
                        <div className="p_ppl_it_img">
                           <img src="/ecom/deliver-svgrepo-com .svg" width="28" height="28" alt="" />
                        </div>
                        <span>7-days Return</span>
                     </div>
                  </div>
               </div>

            </div>
         </div >
      </div >
   );
};