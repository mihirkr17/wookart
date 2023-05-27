import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export function useUrlQuery() {
   const { query, push } = useRouter();
   const { filters, slug } = query;
   const [urlQuery, setUrlQuery] = useState([]);

   const regex = /[<>{}|\\^%]/g;


   useEffect(() => {
      setUrlQuery(filters?.toString()?.split(",")?.filter(e => e)?.filter((f, i, fa) => fa.indexOf(f) === i) ?? []);
   }, [filters]);

   // building dynamic url here 
   function buildDynamicURL(p, ...rest) {

      const params = new URLSearchParams();

      rest = Array.isArray(urlQuery) ? urlQuery.concat(rest) : [...urlQuery, rest];

      rest = Array.isArray(rest) && rest?.filter(e => e)?.filter((e, i, fa) => fa.indexOf(e) === i);

      if (p) {
         params.append("page", p)
      }

      if (rest && rest.length >= 1) {
         params.append("filters", rest.join("--"));
      }

      const queryString = params.toString().replace(regex, "");


      push(`/store/${slug}${queryString ? `?${queryString}` : ''}`);
      return;
   }


   // removing query from url
   function removeUrlQuery(page, targetValue) {

      const params = new URLSearchParams();

      if (!page) {
         params.delete("page");
      }

      let temp = urlQuery?.toString()?.split("--")?.filter(f => f !== targetValue)?.filter(e => e).join("--");

      if (page) {
         params.append("page", page);
      }

      if (temp) {
         params.append("filters", temp);
      }


      if (!targetValue || typeof targetValue === "undefined") {
         params.delete("filters");
         setUrlQuery([]);
      }


      const queryString = params.toString().replace(regex, "");


      push(`/store/${slug}${queryString ? `?${queryString}` : ''}`);

      return setUrlQuery(temp);
   }



   return { buildDynamicURL, removeUrlQuery, urlQuery }
}