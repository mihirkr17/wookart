import React from 'react';
import { useAuthContext } from '@/lib/AuthProvider';
import Link from 'next/link';
import ProductListing from '@/Components/DashboardComponents/AddProduct/Components/ProductListing';
import { useRouter } from 'next/router';

const AddProduct = () => {
   const { userInfo, setMessage } = useAuthContext();
   const { query } = useRouter();
   const { s, np } = query;


   return (
      <div className='section_default'>
         <div className="container">
            {
               np === 'add_product' ? <ProductListing
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

                        {/* <div className="col-lg-12">
                           <ProductListing
                        </div> */}
                     </div>
                  </>
            }
         </div>
      </div>
   );
};

export default AddProduct;