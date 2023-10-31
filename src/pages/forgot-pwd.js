// pages/forgot-pwd.js

import { apiHandler } from "@/Functions/common";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import { useAuthContext } from "@/lib/AuthProvider";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default withOutDashboard(function ForgotPwdPage() {

   const { setMessage, role } = useAuthContext();

   const [fPWDEmail, setFPWDEmail] = useState(false);

   const [showPwd, setShowPwd] = useState(false);

   let [timer, setTimer] = useState({ minutes: "00", seconds: "00" });

   const [target, setTarget] = useState([1]);

   const [newPwdForm, setNewPwdForm] = useState({});

   const [exTime, setExTime] = useState(0);

   const router = useRouter();

   const { action } = router?.query;

   useEffect(() => {
      if (role) {
         router.push("/");
      }
   }, [role, router]);


   useEffect(() => {
      const dd = setInterval(() => {

         const newDate = new Date();
         const ctime = newDate.getTime();

         if (ctime >= exTime) {
            setTarget([1]);
            return null;
         }

         const timeRemaining = exTime - ctime;

         const exDate = new Date(timeRemaining);

         setTimer({
            minutes: exDate.getMinutes().toString().padStart(2, "0"),
            seconds: exDate.getSeconds().toString().padStart(2, "0")
         })
      }, 1000);


      return () => clearInterval(dd);
   }, [exTime]);


   async function getOtpHandler(e) {
      try {
         e.preventDefault();

         let email = e.target.email.value;

         if (!email) {
            return setMessage("Required email address or phone number !", "danger");
         }

         const { success, message, data } = await apiHandler("/auth/forgot-pwd/send-otp", "POST", { email });

         if (data && success) {
            const { otpExTime, returnEmail } = data;
            setMessage(message, "success");
            setExTime(otpExTime);
            setFPWDEmail(returnEmail);
            return setTarget([...target, 2]);
         }
         return setMessage(message, "danger");
      } catch (error) {
         return setMessage(error?.message, "danger");
      }
   }


   async function submitOtpHandler(e) {
      try {
         e.preventDefault();

         let email = fPWDEmail || "";
         let securityCode = e.target.securityCode.value;

         if (!email) return setMessage("Required email !", "danger");

         if (!securityCode) {
            return setMessage("Required security code !", "danger");
         }

         const { success, message, data } = await apiHandler("/auth/submit-otp", "POST", { otp: securityCode, email });

         if (success && data) {
            const { redirectUri } = data;
            setMessage(message, "success");
            setTarget([...target, 3]);
            return;
         } else {
            return setMessage(message, "danger");
         }

      } catch (error) {
         return setMessage(error?.message, "danger");
      }
   }


   async function handleNewPassword(e) {
      try {
         e.preventDefault();

         let password = e.target.password.value;

         if (!password) {
            return setMessage("Required password !", "danger");
         }

         const { success, message } = await apiHandler("/auth/set-new-password", "POST", { email: fPWDEmail, password });

         if (success) {
            setMessage(message, "success");

            router.push("/login?email=" + fPWDEmail);
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
            <h5 className="text-center">Forgot Your Password ?</h5>

            <div className="py-3 w-75 mx-auto" style={{
               height: "100%",
               marginTop: "5rem"
            }}>
               <div className="py-2 target_bar">
                  <span className={target.includes(1) ? "active" : ""}>1</span>
                  <span className={target.includes(2) ? "active" : ""}>2</span>
                  <span className={target.includes(3) ? "active" : ""}>3</span>
               </div>

               {
                  (target.includes(3)) ? <div className="row">
                     <div className="col-lg-4 mx-auto" style={{
                        boxShadow: "0 0 8px 0 #c5c5c599"
                     }}>
                        <form action="" onSubmit={handleNewPassword} className='text-center p-4'>

                           <div className="input_group">
                              <label htmlFor="password">Password</label>
                              <div style={{ position: 'relative' }}>
                                 <input className='form-control form-control-sm'
                                    type={showPwd ? "text" : "password"}
                                    name='password'
                                    id='password'
                                    autoComplete='off'
                                    placeholder="Enter new password..." />
                                 <span style={{
                                    transform: "translateY(-50%)",
                                    position: "absolute",
                                    right: "2%",
                                    top: "50%"
                                 }} className='bt9' onClick={() => setShowPwd(e => !e)}>
                                    {showPwd ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                 </span>
                              </div>

                           </div>

                           <button className="bt9_edit w-100" type="submit">Set new password</button>
                        </form>
                     </div>
                  </div> :

                     <div className="row">
                        <div className="col-lg-4 mx-auto" style={{
                           boxShadow: "0 0 8px 0 #c5c5c599"
                        }}>
                           <form onSubmit={getOtpHandler} className='bordered p-4'>
                              <div className="input_group">
                                 <label htmlFor="email">Email Address</label>
                                 <input
                                    type="text"
                                    name="email"
                                    id="email"
                                    className="form-control form-control-sm"
                                    placeholder="enter email address..."
                                 />
                              </div>

                              {!target.includes(2 || 3) && <button className="bt9_edit w-100" type="submit">Get Otp</button>}
                           </form>

                           {target.includes(2) && <form onSubmit={submitOtpHandler} className="p-4">
                              <div className="input_group">
                                 <label htmlFor="securityCode"> {
                                    <div>
                                       <i>Time Remaining <b>{timer?.minutes}: {timer?.seconds}</b> seconds</i>
                                    </div>
                                 }
                                 </label>

                                 <input
                                    type="text"
                                    disabled={timer === 0 ? true : false}
                                    name="securityCode"
                                    id="securityCode"
                                    className="form-control form-control-sm"
                                    autoComplete="off"
                                    defaultValue=""
                                 />
                              </div>

                              <button className="bt9_edit w-100" type="submit" disabled={timer === 0 ? true : false}>Submit Otp</button>
                           </form>}
                        </div>
                     </div>
               }
            </div>
         </div>
      </div>
   )
}, [])