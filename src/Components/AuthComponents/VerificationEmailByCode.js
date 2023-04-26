
// Components/AuthComponents/VerifyAuthToken.js

import { useRouter } from "next/router";
import { useState } from "react";
import BtnSpinner from "../Shared/BtnSpinner/BtnSpinner";
import { apiHandler } from "@/Functions/common";


export default function VerificationEmailByCode({ setMessage }) {

   const [loading, setLoading] = useState(false);
   const router = useRouter();
   const { pathname, query } = router;
   const { return_email, exTime } = query;

   async function handleVerifyAuthToken(e) {
      try {
         e.preventDefault();
         setLoading(true);

         let verificationCode = e.target.verificationCode.value;

         if (!verificationCode) return setMessage("Required verify token !");

         const { success, message, returnEmail } = await apiHandler(`/auth/verify-register-user`, "POST", {
            verificationCode, email: return_email, verificationExpiredAt: exTime
         });

         setLoading(false);

         if (success) {

            setMessage(message, 'success');

            return router.push(`/login?email=${returnEmail}`);
         } else {
            return setMessage(message, 'danger');
         }
      } catch (error) {
         setMessage(error?.message, 'danger');
      }
   }

   async function generateNewVerificationCode() {
      try {
         const { success, message, returnEmail, verificationExpiredAt } = await apiHandler(`/auth/generate-verification-code?email=${return_email}`, "GET");

         if (success) {
            setMessage(message, "success");
            return router.push(`${pathname}?return_email=${returnEmail}&exTime=${verificationExpiredAt}`);
         }

         return setMessage(message, "danger");

      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }

   return (
      <>
         <form onSubmit={handleVerifyAuthToken}>
            <div className="mb-3">
               <input className='form-control' type="text" id='verificationCode' name='verificationCode' autoComplete='off' placeholder="Enter verify token..." />
            </div>

            <button id="submit_btn" variant="primary" className='bt9_auth' type="submit">
               {loading ? <BtnSpinner text={"Verifying..."}></BtnSpinner> : "Verify"}
            </button>
         </form>

         {
            new Date(exTime) < new Date() && <button className="bt9_primary my-3" onClick={generateNewVerificationCode}>Resend Code</button>
         }

      </>
   )
}