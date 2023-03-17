// lib/AuthProvider.js

import { createContext, useContext, useEffect, useState } from "react";
import { useBaseContext } from "./BaseProvider";
import jwt_decode from "jwt-decode";
import { authLogout, CookieParser } from "@/Functions/common";

export const AuthContext = createContext();

export default function AuthProvider(props) {
   const { setMessage, msg } = useBaseContext();
   const [userInfo, setUserInfo] = useState({});
   const [authLoading, setAuthLoading] = useState(true);
   const [authErr, setAuthErr] = useState();
   const [ref, setRef] = useState(false);

   useEffect(() => {
      const userData2 = new URLSearchParams(document.cookie.replaceAll("; ", "&")).get('u_data') || "";



      const { u_data } = CookieParser(document.cookie);

      console.log(u_data);

      // getting u_data token from localStorage
      const userData = localStorage.getItem("u_data");

      setAuthLoading(true);

      if (userData && typeof userData === "string") {

         // decode u_data token by jwt_decode function
         const decoded = jwt_decode(userData);

         if (decoded) {
            setAuthLoading(false);
            setUserInfo(decoded);
            return;
         }

         setAuthLoading(false);
      }
   }, [ref]);

   const authRefetch = async () => {
      try {
         setAuthLoading(true);

         const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/user/fau`, {
            withCredentials: true,
            credentials: 'include',
            method: "GET"
         });

         const data = await response.json();

         if (response.ok) {

            setRef(e => !e);

            setAuthLoading(false);

            localStorage.setItem("u_data", data?.u_data);

         } else {
            setAuthLoading(false);

            if (response.status === 401) {
               await authLogout();
               return;
            }
         }

      } catch (error) {
         setAuthErr(error?.message);
      } finally {
         setAuthLoading(false);
      }
   };

   // cart quantity updater for navigation bar
   function cartQtyUpdater(params) {

      if (userInfo?.buyer?.shoppingCartItems) {
         let buyer = userInfo?.buyer;

         let newQty = (buyer["shoppingCartItems"] = params);

         setUserInfo({ ...userInfo, newQty })
      }
   }


   return (
      <AuthContext.Provider value={{ userInfo, role: userInfo?.role && userInfo?.role, setMessage, msg, authRefetch, authLoading, authErr, cartQtyUpdater }}>
         {msg}
         {props?.children}
      </AuthContext.Provider>
   )
}


export const useAuthContext = () => useContext(AuthContext)


