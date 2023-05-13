import React, { useContext, createContext } from 'react';
import { useAuthContext } from './AuthProvider';
import { useRouter } from 'next/router';
import { useFetch } from '@/Hooks/useFetch';

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
   const router = useRouter();
   const { filters } = router?.query;
   const { role, userInfo } = useAuthContext();

   const { data, refetch, loading, err } = useFetch(role === "SELLER" ? `/dashboard/store/${userInfo?.store?.name}/manage-orders?filters=${filters ?? "placed"}` : null);

   function filterOrders(params, slug) {
      router.push(`/dashboard/${slug}?filters=${params}`);
   }

   return (
      <OrderContext.Provider value={{
         orderLoading: loading ?? false,
         orderRefetch: refetch ?? (() => { }),
         orderCount: data?.data?.totalOrderCount ?? 0,
         placeOrderCount: data?.data?.placeOrderCount ?? 0,
         orderError: err ?? {},
         filterOrders,
         dispatchOrderCount: data?.data?.dispatchOrderCount ?? 0,
         orders: data?.data?.orders ?? []
      }}>
         {children}
      </OrderContext.Provider>
   );
};

export const useOrder = () => useContext(OrderContext);
export default OrderProvider;