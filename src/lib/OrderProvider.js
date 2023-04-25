import React, { useEffect, useState, useContext, createContext } from 'react';
import { useAuthContext } from './AuthProvider';
import { CookieParser } from '@/Functions/common';

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
   const { role, userInfo } = useAuthContext();
   const [order, setOrder] = useState([]);
   const [orderCount, setOrderCount] = useState(0);
   const [newOrderCount, setNewOrderCount] = useState(0);
   const [orderLoading, setOrderLoading] = useState(false);
   const [orderError, setOrderError] = useState("");
   const [ref, setRef] = useState(false);
   const viewMode = new URLSearchParams(window && window.location.search).get("view");
   const [view, setView] = useState(viewMode || "single" || "");
   const [orders, setOrders] = useState([]);

   const orderRefetch = () => setRef(e => !e);

   const viewController = (e) => setView(e);

   useEffect(() => {
      if (role !== "SELLER") {
         return;
      }

      const { log_tok } = CookieParser();

      const fetchData = setTimeout(() => {
         (async () => {
            try {
               setOrderLoading(true);
               const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/dashboard/store/${userInfo?.seller?.storeInfos?.storeName}/manage-orders?view=${view}`, {
                  method: "GET",
                  withCredentials: true,
                  credentials: "include",
                  headers: {
                     authorization: `Bearer ${log_tok || ""}`
                  }
               });

               const result = await response.json();

               if (response.status === 401) {
                  localStorage.removeItem("client_data");
               }

               if (!response.ok) {
                  setOrderLoading(false);
               }

               if (result?.success === true && result?.statusCode === 200) {
                  setOrderLoading(false);
                  setOrder(result?.data?.module);
                  setOrders(result?.data?.orders);
                  setOrderCount(result?.data?.totalOrderCount);
                  setNewOrderCount(result?.data?.newOrderCount);
               }

            } catch (error) {
               setOrderError(error?.message || "");
            } finally {
               setOrderLoading(false);
            }
         })();
      }, 0);

      return () => clearTimeout(fetchData);
   }, [ref, role, userInfo?.seller?.storeInfos?.storeName, view]);

   return (
      <OrderContext.Provider value={{
         order,
         orderLoading,
         orderRefetch,
         orderCount,
         newOrderCount,
         orderError,
         viewController,
         orders
      }}>
         {children}
      </OrderContext.Provider>
   );
};

export const useOrder = () => useContext(OrderContext);
export default OrderProvider;