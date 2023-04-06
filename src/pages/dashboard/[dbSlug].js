import AddProduct from "@/Components/DashboardComponents/AddProduct/AddProduct";
import CheckAllIncomingProductListing from "@/Components/DashboardComponents/CheckAllIncomingListing/CheckAllIncomingProductListing";
import ManageOrders from "@/Components/DashboardComponents/ManageOrdersComponents/manage-orders";
import ManageProduct from "@/Components/DashboardComponents/ManageProduct/ManageProduct";
import MyProfile from "@/Components/DashboardComponents/MyProfile/MyProfile";
import RightNavbar from "@/Components/DashboardComponents/RightNavbar/RightNavbar";
import SideBar from "@/Components/DashboardComponents/SideBar/SideBar";
import { withAuthorization } from "@/Functions/withAuthorization";
import { useAuthContext } from "@/lib/AuthProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export function DBSlug() {

   const [shrink, setShrink] = useState(false);
   const router = useRouter();
   const { role, userInfo } = useAuthContext();
   const [responsive, setResponsive] = useState(window && window.innerWidth);

   const { dbSlug } = router?.query;


   useEffect(() => {
      function reportWindowSize() {
         setResponsive(window.innerWidth);
      }
      // Trigger this function on resize
      window.addEventListener('resize', reportWindowSize);
      //  Cleanup for componentWillUnmount
      return () => window.removeEventListener('resize', reportWindowSize);
   }, []);


   return (
      <div className="section_default">
         <div className={`db_container ${shrink ? 'isShrink' : ''}`}>

            {/* Left Bar */}
            <div className="db_left_bar">
               <SideBar dbSlug={dbSlug} shrink={shrink} role={role} setShrink={setShrink}></SideBar>
            </div>

            {/* Right Bar */}
            <div className="db_right_bar">
               <RightNavbar shrink={shrink} userInfo={userInfo} dbSlug={dbSlug} setShrink={setShrink}></RightNavbar>

               <div className='db_right_content_wrapper'>
                  {
                     dbSlug === "manage-orders" && <ManageOrders></ManageOrders>
                  }

                  {
                     dbSlug === "manage-product" && <ManageProduct></ManageProduct>
                  }

                  {
                     dbSlug === "add-product" && <AddProduct></AddProduct>
                  }
                  {
                     dbSlug === "my-profile" && <MyProfile></MyProfile>
                  }

                  {
                     dbSlug === "check-all-incoming-listing" && <CheckAllIncomingProductListing />
                  }
               </div>
            </div>

         </div>
      </div>
   )
}

export default withAuthorization(DBSlug, ["SELLER", "ADMIN"])