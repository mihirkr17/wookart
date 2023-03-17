import MyAddressBook from "@/Components/UserComponents/MyAddressBook";
import MyOrder from "@/Components/UserComponents/MyOrder";
import MyPayment from "@/Components/UserComponents/MyPayment";
import Profile from "@/Components/UserComponents/Profile";
import { useAuthContext } from "@/lib/AuthProvider";
import RequiredAuth from "@/Middlewares/RequiredAuth";
import Link from "next/link";
import { useRouter } from "next/router"


export default function MyAccount() {

   const router = useRouter();
   const { userInfo } = useAuthContext();

   const { slug } = router.query;


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
                              <Link style={{ color: slug === "my-account" && "red" }} href='/user/my-account'>My Profile</Link>
                           </li>
                           <li>
                              <Link style={{ color: slug === "address-book" && "red" }} href='address-book'>My Address Book</Link>
                           </li>
                           <li>
                              <Link style={{ color: slug === "payment-management" && "red" }} href='payment-management'>My Payment Option</Link>
                           </li>
                           <li>
                              <Link style={{ color: slug === "orders-management" && "red" }} href="orders-management">My Orders</Link>
                           </li>
                        </ul>
                     </div>
                  </div>
                  <div className="col-lg-10">
                     <div className="p-2 w-100 content_wrapper">
                        {
                           (slug === "my-account") && <Profile></Profile>
                        }
                        {
                           (slug === "address-book") && <MyAddressBook></MyAddressBook>
                        }
                        {
                           (slug === "payment-management") && <MyPayment></MyPayment>
                        }
                        {
                           (slug === "orders-management") && <MyOrder></MyOrder>
                        }

                     </div>
                  </div>
               </div>
            </div>
         </div>
      </RequiredAuth>
   )
}