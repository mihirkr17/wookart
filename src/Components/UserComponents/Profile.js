import { apiHandler } from '@/Functions/common';
import { useAuthContext } from '@/lib/AuthProvider';
import React, { useState } from 'react';


const Profile = () => {
   const { userInfo, authRefetch, setMessage } = useAuthContext();
   const [openProfileUpdateForm, setOpenProfileUpdateForm] = useState(false);
   const [inputs, setInputs] = useState({ fullName: userInfo?.fullName, dob: userInfo?.dob, gender: userInfo?.gender } || {});
   const [openPwdForm, setOpenPwdForm] = useState(false);

   async function submitProfileData() {
      try {

         const data = await apiHandler(`/user/update-profile-data`, "PUT", inputs, userInfo?.email);

         if (data?.success) {
            setMessage(data?.message, 'success');
            await authRefetch();
            return;
         }

         setMessage(data?.message, 'danger');

      } catch (error) {
         setMessage(error?.message, 'danger');
      }
   }



   async function handlePassword(e) {
      try {
         e.preventDefault();

         const oldPassword = e.target.oldPassword.value;
         const newPassword = e.target.newPassword.value;

         if (oldPassword === "") {
            return setMessage("Required old password !", "danger");
         }

         if (newPassword === "") {
            return setMessage("Required new password !", "danger");
         }

         const data = await apiHandler(`/auth/user/changed-password`, "POST", { oldPassword, newPassword });

         if (data?.success) {
            setMessage(data?.message, "success");
            await authRefetch();
            return;
         } else {
            setMessage(data?.message, "danger");
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }

   return (
      <div className='container'>
         <h5 className='py-4 text-start'>My Profile</h5>
         <div className="row">
            <div className="col-lg-12">
               <ul className='my-profile'>
                  <li>
                     <h6>Full Name</h6>

                     {
                        openProfileUpdateForm ?
                           <input className="form-control form-control-sm"
                              onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}
                              type="text" name='fullName'
                              id='fullName' defaultValue={userInfo?.fullName || ""} /> :
                           <span>{userInfo?.fullName}</span>
                     }
                  </li>
                  <li>
                     <h6>Gender</h6>
                     {
                        openProfileUpdateForm ?
                           <select className="form-select form-select-sm" name="gender" id="gender" onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })}>
                              {
                                 userInfo?.gender && <option value={userInfo?.gender}>{userInfo?.gender}</option>
                              }
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Others">Others</option>
                           </select> :
                           <span>{userInfo?.gender}</span>
                     }
                  </li>
                  <li>
                     <h6>Date Of Birth</h6>
                     {
                        openProfileUpdateForm ?
                           <input onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })} className="form-control form-control-sm" type="date" name="dob" id="dob" defaultValue={userInfo?.dob || ""} />
                           : <span>{userInfo?.dob}</span>
                     }

                  </li>
                  <li>
                     <h6>Email</h6>
                     <span>{userInfo?.email}</span>
                  </li>
               </ul>
            </div>

            <div className="col-12 pt-5">
               {
                  openProfileUpdateForm ?
                     <>
                        <button className="bt9_edit me-2" onClick={submitProfileData}>
                           Save Change
                        </button>
                        <button className="bt9_cancel" onClick={() => setOpenProfileUpdateForm(false)}>
                           Cancel
                        </button>
                     </> :
                     <>
                        <button className="bt9_edit" onClick={() => setOpenProfileUpdateForm(true)}>
                           Edit Profile
                        </button>

                        <br />
                        <br />
                        {
                           userInfo?.authProvider === "system" && <button className={openPwdForm ? "bt9_cancel" : "bt9_edit"} onClick={() => setOpenPwdForm(e => !e)}>
                              {openPwdForm ? "Cancel" : "Change Password"}
                           </button>
                        }</>
               }

               {
                  openPwdForm && <form className='p-3' onSubmit={handlePassword}>
                     <div className="row">
                        <div className="col-lg-6">
                           <div className="p-1">
                              <label htmlFor="oldPassword">Old Password <span style={{ color: "red" }}>*</span> </label> <br />
                              <input
                                 className='form-control form-control-sm'
                                 type="password"
                                 name="oldPassword"
                                 id="oldPassword"
                                 placeholder='Enter your old password...'
                              />
                           </div>
                        </div>

                        <div className="col-lg-6">
                           <div className="p-1">
                              <label htmlFor="newPassword">Set New Password <span style={{ color: "red" }}>*</span></label>
                              <br />
                              <input
                                 className='form-control form-control-sm'
                                 type="password"
                                 name="newPassword"
                                 id="newPassword"
                                 placeholder='Enter new password...'
                              />
                           </div>
                        </div>
                     </div>
                     <button type='submit' className='bt9_edit'>Update Password</button>
                  </form>
               }


            </div>
         </div>
      </div>
   );
};

export default Profile;