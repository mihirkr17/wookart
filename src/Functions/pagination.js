

export function pagination() {
   
   return (<ul className="pagination">
      {
         page >= 2 &&
         <li className="page-item">
            <button className="page-link" onClick={() => buildDynamicURL(category, brand, null, page ? parseInt(page) - 1 : 1)}>Prev</button>
         </li>
      }
      {

         pageBtn?.map((p, i) => {
            return (
               <li className="page-item" key={i}>
                  <button className="page-link" onClick={() => buildDynamicURL(category, brand, null, p)}>{p}</button>
               </li>
            )
         })
      }

      {
         ((page ?? 1) < pageBtn.length) &&
         <li className="page-item">
            <button className="page-link" onClick={() => buildDynamicURL(category, brand, null, page ? parseInt(page) + 1 : 1)}>Next</button>
         </li>
      }
   </ul>)
}