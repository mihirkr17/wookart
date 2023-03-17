import React from 'react';

const CartHeader = ({ user }) => {
   return (
      <div className="cart_card">
         <h6>Login Details</h6>
         <hr />
         <div className="row">
            <div className="col-lg-12">
               
               <small>Email : {user?.email} <br /> Username : {user?.username}</small>
            </div>
         </div>
      </div>
   );
};

export default CartHeader;