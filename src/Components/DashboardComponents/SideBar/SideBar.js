

import { faBarsStaggered, faBlind, faCartFlatbed, faDatabase, faIndustry, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useState } from "react";

export default function SideBar({ dbSlug, shrink, setShrink, role }) {

   const [childLink, setChildLink] = useState();

   const setAccordion = (params) => {
      if (childLink !== params) {
         setChildLink(params);
         return;
      }
      setChildLink(false);
   }
   return (
      <div className="db_left_items">
         <div className="pp_iyg">
            <Link className="brand_logo" href="/dashboard">WooKart</Link>
            <span>{role.toUpperCase()}</span>

            {!shrink && <button className='bars' onClick={() => setShrink(true)}>
               <FontAwesomeIcon icon={faBarsStaggered} />
            </button>}
         </div>
         <div className="db_link">

            <ul className='db_left_ul'>

               <li className="link_group">
                  <Link className={!dbSlug ? "active_link" : ""} href='/dashboard'>
                     <FontAwesomeIcon icon={faIndustry} />
                     <span>&nbsp;&nbsp;Overview</span>
                  </Link>
               </li>



               {
                  role === 'SELLER' && <>
                     <li className="link_group">
                        <Link className={dbSlug === "manage-orders" ? "active_link" : ""} href='/dashboard/manage-orders'>
                           <FontAwesomeIcon icon={faCartFlatbed} />
                           <span>&nbsp;&nbsp;Orders</span>
                        </Link>

                     </li>

                     <li className="link_group">

                        <button onClick={() => setAccordion('catalog')}>
                           <FontAwesomeIcon icon={faDatabase} />
                           <span>&nbsp;&nbsp;Catalog</span>
                        </button>

                        <div style={childLink === 'catalog' ? { display: 'block' } : { display: 'none' }}>
                           <Link className={dbSlug === "manage-product" ? "active_link" : ""} href='/dashboard/manage-product'>
                              <span>&nbsp;&nbsp;Products</span>
                           </Link>
                           <Link className={dbSlug === "add-product" ? "active_link" : ""} href={`/dashboard/add-product`}>
                              &nbsp;&nbsp;Add new product
                           </Link>
                        </div>
                     </li></>
               }

               {
                  (role === 'ADMIN' || role === 'OWNER') &&
                  <>
                     <li className='link_group'>
                        <button onClick={() => setAccordion('users')}>
                           <FontAwesomeIcon icon={faUserGroup} />
                           <span>&nbsp;&nbsp;Users</span>
                        </button>

                        <div style={childLink === 'users' ? { display: 'block' } : { display: 'none' }}>
                           <Link className={dbSlug === "manage-users" ? "active_link" : ""} href='/dashboard/manage-users'>
                              <span>&nbsp;&nbsp;Customers</span>
                           </Link>
                           <Link className={dbSlug === "manage-seller" ? "active_link" : ""} href='/dashboard/manage-seller'>
                              <span>&nbsp;&nbsp;Sellers</span>
                           </Link>
                        </div>
                     </li>
                     <li className="link_group">
                        <Link className={dbSlug === "privacy-policy" ? "active_link" : ""} href='/dashboard/privacy-policy'>
                           <FontAwesomeIcon icon={faBlind} />
                           <span>&nbsp;&nbsp;Privacy & Policy</span>
                        </Link>
                     </li>

                     <li className="link_group">
                        <Link className={dbSlug === "check-all-incoming-listing" ? "active_link" : ""} href='/dashboard/check-all-incoming-listing'>
                           <FontAwesomeIcon icon={faBlind} />
                           <span>&nbsp;&nbsp;Listing</span>
                        </Link>
                     </li>
                  </>
               }
            </ul>
         </div>
      </div>
   )
}