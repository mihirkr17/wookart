
// src/lib/CartProvider.js

import { createContext, useContext, useEffect, useState } from "react"
import { useAuthContext } from "./AuthProvider";
import { deleteAuth } from "@/Functions/common";

const cartContext = createContext();

export default function CartProvider({ children }) {

   const { role } = useAuthContext();

   const [cartLoading, setCartLoading] = useState(false);
   const [cartData, setCartData] = useState({});
   const [cartError, setCartError] = useState("");
   const [cartRef, setCartRef] = useState(false);
   const [cartQuantity, setCartQuantity] = useState(0);

   const cartRefetch = () => setCartRef(e => !e);

   useEffect(() => {

      if (role !== "BUYER" || !role) return;

      const startFetch = setTimeout(() => {
         (async () => {
            try {
               setCartLoading(true);

               const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/cart/cart-context`, {
                  method: "GET",
                  withCredentials: true,
                  credentials: "include"
               });

               const result = await response.json();

               if (response.status === 401) {
                  deleteAuth();
               }

               if (!response.ok) {
                  setCartLoading(false);
               }

               if (result?.statusCode === 200 && result?.success === true) {
                  setCartQuantity((result?.data?.module?.products && result?.data?.module?.products.length) || 0)
                  setCartLoading(false);
                  setCartData(result?.data?.module);
               }
            } catch (error) {
               setCartError(error?.message);
            } finally {
               setCartLoading(false);
            }
         })();
      }, 0);

      return () => clearTimeout(startFetch);
   }, [cartRef, role]);

   return (
      <cartContext.Provider value={{ cartRefetch, cartLoading, cartData, cartQuantity, cartError }}>
         {children}
      </cartContext.Provider>
   )
}

export const useCartContext = () => useContext(cartContext);