import { useAuthContext } from "@/lib/AuthProvider";
import NavigationBar from "./NavigationBar";


export default function Layout({ children }) {

   const { role } = useAuthContext();

   return (
      <>
         {
            (role === "CUSTOMER" || !role) && <NavigationBar></NavigationBar>
         }
         <main>{children}</main>
      </>
   )
}