import Spinner from "@/Components/Shared/Spinner/Spinner";
import { useAuthContext } from "@/lib/AuthProvider";
import { useRouter } from "next/router";

export default function RequiredAuth({ children }) {
   const { role, authLoading } = useAuthContext();
   const router = useRouter();

   if (authLoading) {
      return <Spinner />;
   }

   else if (!role || role !== "BUYER") {
      router.push("/login");
   }

   return children;
}