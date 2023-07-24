import React, { useState, useEffect } from 'react';
import ManageProductHome from './Components/ManageProductHome';

import { useFetch } from '@/Hooks/useFetch';
import Spinner from '@/Components/Shared/Spinner/Spinner';
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
   const { page } = router?.query;
   const queryPage = parseInt(page) || 1;

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


         </div>
      </div>
   );
};

export default ManageProduct;