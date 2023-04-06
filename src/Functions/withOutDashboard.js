import { useAuthContext } from "@/lib/AuthProvider";
import { useRouter } from "next/router";
import { useEffect } from "react"

export function withOutDashboard(Components, userRoles) {
   return function FirstWrapper(props) {

      const router = useRouter();
      const { authLoading, role } = useAuthContext();

      useEffect(() => {
         if (authLoading) {
            return;
         }

         if (role === "SELLER" || role === "ADMIN") {
            router.push("/dashboard");
         }
      }, [authLoading, role, router]);

      return <Components {...props}></Components>;
   }
}