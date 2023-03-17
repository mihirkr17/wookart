// CartPayment.js

import React from 'react';


const CartPayment = ({ buyBtnHandler, isStock, step, isAddress, CardElement, orderLoading, confirmLoading, totalAmount }) => {

   return (
      <div className='p-1 d-flex align-items-center flex-column'>
         <h6>Pay With Card</h6>
         <form style={{
            width: "100%"
         }} onSubmit={buyBtnHandler}>
            <div className="py-4">
               <CardElement
                  options={{
                     style: {
                        base: {
                           iconColor: '#c4f0ff',
                           color: '#000',
                           fontWeight: '500',
                           fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
                           fontSize: '16px',
                           fontSmoothing: 'antialiased',
                           ':-webkit-autofill': {
                              color: '#fce88',
                           },
                           '::placeholder': {
                              color: '#87BBFG',
                           },
                        },
                        invalid: {
                           color: '#9e2146',
                        }
                     }
                  }}
               />
            </div>
            {
               !isAddress && <p>Please select shipping address.</p>
            }

            <button className='bt9_checkout' disabled={(isStock && isAddress) ? false : true} type='submit'>
               {
                  orderLoading ? "Paying..." : confirmLoading ? "Confirming...." : "Pay Now " + parseInt(totalAmount) + " Tk"
               }
            </button>
         </form>
      </div>
   );
};

export default CartPayment;