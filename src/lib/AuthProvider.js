// lib/AuthProvider.js

import { createContext, useContext, useEffect, useState } from "react";
import { useBaseContext } from "./BaseProvider";
import jwt_decode from "jwt-decode";
import { authLogout, deleteAuth } from "@/Functions/common";

export const AuthContext = createContext();

export default function AuthProvider(props) {
   const { setMessage, msg } = useBaseContext();
   const [userInfo, setUserInfo] = useState({});
   const [authLoading, setAuthLoading] = useState(true);
   const [authErr, setAuthErr] = useState();
   const [ref, setRef] = useState(false);

   useEffect(() => {
      setAuthLoading(true);

      let client_data = localStorage.getItem("client_data");

      if (client_data && typeof client_data === "string") {
         setAuthLoading(false);
         // decode u_data token by jwt_decode function
         const decoded = jwt_decode(client_data);

         if (decoded) {
            setUserInfo(decoded);
            return;
         }
      }

      setAuthLoading(false);
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

         const { u_data } = await response.json();

         if (response.ok) {

            setAuthLoading(false);

            if (u_data && typeof u_data !== "undefined") {
               localStorage.setItem("client_data", u_data);
            }

            setRef(e => !e);

         } else {
            setAuthLoading(false);

            if (response.status === 401) {
               deleteAuth();
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


   return (
      <AuthContext.Provider value={{ initialLoader, userInfo, role: userInfo?.role && userInfo?.role, setMessage, msg, authRefetch, authLoading, authErr }}>
         {msg}
         {props?.children}
      </AuthContext.Provider>
   )
}


export const useAuthContext = () => useContext(AuthContext)


