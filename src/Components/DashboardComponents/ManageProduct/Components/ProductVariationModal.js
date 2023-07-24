import React from 'react';
import ModalWrapper from '@/Components/Global/ModalWrapper';
import ProductVariations from './ProductVariations';


const ProductVariationModal = ({ data, closeModal, userInfo, refetch, setVariations }) => {


   return (
      <ModalWrapper closeModal={closeModal}>
         <ProductVariations
            formTypes={data?.formType && data?.formType}
            userInfo={userInfo}
            refetch={refetch}
            data={data}
            setVariations={setVariations}
            closeModal={closeModal}
         />
      </ModalWrapper>
   );
};

export default ProductVariationModal;