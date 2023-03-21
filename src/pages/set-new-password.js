// src/pages/set-new-password.js

import { apiHandler } from "@/Functions/common";
import { useAuthContext } from "@/lib/AuthProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function SetNewPassword() {

   const { setMessage } = useAuthContext();

   const router = useRouter();

   const { user, session, life_time } = router.query;

   useEffect(() => {
      if (!user || !session || !life_time) {
         router.push("/");
      }
   }, [user, session, router, life_time]);


   async function handleNewPassword(e) {
      try {
         e.preventDefault();

         let password = e.target.password.value;

         if (!password) {
            return setMessage("Required password !", "danger");
         }

         const { success, message } = await apiHandler("/auth/user/set-new-password", "POST", { email: user, password, securityCode: session });

         if (success) {
            setMessage(message, "success");

            router.push("/login?email=" + user);
         } else {
            return setMessage(message, "danger");
         }
      } catch (error) {
         return setMessage(error?.message, "danger");
      }
   }

   return (
      <div className="section_default">
         <div className="container">
            <h3 className="text-center">Set a new password</h3>

            <div className="row">
               <div className="col-lg-4 mx-auto">
                  <form action="" onSubmit={handleNewPassword} className='text-center p-4'>

                     <div className="pb-3">
                        <input type="password"
                           className="form-control form-control-sm"
                           name="password" id="password" placeholder="Enter new password..." />
                     </div>

                     <button className="bt9_edit w-100" type="submit">Submit</button>
                  </form>
               </div>
            </div>
         </div>
      </div>
   )
}