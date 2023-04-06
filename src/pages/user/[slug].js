import MyAddressBook from "@/Components/UserComponents/MyAddressBook";
import MyOrder from "@/Components/UserComponents/MyOrder";
import MyPayment from "@/Components/UserComponents/MyPayment";
import Profile from "@/Components/UserComponents/Profile";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import { useAuthContext } from "@/lib/AuthProvider";
import RequiredAuth from "@/Middlewares/RequiredAuth";
import Link from "next/link";
import { useRouter } from "next/router"


export function MyAccount() {

   const router = useRouter();
   const { userInfo } = useAuthContext();

   const { slug } = router.query;


   return (
      <RequiredAuth>
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
                              <Link style={{ color: slug === "my-account" ? "black" : "#666666" }} href='/user/my-account'>Profile</Link>
                           </li>
                           <li>
                              <Link style={{ color: slug === "address-book" ? "black" : "#666666" }} href='address-book'>Address Book</Link>
                           </li>
                           <li>
                              <Link style={{ color: slug === "payment-management" ? "black" : "#666666" }} href='payment-management'>Payment Option</Link>
                           </li>
                           <li>
                              <Link style={{ color: slug === "orders-management" ? "black" : "#666666" }} href="orders-management">Orders</Link>
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



export default withOutDashboard(MyAccount, []);