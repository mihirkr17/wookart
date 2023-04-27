import React, { useState, useEffect } from 'react';
import ManageProductHome from './Components/ManageProductHome';

import { useFetch } from '@/Hooks/useFetch';
import Spinner from '@/Components/Shared/Spinner/Spinner';
import ProductTemplateForm from '@/Components/Global/ProductTemplateForm';
import { useAuthContext } from '@/lib/AuthProvider';
import { useRouter } from 'next/router';
import { newCategory } from '@/CustomData/categories';

const ManageProduct = () => {
   const { userInfo, role, setMessage } = useAuthContext();
   const [items, setItems] = useState(1);
   const [url, setUrl] = useState("");

   const { data: manageProducts, loading, refetch } = useFetch(url);

   let counter = userInfo && userInfo?.seller?.storeInfos?.productInFulfilled;

   // All States
   const [searchValue, setSearchValue] = useState("");
   const [filterCategory, setFilterCategory] = useState("");
   const router = useRouter();


   // search query params
   const queryParams = new URLSearchParams(window && window.location.search).get("np");
   const queryStoreName = new URLSearchParams(window && window.location.search).get("store");
   const queryPage = parseInt(new URLSearchParams(window && window.location.search).get("page")) || 1;

   useEffect(() => {
      const setTimeUrl = setTimeout(() => {
         let url = `/dashboard/view-products?page=${queryPage}&items=${8}&category=${filterCategory}&search=${searchValue}`

         setUrl(url);
      }, 200);
      return () => clearTimeout(setTimeUrl);
   }, [queryPage, searchValue, filterCategory]);

   useEffect(() => {
      if (searchValue.length > 0 || filterCategory !== "") {
         setItems(1);
      } else {
         const pages = counter && Math.ceil(counter?.count / 8);
         setItems(pages);
      }
   }, [counter, searchValue, filterCategory]);



   let pageBtn = [];

   for (let i = 1; i <= items; i++) {
      pageBtn.push(i);
   }

   return (
      <div className='section_default'>
         <div className="container">
            {
               queryParams && queryStoreName === userInfo?.store?.name ?
                  <ProductTemplateForm
                     userInfo={userInfo}
                     formTypes={
                        (queryParams === 'update-variation' && 'update-variation') ||
                        (queryParams === "edit_product" && 'update') ||
                        (queryParams === 'add-new-variation' && 'new-variation')
                     }
                     setMessage={setMessage}
                  /> :
                  <ManageProductHome
                     refetch={refetch}
                     setMessage={setMessage}
                     newCategory={newCategory}
                     role={role}
                     counter={counter}
                     loading={loading}
                     manageProducts={manageProducts}
                     setSearchValue={setSearchValue}
                     setFilterCategory={setFilterCategory}
                     // counterRefetch={counterRefetch}
                     queryPage={queryPage}
                     items={items}
                     pageBtn={pageBtn}
                     location={location}
                     Spinner={Spinner}
                     userInfo={userInfo}
                  />
            }

         </div>
      </div>
   );
};

export default ManageProduct;