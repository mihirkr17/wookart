import React from 'react';

import { useAuthContext } from '@/lib/AuthProvider';
import Link from 'next/link';
import ProductTemplateForm from '@/Components/Global/ProductTemplateForm';

const AddProduct = () => {
   const { userInfo, setMessage } = useAuthContext();
   const queryParams = new URLSearchParams(window && window.location.search).get("np");


   return (
      <div className='section_default'>
         <div className="container">
            {
               queryParams === 'add_product' ? <ProductTemplateForm
                  userInfo={userInfo}
                  setMessage={setMessage}
                  formTypes={"create"}
               /> :
                  <>
                     <h5 className='text-center pb-4'>Add Product</h5>

                     <div className="row">
                        <div className="col-lg-6">
                           <div className="card_default card_description">
                              <Link href={`/dashboard/add-product?np=add_product&s=${userInfo?.store?.name}`}>Add Single Product</Link>
                           </div>
                        </div>
                     </div>
                  </>
            }
         </div>
      </div>
   );
};

export default AddProduct;