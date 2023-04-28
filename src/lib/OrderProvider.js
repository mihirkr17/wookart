import React, { useEffect, useState, useContext, createContext } from 'react';
import { useAuthContext } from './AuthProvider';
import { CookieParser, deleteAuth } from '@/Functions/common';
import { useRouter } from 'next/router';

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
   const router = useRouter();
   const { filters } = router?.query;
   const { role, userInfo } = useAuthContext();
   const [orderCount, setOrderCount] = useState(0);
   const [placeOrderCount, setPlaceOrderCount] = useState(0);
   const [dispatchOrderCount, setDispatchOrderCount] = useState(0);
   const [orderLoading, setOrderLoading] = useState(false);
   const [orderError, setOrderError] = useState("");
   const [ref, setRef] = useState(false);
   const [orders, setOrders] = useState([]);


   const orderRefetch = () => setRef(e => !e);

   function filterOrders(params, slug) {
      router.push(`/dashboard/${slug}?filters=${params}`);
   }

   useEffect(() => {
      if (role !== "SELLER") {
         return;
      }

      const cookie = CookieParser();

      const fetchData = setTimeout(() => {
         (async () => {
            try {
               setOrderLoading(true);
               const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/dashboard/store/${userInfo?.store?.name}/manage-orders?filters=${filters ?? "placed"}`, {
                  method: "GET",
                  withCredentials: true,
                  credentials: "include",
                  headers: {
                     authorization: `Bearer ${cookie?.log_tok || ""}`
                  }
               });

               const result = await response.json();

               if (response.status === 401) {
                  deleteAuth();
               }

               if (!response.ok) {
                  setOrderLoading(false);
                  return;
               }

               setOrderLoading(false);
               setOrders(result?.data?.orders);
               setOrderCount(result?.data?.totalOrderCount);
               setPlaceOrderCount(result?.data?.placeOrderCount);
               setDispatchOrderCount(result?.data?.dispatchOrderCount)

            } catch (error) {
               setOrderError(error?.message || "");
            } finally {
               setOrderLoading(false);
            }
         })();
      }, 0);

      return () => clearTimeout(fetchData);
   }, [ref, role, userInfo?.store?.name, filters]);

   return (
      <OrderContext.Provider value={{
         orderLoading,
         orderRefetch,
         orderCount,
         placeOrderCount,
         orderError,
         filterOrders,
         dispatchOrderCount,
         orders
      }}>
         {children}
      </OrderContext.Provider>
   );
};

export const useOrder = () => useContext(OrderContext);
export default OrderProvider;