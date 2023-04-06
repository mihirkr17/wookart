import React from 'react';
import { useFetch } from '../../../../Hooks/useFetch';

const AdminTemplate = () => {
   const {data} = useFetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/product/dashboard-overview`);

   return (
      <div>
         
      </div>
   );
}; 

export default AdminTemplate;