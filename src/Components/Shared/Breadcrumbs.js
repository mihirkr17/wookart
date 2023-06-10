import { textToTitleCase } from '@/Functions/common';
import { faHome, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';
import { Breadcrumb } from 'react-bootstrap';

const Breadcrumbs = ({ path: newPath }) => {
   // const location = useLocation();
   // const path = location.pathname.split("/").filter(x => x);
   // let tyt = location.href.split("=").filter(e => e);
   // tyt.shift();
   let path = newPath && newPath.filter(x => x);
   return (
      <Breadcrumb className="py-2">
         <Link href={"/"}>
            <FontAwesomeIcon style={{ fontSize: "13px", color: "var(--color-dark)" }} icon={faHome} />
         </Link>
         <span>&nbsp;<FontAwesomeIcon style={{ fontSize: "10px", color: "black" }} icon={faChevronRight} />&nbsp;</span>
         {
            path && path.map((e, i, arr) => {

               const routeTo = `${path.slice(0, i + 1).join("/")}`;
               let lastOne = arr.length - 1 === i;
               return (
                  <React.Fragment key={i}>
                     <Link href={"/category/" + routeTo} style={lastOne ? { pointerEvents: "none", color: "gray" } : { pointerEvents: "auto" }}>
                        {textToTitleCase(e.replace(/[-]/g, " "))}
                     </Link>
                     {i < path.length - 1 && <span>&nbsp;<FontAwesomeIcon style={{ fontSize: "10px", color: "black" }} icon={faChevronRight} />&nbsp;</span>}
                  </React.Fragment>
               )
            })
         }
      </Breadcrumb>
   );
};

export default Breadcrumbs;

// const Breadcrumbs = () => {
//    const location = useLocation();
//    const path = location.pathname.split("/").filter(x => x);
//    // let tyt = location.href.split("=").filter(e => e);
//    // tyt.shift();
//    return (
//       <Breadcrumb>
//          <Link to={"/"}> <FontAwesomeIcon icon={faHome} /> Home</Link>
//          <span>&nbsp;/&nbsp;</span>
//          {
//             path && path.map((e, i, arr) => {
//                const routeTo = `${path.slice(0, i + 1).join("/")}`;
//                let lastOne = arr.length - 1 === i;
//                return (
//                   <React.Fragment key={i}>
//                      <Link to={"/" + routeTo} style={lastOne ? { pointerEvents: "none", color: "gray" } : { pointerEvents: "auto" }}>
//                         {e.replace("%20", " ")}
//                      </Link>
//                      {i < path.length - 1 && <span>&nbsp;/&nbsp;</span>}
//                   </React.Fragment>
//                )
//             })
//          }
//       </Breadcrumb>
//    );
// };

// export default Breadcrumbs;