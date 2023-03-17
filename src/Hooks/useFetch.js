import { useEffect, useState } from "react";

export const useFetch = (url, authorization = "") => {
   const [data, setData] = useState();
   const [loading, setLoading] = useState(true);
   const [err, setErr] = useState(null);
   const [ref, setRef] = useState(false);

   useEffect(() => {
      const fetchData = setTimeout(() => {
         (async () => {
            try {
               if (url && typeof url !== 'undefined') {
                  setLoading(true);

                  const response = await fetch(url, {
                     withCredentials: true,
                     credentials: 'include',
                     method: "GET",
                     headers: {
                        authorization
                     }
                  });

                  const resData = await response.json();

                  if (response.ok) {
                     setLoading(false);
                     setData(resData);
                  } else {
                     setLoading(false);
                  }
               } else {
                  setLoading(false);
               }

            } catch (error) {
               setErr(error);
            } finally {
               setLoading(false);
            }
         })();
      }, 0);
      return () => clearTimeout(fetchData);
   }, [url, authorization, ref]);


   const refetch = () => setRef(e => !e);

   return { data, loading, err, refetch };
}