import AuthProvider from "@/lib/AuthProvider";
import BaseProvider from "@/lib/BaseProvider";
import NavigationBar from "./NavigationBar";

export default function Layout(props) {

   return (
      <BaseProvider>
         <AuthProvider>
            <NavigationBar></NavigationBar>
            <main>{props.children}</main>
         </AuthProvider>

      </BaseProvider>
   )
}