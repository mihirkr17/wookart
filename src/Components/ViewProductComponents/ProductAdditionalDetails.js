import React, { useState } from 'react';
import { Interweave } from 'interweave';
import { textToTitleCase } from '@/Functions/common';


const ProductAdditionalDetails = ({ product }) => {

   const [tab, setTab] = useState("specification");

   const specs = product?.specification;


   function getSpecs(specs = {}) {
      let str = [];
      if (specs) {

         for (const [key, value] of Object.entries(specs)) {
            let pp = <li key={value + Math.round(Math.random() * 999)}><span>{textToTitleCase(key)}</span> <span>{value.split(",#")[0]}</span></li>
            str.push(pp);
         }
      }
      return str;
   }

   return (
      <div className="product-details row">

         <div className="col-12 details_wrapper">
            <div className="tabHeader">
               <div className="tabBtns">
                  <span className={tab === "specification" ? "active" : ""} onClick={() => setTab("specification")}>Specification</span>
                  <span className={tab === "description" ? "active" : ""} onClick={() => setTab("description")}>Description</span>
               </div>
            </div>


            {
               tab === "specification" && <div className='p_details'>
                  <h5>Specification of {product?.title}</h5>
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
            }

            {
               tab === "description" && <div className="p_details">
                  <h5>Description of {product?.title}</h5>
                  <article>
                     <Interweave content={product?.description} />
                  </article>
               </div>
            }
         </div>
      </div>
   );
};

export default ProductAdditionalDetails;