import Profile from "@/Components/UserComponents/Profile";
import { useAuthContext } from "@/lib/AuthProvider";
import RequiredAuth from "@/Middlewares/RequiredAuth";
import Link from "next/link";

export default function User() {

   const { userInfo } = useAuthContext();
   return (
      <RequiredAuth>
         <div className='section_default'>
            <div className="container">
               <div className="row">
                  <div className="col-lg-2">
                     <div className="p-3">
                        <div className="py-2">
                           <span>Hello, {userInfo?.fullName}</span>
                        </div>
                        <ul>
                           <li>
                              <Link style={{ color: "red" }} href='/user/my-account'>My Profile</Link>
                           </li>
                           <li>
                              <Link href='/user/address-book'>My Address Book</Link>
                           </li>
                           <li>
                              <Link href='/user/payment-management'>My Payment Option</Link>
                           </li>
                           <li>
                              <Link href="/user/orders-management">My Orders</Link>
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
      </RequiredAuth>
   )
}