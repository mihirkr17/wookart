// src/pages/set-new-password.js

import { apiHandler } from "@/Functions/common";
import { useAuthContext } from "@/lib/AuthProvider";
import { useRouter } from "next/router";
import { useEffect } from "react";


export default function SetNewPassword() {

   const { setMessage } = useAuthContext();

   const router = useRouter();

   const { user, session } = router.query;

   useEffect(() => {
      if (!user || !session) {
         router.push("/");
      }
   }, [user, session, router]);




   async function handleNewPassword(e) {
      try {
         e.preventDefault();

         let password = e.target.password.value;

         if (!password) {
            return setMessage("Required password !", "danger");
         }

         const { success, message } = await apiHandler("/auth/user/set-new-password", "POST", { email: user, password });

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
            <h3 className="text-center">Set new password</h3>

            <div className="row">
               <div className="col-6 mx-auto">
                  <form action="" onSubmit={handleNewPassword}>
                     <div className="p-3">
                        <label htmlFor="password">Password</label> <br />
                        <input type="password"
                           className="form-control form-control-sm"
                           name="password" id="password" placeholder="Enter new password..." />
                     </div>

                     <button className="bt9_edit" type="submit">Submit</button>
                  </form>
               </div>
            </div>
         </div>
      </div>
   )
}