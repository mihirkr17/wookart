import { apiHandler } from '@/Functions/common';
import { useBaseContext } from '@/lib/BaseProvider';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useState } from 'react';


const ProductVariations = ({ required, data, formTypes, super_category, userInfo, refetch }) => {

   const variation = data?.variations && data?.variations;

   const { setMessage } = useBaseContext();

   const [variant, setVariant] = useState(variation?.variant || {});

   const [attrs, setAttrs] = useState(variation?.attrs || {});

   const [highlight, setHighlight] = useState((variation?.highlights && variation?.highlights) || [""]);


   const btnStyle = {
      cursor: "pointer",
      display: "block",
      padding: "0.2rem",
      marginLeft: "0.5rem"
   }

   // handle key features
   const handleHighlightInput = (e, index) => {
      const { value } = e.target;

      let list = [...highlight];
      list[index] = value;

      setHighlight(list);
   }

   const removeHighlightInputHandler = (index) => {
      let list = [...highlight]
      list.splice(index, 1);

      setHighlight(list);
   }


   async function handleVariationOne(e) {
      try {
         e.preventDefault();
         // setActionLoading(true);

         let sku = e.target.sku.value;
         let status = e.target.status.value;
         let available = e.target.available.value;
         let priceModifier = e.target.priceModifier.value;
         let variationID = variation?._vrid ? variation?._vrid : "";
         let vTitle = data?.title && data?.title;

         vTitle = vTitle + (variant?.ram ? (" " + (variant?.ram)) : "") +
            (variant?.rom ? (" " + (variant?.rom)) : "") +
            (variant?.color ? (" " + variant?.color.split(",")[0]) : "");
         vTitle = vTitle.trim();

         let model = {
            pageURL: '/dashboard/manage-product?np=update-variation&store=' + userInfo?.seller?.storeInfos?.storeName + "&pid=" + data?._id && data?._id,
            productID: data?._id && data?._id,
            variationID,
            variations: {
               vTitle,
               sku,
               variant,
               attrs,
               status,
               available,
               highlight,
               priceModifier
            }
         }

         const response = await apiHandler(`/dashboard/seller/products/set-product-variation?formType=${formTypes}&vId=${variation?._vrid || ""}&requestFor=product_variations`, "PUT", { request: model });

         const { message } = await response.json();

         if (response.ok) {
            setMessage(message, 'success');
            refetch();
            return;
         }

         setMessage(message, 'danger');


      } catch (error) {
         setMessage(error?.message, 'danger')
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
                     Object.keys(existObj).includes(key) && <option value={existObj[key]}>{existObj[key]}</option>
                  }

                  <option value="">Select {key.replace("_", " ")}</option>
                  {
                     value && value.map((val, i) => {
                        return (<option key={i.toString() + key + params} value={val}>{val}</option>)
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
         <form onSubmit={handleVariationOne}>
            {/* Price Stock And Shipping Information */}
            <div className="row my-4">

               {/* SKU */}
               <div className='col-lg-3 mb-3'>
                  <label htmlFor='sku'>{required} SKU <small>(Stock Keeping Unit)</small></label>
                  <input className='form-control form-control-sm' name='sku' id='sku' type='text' defaultValue={variation?.sku || ""} />
               </div>

               <div className="col-lg-12 my-2">
                  <b>Status Details</b>
                  <div className="row">
                     <div className="col-lg-3 mb-3">
                        <label htmlFor="status">{required} Product Status</label>
                        <select className='form-select form-select-sm' name="status" id="status">
                           <option value={variation?.status || ""}>{variation?.status || "Select Status"}</option>
                           <option value="active">Active</option>
                           <option value="inactive">Inactive</option>
                        </select>
                     </div>
                  </div>
               </div>

               {/* Price Details */}
               <div className="col-lg-12 my-2">
                  <b>Stock Details</b>
                  <div className="row">

                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='priceModifier'>{required} Price Modifier</label>
                        <input className='form-control form-control-sm' name='priceModifier' id='priceModifier' type='number'
                           defaultValue={variation?.priceModifier} />
                     </div>

                     {/* Stock */}
                     <div className='col-lg-3 mb-3'>
                        <label htmlFor='available'>{required} Stock</label>
                        <input className='form-control form-control-sm' name='available' id='available' type='number'
                           defaultValue={variation?.available} />
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

            <div className="col-lg-12 my-2">
               <label htmlFor='highlight'>{required} Product Highlight&nbsp;</label>
               {
                  highlight && highlight.map((keys, i) => {
                     return (
                        <div className='py-2 d-flex align-items-end justify-content-start' key={i}>
                           <input
                              className='form-control form-control-sm'
                              name="highlight" id='highlight'
                              value={keys} type="text"
                              placeholder="Key Features"
                              onChange={(e) => handleHighlightInput(e, i)}
                           />

                           {
                              highlight.length !== 1 && <span style={btnStyle}
                                 onClick={() => removeHighlightInputHandler(i)}>
                                 <FontAwesomeIcon icon={faMinusSquare} />
                              </span>
                           }
                           {
                              highlight.length - 1 === i && <span style={btnStyle}
                                 onClick={() => setHighlight([...highlight, ''])}>
                                 <FontAwesomeIcon icon={faPlusSquare} />
                              </span>
                           }
                        </div>
                     )
                  })
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