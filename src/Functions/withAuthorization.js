import AdminProvider from "@/lib/AdminProvider";
import { useAuthContext } from "@/lib/AuthProvider";
import OrderProvider from "@/lib/OrderProvider";
import { useRouter } from "next/router"
import { useEffect } from "react";

export function withAuthorization(Component, allowedRole) {
   return function WithAuth(props) {
      const router = useRouter();

      const { role, authLoading } = useAuthContext();

      useEffect(() => {
         if (authLoading) {
            return;
         } else if (!role) {
            router.push("/login");
         } else if (!allowedRole.includes(role)) {
            router.push("/");
         }
      }, [role, router, authLoading]);

      return allowedRole.includes(role) ? <OrderProvider>
         <AdminProvider>
            <Component {...props} />
         </AdminProvider>
      </OrderProvider> : null;
   }
}