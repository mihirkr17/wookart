import ModalWrapper from '@/Components/Global/ModalWrapper';
import { Interweave } from 'interweave';
import React, { useState } from 'react';



const ProductDetailsModal = ({ data: product, closeModal }) => {
   const [tab, setTab] = useState("description");

   if (!product) {
      return
   }

   function getAttrs(obj = {}) {

      let str = [];

      for (const [key, value] of Object.entries(obj)) {
         str.push(
            <div className="col-lg-6"><small>{key.replace("_", " ").toUpperCase()} : {value}</small></div>
         )
      }

      return str;
   }
   return (
      <ModalWrapper closeModal={closeModal}>
         <div className="row mb-5">
            <div className="col-lg-5 pb-3">

            </div>

            <div className="col-lg-7 pb-3 product_description">
               <article>

                  <h5 className="product_title py-2">
                     <span className='textMute'>{product?.brand}</span> <br />
                     {product?.title}
                  </h5>

                  <div className="product_rating_model">
                     <small>{product?.ratingAverage || 0} out of 5</small>
                  </div>


                  <br />

                  <small className='textMute'>Seller : {product?.sellerData?.storeName}</small><br />
               </article>

            </div>

            <div className="col-12 py-3 mt-3 card_default">
               <div className="ff_kl3">
                  <button className={`ddl_g_btn ${tab === "description" ? "active" : ""}`} onClick={() => setTab("description")}>Product Description</button>
                  <button className={`ddl_g_btn ${tab === "spec" ? "active" : ""}`} onClick={() => setTab("spec")}>Specification</button>

               </div>
               <div className="dp_fgk">
                  {
                     tab === "description" && <Interweave className='pt-4 product_spec' content={product?.description} />
                  }
                  {
                     tab === "spec" && <div className="row">
                        {getAttrs(product?.specification)}
                     </div>
                  }


               </div>
            </div>
         </div>
      </ModalWrapper>
   );
};

export default ProductDetailsModal;