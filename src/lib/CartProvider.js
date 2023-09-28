
// src/lib/CartProvider.js

import { createContext, useContext, useEffect, useState } from "react"
import { CookieParser, deleteAuth } from "@/Functions/common";

const cartContext = createContext();

export default function CartProvider({ children }) {

   const [cartLoading, setCartLoading] = useState(false);
   const [cartData, setCartData] = useState({});
   const [cartError, setCartError] = useState("");
   const [cartRef, setCartRef] = useState(false);
   const [cartQuantity, setCartQuantity] = useState(0);

   const cartRefetch = () => setCartRef(e => !e);

   useEffect(() => {

      const cookie = CookieParser();

      if (!cookie?.appSession) return;

      const startFetch = setTimeout(() => {
         (async () => {
            try {
               setCartLoading(true);

               const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/cart/cart-context`, {
                  method: "GET",
                  withCredentials: true,
                  credentials: "include",
                  headers: {
                     Authorization: `Berar ${cookie?.appSession ? cookie?.appSession : ""}`
                  }
               });

               setCartLoading(false);

               if (response.status === 401) {
                  return deleteAuth();
               }

               const { statusCode, success, data } = await response.json();

               if (statusCode === 200 && success === true) {
                  setCartQuantity((data?.module?.cart_context && data?.module?.cart_context.length) || 0)
                  setCartData(data?.module);
               }
            } catch (error) {
               setCartError(error?.message);
            } finally {
               setCartLoading(false);
            }
         })();
      }, 0);

      return () => clearTimeout(startFetch);
   }, [cartRef]);

   return (
      <cartContext.Provider value={{ cartRefetch, cartLoading, cartData, cartQuantity, cartError }}>
         {children}
      </cartContext.Provider>
   )
}

export const useCartContext = () => useContext(cartContext);