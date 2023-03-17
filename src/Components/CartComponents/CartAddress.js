import { apiHandler } from '@/Functions/common';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useState } from 'react';
import Spinner from '../../Components/Shared/Spinner/Spinner';


const CartAddress = ({ authRefetch, addr, setMessage }) => {
   const [loading, setLoading] = useState(false);

   const selectAddressHandler = async (addressId, selectAddress) => {
      try {
         setLoading(true);

         const data = await apiHandler(`/user/shipping-address-select`, "POST", { addrsID: addressId, default_shipping_address: selectAddress });

         if (data.message) {
            setLoading(false);
            setMessage(data?.message, "success");
            authRefetch();
         } else {
            setLoading(false);
            setMessage(data?.message, "danger");
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      } finally {
         setLoading(false);
      }
   }

   if (loading) { return <Spinner /> } else {
      return (
         <div className="py-2">
            <h6 className=''>Shipping Address</h6>
            <hr />
            <div className="row">
               {
                  addr ? addr.map(addrs => {
                     const { addrsID, name, division, city, phone_number, postal_code, landmark, default_shipping_address } = addrs;

                     return (
                        <div className="col-lg-6" key={addrsID}>
                           <div className={`row shipping_address_card ${default_shipping_address ? "selected" : ""}`}>
                              <div className="col-10">
                                 <address title={default_shipping_address ? "Default shipping address." : 'Select as a default shipping address.'} onClick={() => selectAddressHandler(addrsID, default_shipping_address)}>
                                    <div className="address_card">
                                       {
                                          <div style={{ wordBreak: "break-word" }} className={`${default_shipping_address ? '' : 'text-muted'}`}>
                                             <small><b className='me-3'>{name}</b>{default_shipping_address && <FontAwesomeIcon icon={faCheckCircle} />}</small>
                                             <p>
                                                <small>{division}, {city}, {postal_code}</small> <br />
                                                <small>{landmark}</small> <br />
                                                <small>Phone : {phone_number}</small> <br />
                                                {
                                                   default_shipping_address === true &&
                                                   <span className="badge bg-danger">
                                                      Default Shipping Address
                                                   </span>
                                                }
                                             </p>
                                          </div>
                                       }
                                    </div>
                                 </address>
                              </div>
                           </div>
                        </div>

                     )
                  }) : <div className="col-12">
                     <Link href="/user/my-account/address-book" title="Insert Your Address"
                        className="btn mb-3">
                        Insert Your Address
                     </Link>
                  </div>
               }
            </div>
         </div>
      );
   }
};

export default CartAddress;