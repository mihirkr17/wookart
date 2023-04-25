import React from 'react';
import { useState } from 'react';
import UpdateForm from './Components/UpdateForm';
import { useEffect } from 'react';

import { useRouter } from 'next/router';
import { useAuthContext } from '@/lib/AuthProvider';
import SellerProfile from './SellerProfile/SellerProfile';
import { apiHandler } from '@/Functions/common';
import AdminProfile from './AdminProfile/AdminProfile';


const MyProfile = () => {
   const { role, userInfo, authRefetch } = useAuthContext();
   const [openEdit, setOpenEdit] = useState(false);
   const [actionLoading, setActionLoading] = useState(false);
   const router = useRouter();
   const queryParams = new URLSearchParams(window && window.location.search).get("update");
   const [inputValue, setInputValue] = useState({
      country: "",
      division: "",
      district: "",
      thana: "",
      dob: ""
   });

   let age = new Date().getFullYear() - (userInfo?.dob && parseInt((userInfo?.dob).split("-")[0]));

   useEffect(() => {
      if (queryParams === userInfo?._id) {
         setOpenEdit(true);
      } else {
         setOpenEdit(false);
      }
   }, [queryParams, userInfo?._id]);

   // common function for updating single value
   const updateDocHandler = async (e) => {
      e.preventDefault();
      setActionLoading(true);

      let data = {
         country: inputValue.country || "Not Set",
         division: inputValue.division || "Not Set",
         district: inputValue.district || "Not Set",
         thana: inputValue.thana || "Not Set",
         dob: inputValue.dob || "Not Set"
      }

      const { success, message } = await apiHandler(`/user/update-profile-data?userEmail=${userInfo?.email}`, "PUT", data);

      if (success) {
         setActionLoading(false);
         authRefetch();
         // setInputValue({});
      }
   }

   return (
      <div className='section_default my_profile'>
         <div className="container">

            <div className="row">
               {
                  role === "ADMIN" && <AdminProfile userInfo={userInfo}></AdminProfile>
               }

               {
                  role === 'SELLER' && <SellerProfile userInfo={userInfo} />
               }

               {

                  // <div className="col-12">
                  //    <div className='tty_ssd'>
                  //       {openEdit ? "Edit Information" : "Personal Information"}
                  //       {
                  //          openEdit ? <button className='bt9_edit' onClick={() => router.push(`/dashboard/my-profile`)}>Cancel</button> :
                  //             <button className='bt9_edit' onClick={() => router.push(`/dashboard/my-profile?update=${userInfo?._id}`)}>Edit</button>
                  //       }
                  //    </div>


                  //    <div className="pb-3">
                  //       {
                  //          openEdit && <UpdateForm
                  //             inputValue={inputValue}
                  //             setInputValue={setInputValue}
                  //             userInfo={userInfo}
                  //             actionLoading={actionLoading}
                  //             updateDocHandler={updateDocHandler}
                  //          />

                  //       }
                  //    </div>

                  // </div>
               }
            </div>
         </div>
      </div>
   );
};

export default MyProfile;