import { usePrice } from '@/Hooks/usePrice';
import { useBaseContext } from '@/lib/BaseProvider';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { categories } from '@/CustomData/categories';
import { apiHandler } from '@/Functions/common';
import ImageUploader from '@/Components/Global/ImageUploader';

const ProductVariations = ({ data, formTypes, refetch, closeModal }) => {
   const required = <span style={{ color: "red" }}>*</span>;

   // Variables and state are declared here
   const variation = data?.variations && data?.variations;

   const { setMessage } = useBaseContext();

   const [category, subCategory, postCategory] = data?.categories || [];

   const [variant, setVariant] = useState(variation?.variant || {});

   const [attrs, setAttrs] = useState(variation?.attrs || {});

   const [brandColor, setBrandColor] = useState(variation?.brandColor || "");


   const [images, setImages] = useState((variation?.images ?? [""]));

   // categories
   const sub_category = categories && categories.find(e => e.name === category);

   const post_category = sub_category?.subCategories?.find(e => e.name === subCategory);

   const categoryFeatures = post_category?.postCategories?.find(e => e.name === postCategory);

   const [inputPriceDiscount, setInputPriceDiscount] = useState({
      price: (variation?.pricing?.price ?? ""),
      sellingPrice: (variation?.pricing?.sellingPrice ?? "")
   });

   const { discount } = usePrice(inputPriceDiscount.price, inputPriceDiscount.sellingPrice);

   // functions are written here...

   // main handler of variation data
   async function variationHandler(e) {
      try {
         e.preventDefault();

         let sku = e.target.sku.value;
         let available = e.target.available.value;
         let price = e.target.price.value;
         let sellingPrice = e.target.sellingPrice.value;
         let variations = {
            images,
            brandColor,
            sku,
            variant,
            attrs,
            available,
            pricing: {
               price,
               sellingPrice
            }
         }


         let model = {
            productID: data?._id && data?._id,
            variations
         }


         if (["new-variation", "update-variation"].includes(formTypes)) {
            const { success, message } = await apiHandler(`/dashboard/seller/products/set-product-variation?formType=${formTypes}&requestFor=product_variations`, "PUT", { request: model });

            if (success) {
               setMessage(message, 'success');
               refetch();
               closeModal();
               return;
            }

            setMessage(message, 'danger');
         }

      } catch (error) {
         setMessage(error?.message, 'danger')
      }
   }


   // dynamic way to generate input fields, Basically it takes an object as a parameter
   function cSl(obj = {}, existObj = {}, params) {

      let attObject = Object.entries(obj);

      let str = [];

      for (let [key, value] of attObject) {

         str.push(
            (Array.isArray(value) && <div className="col-lg-3 mb-3">
               <label htmlFor={key}>{key.replace(/_+/gi, " ").toUpperCase()}</label>

               <select
                  name={key}
                  id={key}
                  className='form-select form-select-sm'
                  onChange={(e) => (params === "variant" ? setVariant({ ...variant, [e.target.name]: e.target.value }) : setAttrs({ ...attrs, [e.target.name]: e.target.value }))}>
                  {
                     Object.keys(existObj).includes(key) && <option value={existObj[key]}>{existObj[key]?.split(",")[0]}</option>
                  }

                  <option value="">Select {key.replace("_", " ")}</option>
                  {
                     value && value.map((val, i) => {
                        return (<option key={i.toString() + key + params} value={val}>{val?.split(",")[0]}</option>)
                     })
                  }
               </select>

            </div>

            ), typeof value !== 'object' && <div className="col-lg-3 mb-3">
               <label htmlFor={key}>{required} {key.replace(/_+/gi, " ").toUpperCase()}</label>
               <input
                  type="text"
                  name={key}
                  id={key}
                  placeholder={"Write " + key}
                  onChange={(e) => (params === "variant" ? setVariant({ ...variant, [e.target.name]: e.target.value }) : setAttrs({ ...attrs, [e.target.name]: e.target.value }))}
                  defaultValue={Object.keys(existObj).includes(key) ? existObj[key] : ""}
                  className='form-control form-control-sm'
               />
            </div>

         )
      }

      return str;
   }


   return (

      <div className="p-3">
         {
            formTypes === "new-variation" ? <h6>Add New Variation</h6> : <h6>Variation Information</h6>
         }

         <small>
            <b>Product ID: {data?._id}</b> <br />
            {
               variation?.sku &&
               <b>Product SKU: {variation?.sku}</b>
            }
         </small>

         <ImageUploader images={images} setImages={setImages} />

         <form onSubmit={variationHandler}>
            {/* Price Stock And Shipping Information */}
            <div className="row my-4">

               {/* Price information  */}
               <div className="col-lg-12 my-2">
                  <h6>Price Details</h6>
                  <div className="row">
                     {/* Price */}
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='price'>{required} Price (BDT)</label>
                        <input name='price' id='price' type='number' className="form-control form-control-sm" value={inputPriceDiscount.price || ""}
                           onChange={e => setInputPriceDiscount({ ...inputPriceDiscount, [e.target.name]: e.target.value })} />
                     </div>

                     {/* Selling Price */}
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='sellingPrice'>Selling Price<small>(Discount : {discount || 0}%)</small></label>
                        <input name='sellingPrice' id='sellingPrice' type='number' className="form-control form-control-sm"
                           value={inputPriceDiscount.sellingPrice}
                           onChange={e => setInputPriceDiscount({ ...inputPriceDiscount, [e.target.name]: e.target.value })} />
                     </div>
                  </div>
               </div>



               {/* Price Details */}
               <div className="col-lg-12 my-2">
                  <b>Stock Details</b>
                  <div className="row">

                     {/* Stock */}
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='available'>{required} Stock</label>
                        <input className='form-control form-control-sm' name='available' id='available' type='number'
                           defaultValue={variation?.available} />
                     </div>

                     {/* SKU */}
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='sku'>{required} SKU <small>(Stock Keeping Unit)</small></label>
                        <input className='form-control form-control-sm' name='sku' id='sku' type='text' defaultValue={variation?.sku || ""} />
                     </div>
                  </div>
               </div>

               <br />

               <div className="col-lg-3">
                  <label htmlFor="brandColor">Brand Color</label>
                  <select name="brandColor" className='form-select' id="brandColor" value={brandColor || ""} onChange={(e) => setBrandColor(e.target.value)}>
                     {
                        variation?.brandColor && <option value={variation?.brandColor}>{variation?.brandColor}</option>
                     }
                     <option value="">Select Color</option>
                     {
                        categoryFeatures?.color?.map((clr) => {
                           return (
                              <option key={clr} value={clr}>{clr}</option>
                           )
                        })
                     }
                  </select>
               </div>

               {
                  cSl(categoryFeatures?.variant, variation?.variant, "variant")
               }

               <br />
               <p>Attrs</p>

               {
                  cSl(categoryFeatures?.attrs, variation?.attrs, "attrs")
               }

            </div>



            <div className="col-lg-12 my-2 pt-4">

               <button type='submit' className='bt9_edit'>{formTypes === "listing" ? "Add Variation" : "Save Changes"}</button>
            </div>
         </form>
      </div>
   )
}

export default ProductVariations;
