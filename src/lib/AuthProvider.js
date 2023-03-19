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

      const { client_data } = CookieParser(document.cookie);

      setAuthLoading(true);

      if (client_data && typeof client_data === "string") {

         // decode u_data token by jwt_decode function
         const decoded = jwt_decode(client_data);

         if (decoded) {
            setAuthLoading(false);
            setUserInfo(decoded);
            return;
         }

         setAuthLoading(false);
      }
   }, [ref]);

   const initialLoader = () => setRef(e => !e);

   const authRefetch = async () => {
      try {
         setAuthLoading(true);

         const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/user/fau`, {
            withCredentials: true,
            credentials: 'include',
            method: "GET"
         });

         const { maxAgeOfCookie, u_data } = await response.json();

         if (response.ok) {

            console.log(maxAgeOfCookie);

            setAuthLoading(false);

            if (u_data && typeof u_data !== "undefined") {
               let now = new Date();

               const expireTime = new Date(now.getTime() + 16 * 60 * 60 * 1000);

               document.cookie = `client_data=${u_data}; max-age= ${maxAgeOfCookie || ((expireTime.getTime() - now.getTime()) / 1000)}; path=/`;
            }

            setRef(e => !e);

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
      <AuthContext.Provider value={{ initialLoader, userInfo, role: userInfo?.role && userInfo?.role, setMessage, msg, authRefetch, authLoading, authErr, cartQtyUpdater }}>
         {msg}
         {props?.children}
      </AuthContext.Provider>
   )
}


export const useAuthContext = () => useContext(AuthContext)


