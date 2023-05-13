// lib/AuthProvider.js

import { createContext, useContext, useEffect, useState } from "react";
import { useBaseContext } from "./BaseProvider";
import jwt_decode from "jwt-decode";
import { CookieParser, deleteAuth } from "@/Functions/common";

export const AuthContext = createContext();

export default function AuthProvider(props) {
   const { setMessage, msg } = useBaseContext();
   const [userInfo, setUserInfo] = useState({});
   const [authLoading, setAuthLoading] = useState(true);
   const [authErr, setAuthErr] = useState();
   const [ref, setRef] = useState(false);

   useEffect(() => {
      setAuthLoading(true);

      let encodedToken = localStorage.getItem("client_data");

      if (encodedToken && typeof encodedToken === "string") {

         try {
            // decode u_data token by jwt_decode function
            const decoded = jwt_decode(encodedToken);

            decoded && setUserInfo(decoded);

         } catch (error) {
            console.error("Error decoding JWT token:", error);
         }
      }

      setAuthLoading(false);

   }, [ref]);

   const initialLoader = () => setRef(e => !e);

   const authRefetch = async () => {
      try {
         setAuthLoading(true);

         const cookie = CookieParser();

         const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/user/fau`, {
            credentials: 'include',
            method: "GET",
            headers: {
               Authorization: `Bearer ${cookie?.appSession ? cookie?.appSession : ""}`,
               Accept: "application/json",
            }
         });

         setAuthLoading(false);

         if (response.status === 401) {
            deleteAuth();
         }

         const { u_data } = await response.json();

         if (response.ok) {

            if (u_data && typeof u_data !== "undefined") {
               localStorage.setItem("client_data", u_data);
            }

            setRef(e => !e);
         }
      } catch (error) {
         setAuthErr(error?.message);
      } finally {
         setAuthLoading(false);
      }
   };


   return (
      <AuthContext.Provider value={{
         initialLoader,
         userInfo,
         role: userInfo?.role && userInfo?.role,
         setMessage,
         msg,
         authRefetch,
         authLoading,
         authErr
      }}>
         {msg}
         {props?.children}
      </AuthContext.Provider>
   )
}


export const useAuthContext = () => useContext(AuthContext)


