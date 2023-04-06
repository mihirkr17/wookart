import React from 'react';
import ProductListing from "./ProductListing";
import ProductVariations from './ProductVariations';
import { useState } from 'react';

import { newCategory } from '@/CustomData/categories';
import { useRouter } from 'next/router';
import { useFetch } from '@/Hooks/useFetch';


const ProductTemplateForm = ({ formTypes, userInfo, setMessage }) => {
   const [toggle, setToggle] = useState(null);

   const router = useRouter();

   const queryPID = new URLSearchParams(window && window.location.search).get("pid");
   const queryVID = new URLSearchParams(window && window.location.search).get("vId");
   const uri = formTypes !== 'create' && `${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/dashboard/get-one-product-in-seller-dsb?pid=${queryPID}&storeName=${userInfo?.seller?.storeInfos?.storeName}&vId=${queryVID || ""}`
   const { data, refetch } = useFetch(uri);


   var sub_category, post_category, super_category;

   const required = <span style={{ color: "red" }}>*</span>;

   // this is global variable of categories states
   if (data) {
      let fc = data?.categories && data?.categories[0];
      let sc = data?.categories && data?.categories[1];
      let tc = data?.categories && data?.categories[2];

      sub_category = newCategory && newCategory.find(e => e.category === fc);
      post_category = sub_category?.sub_category_items && sub_category?.sub_category_items.find(e => e.name === sc);
      super_category = post_category?.post_category_items && post_category?.post_category_items.find(e => e.name === tc);
   }

   const handleToggle = (params) => {
      if (params !== toggle) {
         setToggle(params);
         return;
      }
      setToggle(null);
   }

   const goThere = () => {
      router.push(from, { replace: true });
   }

   function getAttrs(obj = {}) {

      let str = [];

      for (const [key, value] of Object.entries(obj)) {
         str.push(
            <div className="col-lg-6"><small>{key.replace("_", " ").toUpperCase()} : {value}</small></div>
         )
      }

      return str.slice(0, 6);
   }

   return (
      <>
         {
            formTypes !== 'create' && <button className='btn' onClick={() => goThere()}>
               Back
            </button>
         }

         <div className="card_default card_description">
            <div className="d-flex align-items-start justify-content-between pb-3">

               {
                  formTypes !== 'update-variation' && formTypes !== 'create' &&
                  <>
                     <h5>Product Intro</h5>

                     <button className='bt9_edit' onClick={() => handleToggle('productIntro')}>
                        {toggle === 'productIntro' ? 'Cancel' : 'Edit'}
                     </button>
                  </>
               }
            </div>

            {toggle === 'productIntro' || formTypes === 'create' ?
               <>
                  {
                     formTypes === 'create' && <button onClick={() => handleToggle(formTypes === 'create' && 'productIntro')} className='bt9_cancel' style={{
                        position: "absolute",
                        top: "0",
                        right: "0"
                     }}>
                        Close
                     </button>
                  }

                  <ProductListing userInfo={userInfo} super_category={super_category} required={required} setMessage={setMessage} formTypes={formTypes} data={data} refetch={refetch} />
               </>
               : <div className='row py-2'>
                  <div className="col-lg-6"><small>CATEGORIES : {data?.categories && data?.categories.join("-->")}</small></div>
                  <div className="col-lg-6"><small>SELLER : {data?.sellerData?.sellerName}</small></div>
                  <div className="col-lg-6"><small>Store Name : {data?.sellerData?.storeName}</small></div>
                  <div className="col-lg-6"><small>BRAND : {data?.brand}</small></div>
                  <div className="col-lg-6"><small>SAVE AS : {data?.save_as}</small></div>
                  <div className="col-lg-6"><small>Product Title : {data?.title}</small></div>

                  {
                     data?.specification ? getAttrs(data?.specification) : <p>No attributes present here</p>
                  }
                  <div className="col-lg-6"><small>Meta Information: {data?.bodyInfo?.metaDescription.slice(0, 20) + "..."}</small></div>

                  {
                     data?.bodyInfo?.searchKeywords &&
                     <div className="col-lg-6"><small>Search Keywords : {data?.bodyInfo?.searchKeywords.join(", ")}</small></div>
                  }
                  {
                     data?.bodyInfo?.keyFeatures &&
                     <div className="col-lg-6"><small>Key Features : {data?.bodyInfo?.keyFeatures.join(", ")}</small></div>
                  }
               </div>
            }
         </div>
      </>
   );
};

export default ProductTemplateForm;