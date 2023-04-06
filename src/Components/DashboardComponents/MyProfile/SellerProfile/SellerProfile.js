import React from 'react';

const SellerProfile = ({ userInfo, role }) => {

   return (
      <div className="col-12">
         <div className="card_default">
            <div className="card_description">
               <div className="profile_header">
                  <h6>Seller Information</h6>

                  {
                     (role === 'SELLER') && <div className='ph_i'>
                        <span>Balance : {userInfo?.total_earn || 0}&nbsp;$</span>
                        <button className='bt9_withdraw'>Withdraw</button>
                     </div>
                  }
               </div>
               <article>
                  <address>
                     <pre>
                        <p><strong>Store Name          : </strong>{userInfo?.seller?.storeInfos?.storeName}<span className="text-muted">(Not Changeable)</span></p>
                        <p><strong>Email Address       : </strong>{userInfo?.email}</p>
                        <p><strong>Area                : </strong>{userInfo?.seller?.address?.area}</p>
                        <p><strong>District            : </strong>{userInfo?.seller?.address?.city}</p>
                        <p><strong>Division            : </strong>{userInfo?.seller?.address?.division}</p>
                        <p><strong>Country             : </strong>{userInfo?.seller?.address?.country}</p>
                        <p><strong>Postal Code         : </strong>{userInfo?.seller?.address?.postal_code}</p>
                        <p><strong>Registered Phone    : </strong>{userInfo?.phone}</p>
                     </pre>
                  </address>
                  <div>
                     <pre>
                        <p><strong>Total Product       : </strong>{(userInfo?.seller?.storeInfos?.numOfProducts) || 0}&nbsp;Pcs</p>
                        <p><strong>In Draft            : </strong>{(userInfo?.seller?.storeInfos?.productInDraft) || 0}&nbsp;Pcs</p>
                        <p><strong>In Fulfilled        : </strong>{(userInfo?.seller?.storeInfos?.productInFulfilled) || 0}&nbsp;Pcs</p>
                        <p><strong>Total Earn          : </strong>{userInfo?.seller?.earn || 0}&nbsp;Tk</p>
                        <p><strong>Total Sold Product  : </strong>{userInfo?.seller?.totalSell || 0}&nbsp;Items</p>
                     </pre>
                  </div>
               </article>
            </div>
         </div>
      </div>
   );
};

export default SellerProfile;