import React from 'react';
import { useFetch } from '../../../../Hooks/useFetch';

const AdminTemplate = () => {
   const {data} = useFetch(`/product/dashboard-overview`);

   return (
      <div>
         
      </div>
   );
}; 

export default AdminTemplate;