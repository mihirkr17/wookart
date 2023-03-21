// pages/forgot-pwd.js

import { apiHandler } from "@/Functions/common";
import { useAuthContext } from "@/lib/AuthProvider";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ForgotPwdPage() {

   const { setMessage, role } = useAuthContext();

   const [fPwd, setFPwd] = useState({});
   let [timer, setTimer] = useState(0);

   const router = useRouter();

   useEffect(() => {
      if (role) {
         router.push("/");
      }
   }, [role, router]);


   useEffect(() => {
      const dd = setInterval(() => {
         setTimer(p => p - 1)
      }, 1000);

      if (timer === 0) {
         setFPwd({ secCode: null, emailOrPhone: fPwd?.emailOrPhone });
         clearInterval(dd);
      }

      return () => clearInterval(dd);
   }, [timer, fPwd?.emailOrPhone]);

   async function handleForgotPwd(e, emlPhn) {
      try {
         e.preventDefault();

         let emailOrPhone = emlPhn || e.target.emailOrPhone.value;

         if (!emailOrPhone) {
            return setMessage("Required email address or phone number !", "danger");
         }

         const { success, message, securityCode, email_phone, lifeTime } = await apiHandler("/auth/check-user-authentication", "POST", { emailOrPhone });

         if (success) {
            setFPwd({ secCode: securityCode, emailOrPhone: email_phone });
            setTimer(lifeTime / 1000);
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
            router.push(`/set-new-password?user=${data?.email}&session=${data?.securityCode}&life_time=${data?.sessionLifeTime}`);
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

            <div className="py-3 w-75 mx-auto" style={{
               boxShadow: "0 0 8px 0 #c5c5c599",
               height: "100%",
               marginTop: "5rem"
            }}>
               {
                  (fPwd?.emailOrPhone) ?
                     <div className="row">

                        <div className="col-lg-4 mx-auto">
                           <form onSubmit={securityCodeHandler} className="p-4">

                              <div className="row">
                                 <div className="col-lg-12">
                                    <label htmlFor="securityCode"> {
                                       timer === 0 ?
                                          <div style={{ color: "red" }}>
                                             <span>Session Expired !</span>
                                             <button className="bt9_edit ms-2" onClick={(e) => handleForgotPwd(e, fPwd?.emailOrPhone)}>Resend</button>
                                          </div>
                                          : <div>
                                             <span>Your Security Code is <b style={{ color: "green" }}>&nbsp;{fPwd?.secCode}&nbsp;</b> </span>
                                             <br />
                                             <i>Time Remaining <b>{timer}</b> seconds</i>
                                          </div>
                                    }
                                    </label>

                                    <br />
                                    <input type="text" disabled={timer === 0 ? true : false} name="securityCode" id="securityCode" className="form-control form-control-sm" />
                                    <input type="hidden" name="emailOrPhone" id="emailOrPhone" value={fPwd?.emailOrPhone} />
                                 </div>

                                 <div className="col-lg-12 py-1">
                                    <button className="bt9_edit" type="submit" disabled={timer === 0 ? true : false}>Submit</button>
                                 </div>
                              </div>
                           </form>

                        </div>
                     </div> :
                     <div className="row">
                        <div className="col-lg-4 mx-auto">
                           <form onSubmit={handleForgotPwd} className='bordered p-4'>
                              <div className="row">
                                 <div className="col-lg-12 p-3">
                                    <label htmlFor="emailOrPhone">Email Address / Phone number</label> <br />
                                    <input type="text" name="emailOrPhone" id="emailOrPhone" className="form-control form-control-sm" />
                                 </div>

                                 <div className="col-lg-12">
                                    <button className="bt9_edit" type="submit">Check Account</button>
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