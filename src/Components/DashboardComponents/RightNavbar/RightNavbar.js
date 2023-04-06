import { authLogout } from '@/Functions/common';
import useMenu from '@/Hooks/useMenu';
import { faBarsStaggered } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React from 'react';

const RightNavbar = ({shrink, userInfo, setShrink, dbSlug}) => {

   const {menuRef, openMenu, setOpenMenu} = useMenu()
   return (
      <div className="db_right_nav">
         {shrink && <button className='bars bars_alt' onClick={() => setShrink(false)}>
            <FontAwesomeIcon icon={faBarsStaggered} />
         </button>}


         {
            (userInfo?.role === 'ADMIN' || userInfo?.role === 'OWNER') &&
            <div className="notification">
               <Link href='/dashboard/check-seller'>Seller Request ({state?.slLength})</Link>
            </div>
         }


         <div className="db_dropdown_profile" ref={menuRef}>
            <button onClick={() => setOpenMenu(e => !e)}>
               <strong>{userInfo?.seller?.storeInfos?.storeName}</strong>
            </button>

            <ul className="db_dropdown_profile_body" style={openMenu ? { display: 'block' } : { display: 'none' }}>

               <li>
                  <Link className={dbSlug === "my-profile" ? "active_link" : ""} href='/dashboard/my-profile'>
                     Profile
                  </Link>
               </li>

               <li>
                  <button className='logout_btn' onClick={async () => await authLogout()}>
                     Log Out
                  </button>
               </li>

            </ul>

         </div>
      </div>
   );
};

export default RightNavbar;