import { useRouter } from "next/router";


export default function Pagination2({ dynamicPageNumber, page, setPage }) {

   // page button initialization here;
   let pageBtn = [];

   for (let i = 1; i <= dynamicPageNumber; i++) {
      pageBtn.push(i);
   }

   return (<ul className="pagination pagination-sm">
      {
         page >= 2 &&
         <li className="page-item">
            <button className="page-link" onClick={() => setPage(page - 1)}>Prev</button>
         </li>
      }
      {

         pageBtn?.map((p, i) => {
            return (
               <li className="page-item" key={i}>
                  <button className="page-link" style={page === p ? {color: "red"} : {color: "blue"}} onClick={() => setPage(p)}>{p}</button>
               </li>
            )
         })
      }

      {
         ((page ?? 1) < pageBtn.length) &&
         <li className="page-item">
            <button className="page-link" onClick={() => setPage(page ? page + 1 : 2)}>Next</button>
         </li>
      }
   </ul>)
} 