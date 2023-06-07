import { useState } from 'react';
import { faCartShopping, faHeart } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BtnSpinner from '../Shared/BtnSpinner/BtnSpinner';
import { apiHandler, calculateShippingCost, camelToTitleCase } from '@/Functions/common';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCartContext } from '@/lib/CartProvider';
import MoreInfoModal from './MoreInfoModal';


export default function ProductContents({ product, variationID, setMessage, userInfo }) {
   const [addCartLoading, setAddCartLoading] = useState(false);
   const [openMoreInfo, setOpenMoreInfo] = useState(false);
   const router = useRouter();
   const { asPath } = router;

   const { cartRefetch, cartData } = useCartContext();

   const defShipAddrs = userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress.find(e => e?.default_shipping_address === true);

   let inCart = Array.isArray(cartData?.products) && cartData?.products.find(e => e?.variationID === variationID);

   // add to cart handler
   const addToCartHandler = async (pId, _lid, vId, params) => {
      try {
         if (!userInfo?.email) {
            router.push(`/login?from=${asPath}`);
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


   const uniqueSwatch = [...new Set(product?.swatch?.map(variation => `${variation?.variant?.color} ++ ${variation?.image}`))];



   function getAttrs(specs, _vrid) {

      let str = [];
      if (specs) {

         for (const spec in specs) {
            let items = specs[spec];

            if (spec === "color") {
               items = null;
            }

            if (typeof items !== "object") {
               str.push(<span>{items.split(",#")[0]}</span>)
            }
         }
      }

      return str;
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
                           {product?.pricing?.sellingPrice || product?.pricing?.price}
                        </big>

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
                              product?.variations?.available <= 10 ?
                                 "Hurry, Only " + product?.variations?.available + " Left !" : ""}
                        </i>
                     </small>



                     <br />
                     {
                        Array.isArray(product?.swatch) &&
                        <div className='swatch_wrapper'>

                           {uniqueSwatch?.map(uSwatch => {

                              let uSwatchItems = uSwatch?.split(" ++ ") ?? [];

                              const hex = uSwatchItems[0]?.split(",")[1];

                              return (<div key={uSwatch} className="swatch">
                                 <div className='swatch_head' style={{ backgroundColor: hex, colorScheme: hex }}>
                                    <img src={uSwatchItems[1] ?? ""} width="38" height="38" alt="" />
                                 </div>
                                 <div className="swatch_items">
                                    {
                                       product?.swatch?.filter(variation => variation?.variant.color === uSwatchItems[0])
                                          .map(variation => {
                                             return (
                                                <Link key={variation?._vrid} style={variationID === variation?._vrid ? { color: "#1abc9c", fontWeight: "bold" } : { color: "black" }}
                                                   href={`/product/${product?.slug}?pId=${product?._id}&vId=${variation?._vrid}`}>
                                                   {getAttrs(variation?.variant, variation?._vrid)}
                                                   {variationID === variation?._vrid && <small>(Active)</small>}
                                                </Link>
                                             )
                                          })
                                    }
                                 </div>
                              </div>)

                           })}
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
                        onClick={() => (inCart ? router.push('/my-cart') :
                           addToCartHandler(product?._id, product?._lid, product?.variations?._vrid, "toCart"))}>
                        <FontAwesomeIcon icon={faCartShopping} />&nbsp;
                        {inCart ? "Go To Cart" : addCartLoading ? <BtnSpinner text={"Adding..."} /> : "Add To Cart"}
                     </button>

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

                                    : <span>Please Login</span>
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
                           <span>{product?.supplier?.store_name}</span>
                           <button onClick={() => router.push(`/store/${product?.supplier?.store_name}`)}>View Shop</button>
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





{/* <div className="p-3 my-4 d-flex align-items-center justify-content-start flex-column">
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
</div> */}