import Spinner from "@/Components/Shared/Spinner/Spinner";
import { useAuthContext } from "@/lib/AuthProvider";
import { useRouter } from "next/router";

export default function RequiredAuth({ children }) {
   const { role, authLoading } = useAuthContext();
   const router = useRouter();

   if (typeof window === "undefined") return;

   if (authLoading) return;

   if (typeof role !== "undefined" && role === "BUYER") {
      return children;
   }

   router.push("/login");
}