import { CookieParser, deleteAuth } from "@/Functions/common";
import { useEffect, useState } from "react";

export const useFetch = (url) => {
   const [data, setData] = useState();
   const [loading, setLoading] = useState(true);
   const [err, setErr] = useState(null);
   const [ref, setRef] = useState(false);


   useEffect(() => {
      if (typeof window === "undefined") return;
      if (!url || typeof url === 'undefined' || url === null) return;

      const cookie = CookieParser();

      const fetchData = setTimeout(() => {
         (async () => {
            try {

               setLoading(true);

               const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1${url}`, {
                  credentials: 'include',
                  method: "GET",
                  headers: {
                     Authorization: `Berar ${cookie?.appSession ?? ""}`
                  }
               });

               setLoading(false);

               if (response.status === 401) {
                  return deleteAuth();
               }

               const resData = await response.json();

               response.ok && setData(resData);

            } catch (error) {
               setErr(error);
            } finally {
               setLoading(false);
            }
         })();
      }, 0);
      return () => clearTimeout(fetchData);
   }, [url, ref]);


   const refetch = () => setRef(e => !e);

   return { data, loading, err, refetch };
}