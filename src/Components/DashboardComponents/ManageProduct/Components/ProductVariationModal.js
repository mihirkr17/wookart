import React from 'react';


import { newCategory } from '@/CustomData/categories';
import ModalWrapper from '@/Components/Global/ModalWrapper';
import ProductVariations from '@/Components/Global/ProductVariations';

const ProductVariationModal = ({ data, closeModal, userInfo, refetch }) => {

   var sub_category, post_category, super_category;

   const required = <span style={{ color: "red" }}>*</span>;

   if (data) {
      let fc = data?.categories && data?.categories[0];
      let sc = data?.categories && data?.categories[1];
      let tc = data?.categories && data?.categories[2];

      sub_category = newCategory && newCategory.find(e => e.category === fc);
      post_category = sub_category?.sub_category_items && sub_category?.sub_category_items.find(e => e.name === sc);
      super_category = post_category?.post_category_items && post_category?.post_category_items.find(e => e.name === tc);
   }


   return (
      <ModalWrapper closeModal={closeModal}>
         <ProductVariations
            formTypes={data?.formType && data?.formType}
            userInfo={userInfo}
            super_category={super_category}
            required={required}
            refetch={refetch}
            data={data}
         />
      </ModalWrapper>
   );
};

export default ProductVariationModal;