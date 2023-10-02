import { useAuthContext } from "@/lib/AuthProvider";
import { useRouter } from "next/router";


export default function ProtectedHOC(Components) {
   return function HOC(props) {
      const router = useRouter();
      const { authLoading, role } = useAuthContext();

      if (authLoading) {
         return;
      }

      if (role !== "BUYER") {
         router.push(`/login?redirect_to=${encodeURIComponent(router?.asPath)}`);
      }


      return <Components {...props}></Components>;
   }
}