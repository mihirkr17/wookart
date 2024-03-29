import React, { useEffect, useState } from 'react';
import { faCartShopping, faHeart, faHeartCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { apiHandler } from '@/Functions/common';

const ProductImages = ({ product, userInfo, authRefetch, setMessage }) => {
   const [tabImg, setTabImg] = useState("");
   const [zoom, setZoom] = useState({ transform: "translate3d('0px, 0px, 0px')" });
   useEffect(() => setTabImg(product?.images && product?.images[0].src), [product?.images]);

   const handleImgTab = (params) => {
      setTabImg(params);
   }

   function handleImageZoom(e) {

      const { left, top, width, height } = e.target.getBoundingClientRect()
      const x = (e.pageX - left) / width * 100
      const y = (e.pageY - top) / height * 100
      setZoom({ transform: `translate3d(${x}px, ${y}px, 0px)` })
   }

   return (
      <div className="view_product_sidebar">

         <div className="product_image" onMouseOver={handleImageZoom}>
            <img src={tabImg && tabImg} alt="" />
         </div>
         <div className="product_image_tab">
            {
               Array.isArray(product?.images) && product?.images?.map((img, index) => {
                  return (
                     <div key={index} className="image_btn" onMouseOver={() => handleImgTab(img?.src)}>
                        <img src={img?.src} alt="" />
                     </div>
                  )
               })
            }
         </div>
      </div>
   );
};

export default ProductImages;