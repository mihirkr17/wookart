import { useAuthContext } from "@/lib/AuthProvider";
import NavigationBar from "./NavigationBar";


export default function Layout({ children }) {

   const { role } = useAuthContext();

   return (
      <>
         {
            (role === "BUYER" || !role) && <NavigationBar></NavigationBar>
         }
         <main>{children}</main>
      </>
   )
}