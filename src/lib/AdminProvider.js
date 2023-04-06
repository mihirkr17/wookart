import React, { createContext } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { useFetch } from '@/Hooks/useFetch';
import { useAuthContext } from './AuthProvider';

export const AdminContext = createContext();

const AdminProvider = ({ children }) => {

   const { role, userInfo } = useAuthContext();

   const [pages, setPages] = useState(1);

   const { data, refetch, loading } = useFetch(role === "ADMIN" && `${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/dashboard/admin/${userInfo?._UUID}/provider?pages=${pages}&items=${3}`);

   const triggers = async (params) => {
      setPages(params);
   }

   return (
      <AdminContext.Provider value={{ data, refetch, loading, triggers }}>
         {children}
      </AdminContext.Provider>
   )
};

export const useAdminContext = () => useContext(AdminContext);

export default AdminProvider;