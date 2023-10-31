// pages/Login.js


import VerifyEmailByOtp from "@/Components/AuthComponents/VerifyEmailByOtp";
import { addCookie, apiHandler, validPassword } from "@/Functions/common";
import { useAuthContext } from "@/lib/AuthProvider";
import { useCartContext } from "@/lib/CartProvider";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Login() {
   const [showPwd, setShowPwd] = useState(false);
   const [loading, setLoading] = useState(false);
   const { setMessage, role, initialLoader } = useAuthContext();
   const [initMessage, setInitMessage] = useState("");
   const router = useRouter();
   const { email: queryEmail, redirect_to } = router.query;
   const { cartRefetch } = useCartContext();


   useEffect(() => {
      if (role) {
         router.push(redirect_to ? decodeURIComponent(redirect_to) : "/");
      }
   }, [role, router, redirect_to]);

   // handle login
   async function handleLogin(e) {
      try {
         e.preventDefault();

         const email = e.target.emailOrPhone.value;
         const password = e.target.password.value;

         if (email.length <= 0)
            return setMessage('Phone or email address required !!!', 'danger');

         if (!validPassword(password))
            return setMessage("Password should contains at least 1 digit, lowercase letter, special character !");

         if (password.length < 5 || password.length > 8)
            return setMessage('Password length should be 5 to 8 characters !', 'danger');

         setLoading(true);

         const {
            message,
            success,
            data
         } = await apiHandler(`/auth/login`, "POST", { email, password });

         setLoading(false);

         if (!success) {
            return setMessage(message, 'danger');
         }

         setMessage(message, "success");

         if (data) {

            const { action, u_data, token } = data;

            if (action === "ACCOUNT_VERIFY_REQUEST") {
               return setInitMessage(message);
            }

            if (action === "LOGIN") {
               let cookieResult = addCookie("appSession", token, 16);

               if (!cookieResult)
                  return setMessage("Failed to set authentication !", "danger");

               localStorage.setItem("client_data", u_data);

               initialLoader();
               cartRefetch();
               router.push(redirect_to ? decodeURIComponent(redirect_to) : "/");
            }
         }

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

                  <>
                     <h5>Login</h5>
                     <p>Do not have an account?
                        &nbsp;<Link className="links" href={'/register'}>Create Your Account</Link>&nbsp;
                        it takes less than a minute
                     </p>
                     <br />
                     <p>
                        Become Seller &nbsp; <Link href={"/sell-online"}>Seller Registration</Link>
                     </p>

                     <br />

                     {initMessage && <p style={{ color: "#59b159", textAlign: "center", fontWeight: "bold" }}>{initMessage}</p>}

                     <br />

                     <form onSubmit={handleLogin} className='text-start'>
                        <div className="mb-3 input_group">
                           <label htmlFor='emailOrPhone'>Email address or phone</label>
                           <input className='form-control' type="text" name='emailOrPhone' id='emailOrPhone' defaultValue={queryEmail || ""} autoComplete='off' placeholder="Enter your email or phone" />
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
               </div>

            </div>
         </div>
      </div>
   )
}