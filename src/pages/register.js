import VerifyEmailByOtp from "@/Components/AuthComponents/VerifyEmailByOtp";
import BtnSpinner from "@/Components/Shared/BtnSpinner/BtnSpinner";
import { apiHandler, emailValidator } from "@/Functions/common";
import { useBaseContext } from "@/lib/BaseProvider";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Register() {
   const { setMessage } = useBaseContext();
   const [loading, setLoading] = useState(false);
   const [accept, setAccept] = useState(false);
   const [showPwd, setShowPwd] = useState(false);
   const [verificationMsg, setVerificationMsg] = useState("");
   const router = useRouter();
   const [verifyReturnEmail, setVerifyReturnEmail] = useState("");
   const [verifyCodeTime, setVerifyCodeTime] = useState(0);

   const { pathname, query } = router;

   const { return_email } = query;


   async function handleRegister(e) {
      try {
         e.preventDefault();
         setLoading(true);

         let formData = new FormData(e.currentTarget);

         formData = Object.fromEntries(formData.entries());

         const { phone, email, password, gender, fullName } = formData;

         if (phone.length <= 0) {
            return setMessage('Phone number required !!!', 'danger');
         }

         else if (!gender && gender.length <= 0) {
            return setMessage('Please select your gender !!!', 'danger');
         }

         else if (!fullName && fullName.length <= 0) {
            return setMessage('Please enter your full name !!!', 'danger');
         }

         else if (email.length <= 0) {
            return setMessage('Email address required !!!', 'danger');
         }

         else if (!emailValidator(email)) {
            return setMessage('Invalid email address !!!', 'danger');
         }

         else if (password.length <= 0) {
            return setMessage('Email address required !!!', 'danger');
         }

         else if (password.length <= 4 && password.length >= 10) {
            return setMessage('Password must be greater than 5 characters !!!', 'danger');
         }

         // if all input fields validate then call the api request
         else {

            const { message, success, verificationExpiredAt, returnEmail } = await apiHandler(`/auth/register-new-user`, "POST", formData);

            setLoading(false);

            if (!success) return setMessage(message, 'danger');

            setVerifyReturnEmail(returnEmail);
            setVerifyCodeTime(verificationExpiredAt);
            setVerificationMsg(message);
            setMessage(message, "success");

            e.target.reset();
            return;
         }

      } catch (error) {
         setMessage(error?.message, 'danger');
      } finally {
         setLoading(false);
      }
   }

   return (
      <div className='section_default'>
         <div className="container">
            <div className="auth_container">
               <div className="ac_left">
                  <div className="ac_overlay">
                     <h1>WooKart</h1>
                     <p>
                        Sign up with your email & phone to get started
                     </p>
                  </div>
               </div>
               <div className="ac_right">
                  {
                     verifyReturnEmail ? <VerifyEmailByOtp
                        setMessage={setMessage}
                        verifyCodeTime={verifyCodeTime}
                        setVerifyCodeTime={setVerifyCodeTime}
                        setVerifyReturnEmail={setVerifyReturnEmail}
                        verifyReturnEmail={verifyReturnEmail} /> : <>

                        <h5>Register</h5>
                        <p>Already have an account?
                           &nbsp;<Link className="links" href={'/login'}>Go To Login</Link>&nbsp;
                           it takes less than a minute
                        </p>


                        {
                           verificationMsg && <b style={{ color: "green" }}>
                              {verificationMsg}
                           </b>
                        }
                        <form onSubmit={handleRegister}>

                           <div className="input_group">
                              <label htmlFor="fullName">Full Name</label>
                              <input type="text" className='form-control'
                                 name="fullName" id="fullName"
                                 placeholder='enter full name...' required />
                           </div>

                           <div className="input_group">
                              <label htmlFor='phone'>Phone Number</label>
                              <input className='form-control' id='phone'
                                 type="number" pattern="[0-9]*" name='phone'
                                 autoComplete='off' placeholder="enter phone number..." required />
                           </div>

                           <div className="input_group">
                              <label htmlFor='email'>Email address</label>
                              <input className='form-control' id='email'
                                 type="email" name='email' autoComplete='off'
                                 placeholder="enter email address..." required
                              />
                           </div>

                           <div className="input_group">
                              <label htmlFor='password'>Password</label>
                              <div style={{ position: 'relative' }}>
                                 <input className='form-control' type={showPwd ? "text" : "password"}
                                    name='password' id='password' autoComplete='off'
                                    placeholder="enter password..." />
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

                           <div className="input_group">
                              <label htmlFor="gender">Gender</label>
                              <select className='form-select' name="gender" id="gender" required>
                                 <option value="">Select Gender</option>
                                 <option value="Male">Male</option>
                                 <option value="Female">Female</option>
                                 <option value="Others">Others</option>
                              </select>
                           </div>

                           <div className="mb-3 text-muted">
                              <input type="checkbox" id='accept_terms' onChange={() => setAccept(e => !e)} />
                              &nbsp;
                              <label htmlFor="accept_terms">I would like to receive exclusive offers and promotions via SMS</label>
                           </div>

                           <button id="submit_btn" className='bt9_auth' disabled={accept === false ? true : false} type="submit">
                              {loading ? <BtnSpinner text={"Registering..."}></BtnSpinner> : "Register"}
                           </button>
                        </form>
                     </>
                  }
               </div>
            </div>
         </div>
      </div >
   )
}