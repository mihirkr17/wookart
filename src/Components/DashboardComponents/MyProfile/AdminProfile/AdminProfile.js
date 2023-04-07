import React from 'react';

export default function AdminProfile({ userInfo }) {
   return (
      <div className='col-12'>
         <div className="card_default">
            <div className="card_description">
               <div className="profile_header">
                  <h6>Admin Information</h6>
               </div>

               <article>
                  <address>
                     <pre>
                        <p><strong>Full Name           : </strong>{userInfo?.fullName}<span className="text-muted">(Not Changeable)</span></p>
                        <p><strong>Email Address       : </strong>{userInfo?.email}</p>
                        <p><strong>DOB                 : </strong>{userInfo?.dob}</p>
                        <p><strong>Registered Phone    : </strong>{userInfo?.phone}</p>
                     </pre>
                  </address>
               </article>
            </div>
         </div>
      </div>
   );
};