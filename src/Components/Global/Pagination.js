import { useRouter } from "next/router";


export default function Pagination({ dynamicPageNumber, buildDynamicURL }) {

   const { query } = useRouter();

   const { page } = query;

   // page button initialization here;
   let pageBtn = [];

   for (let i = 1; i <= dynamicPageNumber; i++) {
      pageBtn.push(i);
   }

   return (<ul className="pagination pagination-sm">
      {
         page >= 2 &&
         <li className="page-item">
            <button className="page-link" onClick={() => buildDynamicURL(page ? parseInt(page) - 1 : 1)}>Prev</button>
         </li>
      }
      {

         pageBtn?.map((p, i) => {
            return (
               <li className="page-item" key={i}>
                  <button className="page-link" onClick={() => buildDynamicURL(p)}>{p}</button>
               </li>
            )
         })
      }

      {
         ((page ?? 1) < pageBtn.length) &&
         <li className="page-item">
            <button className="page-link" onClick={() => buildDynamicURL(page ? parseInt(page) + 1 : 2)}>Next</button>
         </li>
      }
   </ul>)
} 