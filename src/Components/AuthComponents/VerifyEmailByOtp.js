
// Components/AuthComponents/VerifyEmailByCode.js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import BtnSpinner from "../Shared/BtnSpinner/BtnSpinner";
import { apiHandler } from "@/Functions/common";


export default function VerifyEmailByOtp({ verifyReturnEmail, verifyCodeTime, setVerifyCodeTime, setVerifyReturnEmail }) {

   const [loading, setLoading] = useState(false);
   const [reLoading, setReLoading] = useState(false);
   const [resendBtn, setResendBtn] = useState(false);
   const [msg, setMsg] = useState("");
   const [welcomeMsg, setWelcomeMsg] = useState("");
   const router = useRouter();

   // checking expire time is less than current time or not
   useEffect(() => {
      const timeOut = setInterval(() => {

         if (new Date(verifyCodeTime) < new Date() === true) {
            setResendBtn(true);
         } else {
            setResendBtn(false);
         }
      }, 1000);

      return () => clearInterval(timeOut);
   }, [verifyCodeTime]);

   // handler of verification code from registration email
   async function verificationCodeHandler(e) {
      try {
         e.preventDefault();


         let verificationCode = e.target.verificationCode.value;

         if (!verificationCode) return setMsg("Required verify token !");

         if (verificationCode.length <= 5 || verificationCode.length >= 7) return setMsg("Verification code should be 6 digits !");

         setLoading(true);

         const { success, message, returnEmail } = await apiHandler(`/auth/verify-register-user`, "POST", {
            verificationCode, email: verifyReturnEmail, verificationExpiredAt: verifyCodeTime
         });

         setLoading(false);

         if (success) {

            setWelcomeMsg(message);
            setVerifyReturnEmail("");

            return router.push(`/login?email=${returnEmail}`);
         }

         return setMsg(message);

      } catch (error) {
         setMsg(error?.message);
      }
   }


   // regenerate new verification code 
   async function generateNewVerificationCode() {
      try {

         if (!verifyReturnEmail) return setMsg("Required return email !");

         setReLoading(true);

         const { success, message, returnEmail, verificationExpiredAt } = await apiHandler(`/auth/generate-verification-code?email=${verifyReturnEmail}`, "GET");

         setReLoading(false);

         if (success) {
            setMsg("");
            setWelcomeMsg(message);
            setVerifyCodeTime(verificationExpiredAt);
            setVerifyReturnEmail(returnEmail);
            return;
         }

         return setMsg(message, "danger");

      } catch (error) {
         setMsg(error?.message, "danger");
      }
   }

   let date = new Date(verifyCodeTime).toLocaleTimeString();

   return (
      <div>
         {welcomeMsg && <span className="alerts alerts_success">{welcomeMsg}</span>}
         {
            msg && <span className="alerts alerts_danger">{msg}</span>
         }
         <form onSubmit={verificationCodeHandler}>
            <div className="mb-3 input_group">
               <label htmlFor="verificationCode">Verification Code</label>
               <input className='form-control' type="number" id='verificationCode' name='verificationCode' autoComplete='off' placeholder="six digit code..." />
            </div>

            <button id="submit_btn" variant="primary" className='bt9_auth' type="submit">
               {loading ? <BtnSpinner text={"Verifying..."}></BtnSpinner> : "Verify"}
            </button>
         </form>
         {
            !resendBtn && <p className="py-2">Expire after {date}</p>
         }
         {

            (resendBtn) && <button className="bt9_primary my-3" onClick={generateNewVerificationCode}>{reLoading ? <BtnSpinner text={"Sending..."} /> : "Resend Code"}</button>
         }

      </div>
   )
}