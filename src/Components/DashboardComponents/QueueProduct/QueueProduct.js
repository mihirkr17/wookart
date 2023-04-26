// src/Components/DashboardComponents/QueueProduct/QueueProduct.js

import { useFetch } from "@/Hooks/useFetch";
import { useAuthContext } from "@/lib/AuthProvider"

export default function QueueProduct() {

   const { userInfo } = useAuthContext();

   const { data, refetch, loading } = useFetch(`/dashboard/seller/store/${userInfo?.seller?.storeInfos?.storeName}/in-queue-products`)

   return (
      <div></div>
   )
}