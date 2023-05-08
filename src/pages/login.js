// pages/Login.js


import VerifyEmailByOtp from "@/Components/AuthComponents/VerifyEmailByOtp";
import { apiHandler, validPassword } from "@/Functions/common";
import { useAuthContext } from "@/lib/AuthProvider";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Login() {
   const [showPwd, setShowPwd] = useState(false);
   const [loading, setLoading] = useState(false);
   const { setMessage, role, initialLoader } = useAuthContext();
   const [verifyReturnEmail, setVerifyReturnEmail] = useState("");
   const [verifyCodeTime, setVerifyCodeTime] = useState(0);
   const router = useRouter();
   const { pathname } = router;
   const { email, from } = router.query;


   useEffect(() => {
      if (role) {
         router.push("/");
      }
   }, [role, router, email]);

   async function handleLogin(e) {
      try {
         e.preventDefault();
         const emailOrPhone = e.target.emailOrPhone.value;
         const cPwd = e.target.password.value;

         if (emailOrPhone.length <= 0)
            return setMessage('Phone or email address required !!!', 'danger');

         if (!validPassword(cPwd)) return setMessage("Password should contains at least 1 digit, lowercase letter, special character !");

         if (cPwd.length < 5 || cPwd.length > 8)
            return setMessage('Password length should be 5 to 8 characters !', 'danger');

         setLoading(true);

         const { name, u_data, uuid, message, token, success, verificationExpiredAt, returnEmail } = await apiHandler(`/auth/login`, "POST", { emailOrPhone, cPwd });

         setLoading(false);

         if (!success) {
            return setMessage(message, 'danger');
         }

         if (returnEmail && verificationExpiredAt) {
            setVerifyCodeTime(verificationExpiredAt);
            return setVerifyReturnEmail(returnEmail);
         }

         if (name === 'Login' && u_data) {

            let now = new Date();

            const expireTime = new Date(now.getTime() + 16 * 60 * 60 * 1000);

            document.cookie = `_uuid=${uuid}; max-age=${(expireTime.getTime() - now.getTime()) / 1000}; path=/`;
            document.cookie = `log_tok=${token}; max-age=${(expireTime.getTime() - now.getTime()) / 1000}; path=/`;
            localStorage.setItem("client_data", u_data);

            initialLoader() && router.push(from || "/");
         }
         setMessage(message, "success");

      } catch (error) {
         setMessage(error?.message, "danger");
      } finally {
         setLoading(false);
      }
   }



   return (
      <div className='section_default'>
         <div className='container'>
            <div className="auth_container">
               <div className="ac_left">
                  <div className="ac_overlay">
                     <h1>WooKart</h1>
                     <p>
                        Get access to your Orders, Wishlist and Recommendations
                     </p>
                  </div>
               </div>


               <div className="ac_right">
                  {

                     verifyReturnEmail ? <VerifyEmailByOtp setMessage={setMessage}
                        verifyCodeTime={verifyCodeTime}
                        setVerifyCodeTime={setVerifyCodeTime}
                        setVerifyReturnEmail={setVerifyReturnEmail}
                        verifyReturnEmail={verifyReturnEmail}
                     /> : <>
                        <h5>Login</h5>
                        <p>Do not have an account?
                           &nbsp;<Link className="links" href={'/register'}>Create Your Account</Link>&nbsp;
                           it takes less than a minute
                        </p>
                        <br />
                        <p>
                           Become Seller &nbsp; <Link href={"/sell-online"}>Seller Registration</Link>
                        </p>

                        <form onSubmit={handleLogin} className='text-start'>
                           <div className="mb-3 input_group">
                              <label htmlFor='emailOrPhone'>Email address or phone</label>
                              <input className='form-control' type="text" name='emailOrPhone' id='emailOrPhone' defaultValue={email || ""} autoComplete='off' placeholder="Enter your email or phone" />
                           </div>

                           <div className="mb-3 input_group">
                              <label htmlFor='password'>Password</label>
                              <div style={{ position: 'relative' }}>
                                 <input className='form-control' type={showPwd ? "text" : "password"} name='password' id='password' autoComplete='off' placeholder="Please enter password !!!" />
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

                           <div className='mb-3 input_group'>
                              <button className='bt9_auth' type="submit">
                                 {loading ? "Signing..." : "Login"}
                              </button>
                           </div>
                        </form>

                        <br />
                        <Link href={`/forgot-pwd`}>Forgot password ?</Link>
                     </>
                  }


               </div>

            </div>
         </div>
      </div>
   )
}