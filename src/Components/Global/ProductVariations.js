import { apiHandler } from '@/Functions/common';
import { usePrice } from '@/Hooks/usePrice';
import { useBaseContext } from '@/lib/BaseProvider';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react';
import { useState } from 'react';


const ProductVariations = ({ required, data, formTypes, super_category, userInfo, refetch }) => {

   const variation = data?.variations && data?.variations;

   const { setMessage } = useBaseContext();

   const [variant, setVariant] = useState(variation?.variant || {});

   const [attrs, setAttrs] = useState(variation?.attrs || {});

   const [images, setImages] = useState((variation?.assets?.images && variation?.assets?.images.length >= 1 ? variation?.assets?.images : [""]));

   const [previewImages, setPreviewImages] = useState([]);

   const [inputPriceDiscount, setInputPriceDiscount] = useState({
      price: (variation?.pricing?.price ?? ""),
      sellingPrice: (variation?.pricing?.sellingPrice ?? "")
   });
   
   const { discount } = usePrice(inputPriceDiscount.price, inputPriceDiscount.sellingPrice);

   // preview images
   function handleImagesPreview(e) {
      const files = Array.from(e.target.files);
      const readers = [];

      files.forEach((file) => {
         const reader = new FileReader();

         reader.onload = function (e) {
            setPreviewImages((prevImages) => [...prevImages, e.target.result]);
         };

         reader.readAsDataURL(file);
         readers.push(reader);
      });
   }


   // images upload handlers 
   const imageInputHandler = (e, index) => {
      const { value } = e.target;
      let list = [...images];
      list[index] = value;
      setImages(list);
   }

   const removeImageInputFieldHandler = (index) => {
      let listArr = [...images];
      listArr.splice(index, 1);
      setImages(listArr);
   }


   const btnStyle = {
      cursor: "pointer",
      display: "block",
      padding: "0.2rem",
      marginLeft: "0.5rem"
   }

   async function handleVariationOne(e) {
      try {
         e.preventDefault();
         // setActionLoading(true);

         let sku = e.target.sku.value;
         let available = e.target.available.value;
         let variationID = variation?._vrid ? variation?._vrid : "";
         let vTitle = data?.title ?? "";
         let price = e.target.price.value;
         let sellingPrice = e.target.sellingPrice.value;

         for (const i in variant) {
            if (variant.hasOwnProperty(i)) {
               vTitle += " " + variant[i]?.split(",#")[0];
            }
         }

         let model = {
            productID: data?._id && data?._id,
            variationID,
            variations: {
               vTitle: vTitle.trim(),
               images,
               sku,
               variant,
               attrs,
               available,
               price,
               sellingPrice
            }
         }

         const { success, message } = await apiHandler(`/dashboard/seller/products/set-product-variation?formType=${formTypes}&requestFor=product_variations`, "PUT", { request: model });

         if (success) {
            setMessage(message, 'success');
            refetch();
            return;
         }

         setMessage(message, 'danger');

      } catch (error) {
         setMessage(error?.message, 'danger')
      }
   }

   async function uploadImageHandler(e) {
      try {
         e.preventDefault();

         const promises = [];
         let lengthOfImg = e.target.images.files.length;

         for (let i = 0; i < lengthOfImg; i++) {

            const formData = new FormData();
            formData.append('file', e.target.images.files[i]);
            formData.append('upload_preset', 'review_images');

            promises.push(
               fetch('https://api.cloudinary.com/v1_1/duixvo0uu/image/upload', {
                  method: 'POST',
                  body: formData,
               }).then(response => response.json())
                  .catch(error => console.error('Error:', error))
            );
         }

         const responses = await Promise.all(promises);

         let urls = responses?.map(img => img?.secure_url);

         setImages(prevUrls => [...prevUrls, ...urls]);

         return urls ? setMessage("Image uploaded.", "success") :
            setMessage("Failed to upload !", "danger");
      } catch (error) {
         setMessage("Failed to upload !", "danger");
      }
   }


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
               variation?._vrid &&
               <b>Variation ID: {variation?._vrid}</b>
            }
         </small>


         <form encType='multipart/form-data' onSubmit={uploadImageHandler}>
            <div className="py-2">
               <input type="file" accept='image/*' name='images' id="images" multiple onChange={handleImagesPreview} />
               <br />
               {
                  previewImages?.map((imgs, i) => {
                     return (
                        <img width="80" height="80" style={{ objectFit: "contain", margin: "4px" }} key={i} srcSet={imgs} alt="" />
                     )
                  })
               }
            </div>

            <div className="input_group">
               <button className='bt9_primary'>Upload Product Images</button>
            </div>
         </form>

         <form onSubmit={handleVariationOne}>
            {/* Price Stock And Shipping Information */}
            <div className="row my-4">
               <div className="col-lg-12 py-2">
                  <label htmlFor='image'>{required} Image(<small>Product Image</small>)&nbsp;</label>
                  {
                     Array.isArray(images) && images?.map((img, index) => {
                        return (
                           <div className="py-2 d-flex align-items-end justify-content-start" key={index}>
                              <input className="form-control form-control-sm" name="images" id='images' type="text"
                                 placeholder='Image url' value={img} onChange={(e) => imageInputHandler(e, index)}></input>

                              {
                                 images.length !== 1 && <span
                                    style={btnStyle}
                                    onClick={() => removeImageInputFieldHandler(index)}>
                                    <FontAwesomeIcon icon={faMinusSquare} />
                                 </span>
                              } {
                                 images.length - 1 === index && <span style={btnStyle}
                                    onClick={() => setImages([...images, ''])}>
                                    <FontAwesomeIcon icon={faPlusSquare} />
                                 </span>
                              }

                           </div>
                        )
                     })
                  }
                  <div className="py-2" style={{ display: "flex", alignItems: "center" }}>
                     {
                        images && images.map((img, index) => {
                           return (
                              <img width="80" height="80" style={{ objectFit: "contain", margin: "4px" }} key={index} srcSet={img} alt="" />
                           )
                        })
                     }
                  </div>
               </div>

               {/* Price information  */}
               <div className="col-lg-12 my-2">
                  <h6>Price Details</h6>
                  <div className="row">
                     {/* Price */}
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='price'>{required} Price (BDT)</label>
                        <input name='price' id='price' type='number' className="form-control form-control-sm" value={inputPriceDiscount.price || ""} onChange={e => setInputPriceDiscount({ ...inputPriceDiscount, [e.target.name]: e.target.value })} />
                     </div>

                     {/* Selling Price */}
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='sellingPrice'>Selling Price<small>(Discount : {discount || 0}%)</small></label>
                        <input name='sellingPrice' id='sellingPrice' type='number' className="form-control form-control-sm" value={inputPriceDiscount.sellingPrice} onChange={e => setInputPriceDiscount({ ...inputPriceDiscount, [e.target.name]: e.target.value })} />
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

               {
                  cSl(super_category?.variant, variation?.variant, "variant")
               }

               <br />
               <p>Attrs</p>

               {
                  cSl(super_category?.attrs, variation?.attrs, "attrs")
               }

            </div>



            <div className="col-lg-12 my-2 pt-4">

               <button type='submit' className='bt9_edit'>Save Changes</button>
            </div>
         </form>
      </div>
   )
}

export default ProductVariations;