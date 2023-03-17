// pages/Login.js

import { useAuthContext } from "@/lib/AuthProvider";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Login() {
   const [showPwd, setShowPwd] = useState(false);
   const [verifyToken, setVerifyToken] = useState("");
   const [loading, setLoading] = useState(false);
   const { setMessage, role, authRefetch } = useAuthContext();
   const router = useRouter();

   useEffect(() => {
      if (role) {
         router.back();
      }
   }, [role, router]);

   async function handleLogin(e) {
      try {
         setLoading(true);
         e.preventDefault();
         let emailOrPhone = e.target.emailOrPhone.value;
         let password = e.target.password.value;
         let verify_token;

         if (verifyToken) {
            verify_token = e.target.verify_token.value;
         }

         if (emailOrPhone.length <= 0) {
            return setMessage('Phone or email address required !!!', 'danger');
         }

         else if (password.length <= 0) {
            return setMessage('Password required !!!', 'danger');
         }

         else {
            const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/auth/login`, {
               method: "POST",
               withCredentials: true,
               credentials: 'include',
               headers: {
                  "Content-Type": "application/json",
                  authorization: `Bearer ${verify_token}`
               },
               body: JSON.stringify({ emailOrPhone, password })
            });

            setLoading(false);

            const { name, uuid, verifyToken, u_data, message } = await response.json();

            // let verifyTok = document.cookie.split('; ').find(e => e.startsWith('verifyToken='))?.split('=')[1];


            if (!response.ok) {
               return setMessage(message, 'danger');
            } else {


               if (verifyToken && typeof verifyToken !== "undefined") {
                  setVerifyToken(verifyToken);
               }


               if (name === 'isLogin' && u_data) {
                  localStorage.setItem("u_data", u_data);
                  authRefetch();
                  router.back();
               }
            }

         }

      } catch (error) {
         setMessage(error?.message, "danger");
      } finally {
         setLoading(false);
      }
   }
   return (
      <div className='section_default' style={{ height: "90vh" }}>
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
                  <h5>Login</h5>
                  <p>Do not have an account?
                     &nbsp;<Link href={'/register'}>Create Your Account</Link>&nbsp;
                     it takes less than a minute
                  </p>
                  {

                  }

                  <form onSubmit={handleLogin} className='text-start'>
                     <div className="mb-3 input_group">
                        <label htmlFor='emailOrPhone'>Email address or phone</label>
                        <input className='form-control' type="text" name='emailOrPhone' id='emailOrPhone' defaultValue={""} autoComplete='off' placeholder="Enter your email or phone" />
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
                     {
                        verifyToken && <div className='mb-3'>
                           <div style={{
                              width: "fit-content",
                              height: "40px",
                              border: "2px solid gray",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              letterSpacing: "2px",
                              fontVariantNumeric: "diagonal-fractions",
                              padding: "0.5rem",
                           }}>{verifyToken}</div>
                           <br />
                           <input className='form-control' type="text" name='verify_token' id='verify_token' placeholder="Enter token" />
                        </div>
                     }
                     <div className='mb-3 input_group'>
                        <button className='bt9_auth' type="submit">
                           {loading ? "Signing..." : "Login"}
                        </button>
                     </div>
                  </form>
               </div>

            </div>
         </div>
      </div>
   )
}