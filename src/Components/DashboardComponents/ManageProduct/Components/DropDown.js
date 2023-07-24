import Link from 'next/link';
import React, { useState } from 'react';

const DropDown = ({ mProduct, location, productControlHandler, openDropDown, setUpdateProductForm, setOpenProductVariationModal, router }) => {

   return (

      <ul className="dropdown-menu" style={openDropDown?._lid === mProduct?._lid ? { display: 'block', right: 0 } : { display: 'none' }}>
         <li>
            <button className="dropdown-item" onClick={() => setUpdateProductForm(mProduct && mProduct)}>
               Edit Product
            </button>
         </li>
         <li>
            <button className="dropdown-item" onClick={() => setOpenProductVariationModal(mProduct && {
               _id: mProduct?._id,
               formType: "new-variation",
               title: mProduct?.title,
               categories: mProduct?.categories,
               listingID: mProduct?._lid,
            })}>
               Add a new variation
            </button>
         </li>
         <li>
            <Link href={`/`} className='dropdown-item'>
               Attributes
            </Link>
         </li>
         <li>
            {
               mProduct?.save_as === 'fulfilled' &&
               <button className='dropdown-item text-danger'
                  onClick={() => productControlHandler("draft", "save_as", mProduct)}
               >
                  Move To Draft
               </button>
            }
         </li>
      </ul>
   );
};

export default DropDown;