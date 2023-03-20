// pages/forgot-pwd.js

import { apiHandler } from "@/Functions/common";
import { useAuthContext } from "@/lib/AuthProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ForgotPwdPage() {

   const { setMessage, role } = useAuthContext();

   const [fPwd, setFPwd] = useState({});

   const router = useRouter();

   useEffect(() => {
      if (role) {
         router.push("/");
      }
   }, [role, router]);

   async function handleForgotPwd(e) {
      try {
         e.preventDefault();

         let emailOrPhone = e.target.emailOrPhone.value;

         if (!emailOrPhone) {
            return setMessage("Required email address or phone number !", "danger");
         }

         const { success, message, securityCode, email_phone } = await apiHandler("/auth/check-user-authentication", "POST", { emailOrPhone });

         if (success) {
            setFPwd({ secCode: securityCode, emailOrPhone: email_phone });
            setMessage(message, "success");
            return;

         } else {
            return setMessage(message, "danger");
         }

      } catch (error) {
         return setMessage(error?.message, "danger");
      }
   }


   async function securityCodeHandler(e) {
      try {
         e.preventDefault();

         let emailOrPhone = e.target.emailOrPhone.value;
         let securityCode = e.target.securityCode.value;

         if (!securityCode) {
            return setMessage("Required security code !", "danger");
         }

         const { success, message, data } = await apiHandler("/auth/check-user-forgot-pwd-security-key", "POST", { securityCode, emailOrPhone });

         if (success && data) {
            setFPwd({});
            setMessage(message, "success");
            router.push(`/set-new-password?user=${data?.email}&session=${data?.securityCode}`);
            return;

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
            <h3 className="text-center">Forgot Your Password ?</h3>

            <div className="py-3 w-100">
               {
                  (fPwd?.secCode && fPwd?.emailOrPhone) ?
                     <div className="row">
                        <div className="col-6 mx-auto">
                           <form onSubmit={securityCodeHandler}>
                              <div className="row">
                                 <div className="col-lg-12">
                                    <label htmlFor="securityCode">Security Code</label> <br />
                                    <span>{fPwd?.secCode}</span> <br />
                                    <input type="text" name="securityCode" id="securityCode" className="form-control form-control-sm" />
                                    <input type="hidden" name="emailOrPhone" id="emailOrPhone" value={fPwd?.emailOrPhone} />
                                 </div>

                                 <div className="col-lg-">
                                    <button className="bt9_edit" type="submit">Submit</button>
                                 </div>
                              </div>
                           </form>
                        </div>
                     </div> :
                     <div className="row">
                        <div className="col-6 mx-auto">
                           <form onSubmit={handleForgotPwd} className='borderd'>
                              <div className="row">
                                 <div className="col-lg-12 p-3">
                                    <label htmlFor="emailOrPhone">Email Address / Phone number</label> <br />
                                    <input type="text" name="emailOrPhone" id="emailOrPhone" />
                                 </div>

                                 <div className="col-lg-12">
                                    <button className="bt9_edit" type="submit">Submit</button>
                                 </div>
                              </div>
                           </form>
                        </div>
                     </div>
               }
            </div>
         </div>
      </div>
   )
}