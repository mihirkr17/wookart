import React, { createContext } from 'react';
import { useState } from 'react';
import { useContext } from 'react';
import { useFetch } from '@/Hooks/useFetch';
import { useAuthContext } from './AuthProvider';

export const AdminContext = createContext();

const AdminProvider = ({ children }) => {

   const { role, userInfo } = useAuthContext();

   const [pages, setPages] = useState(1);

   const { data, refetch, loading } = useFetch(role === "ADMIN" && `/dashboard/admin/${userInfo?._uuid}/provider?pages=${pages}&items=${3}`);

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