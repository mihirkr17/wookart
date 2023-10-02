
// src/pages/user/index.js

import Profile from "@/Components/UserComponents/Profile";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import { useAuthContext } from "@/lib/AuthProvider";
import Link from "next/link";
import ProtectedHOC from "../_ProtectedHOC";

function User() {

   const { userInfo } = useAuthContext();
   return (

      <div className='section_default'>
         <div className="container">
            <div className="row">
               <div className="col-lg-2">
                  <div className="p-3" style={{
                     boxShadow: "0 0 10px 2px #91919187",
                     borderRadius: "10px",
                     margin: "0 0 1rem 0"
                  }}>
                     <div className="py-2">
                        <small>Hello, <b>{userInfo?.fullName}</b></small>
                     </div>
                     <ul>
                        <li>
                           <Link style={{ color: "black" }} href='/user/my-account'>Profile</Link>
                        </li>
                        <li>
                           <Link href='/user/address-book'>Address Book</Link>
                        </li>
                        <li>
                           <Link href='/user/payment-management'>Payment Option</Link>
                        </li>
                        <li>
                           <Link href="/user/orders-management">Orders</Link>
                        </li>
                     </ul>
                  </div>
               </div>
               <div className="col-lg-10">
                  <div className="p-2 w-100 content_wrapper">
                     <Profile></Profile>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}


export default ProtectedHOC(User);