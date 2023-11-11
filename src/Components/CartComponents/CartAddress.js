import { apiHandler } from '@/Functions/common';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import React, { useState } from 'react';
import Spinner from '../../Components/Shared/Spinner/Spinner';


const CartAddress = ({ refetch, addr, setMessage }) => {
   const [loading, setLoading] = useState(false);

   const selectAddressHandler = async (id, active) => {
      try {
         setLoading(true);

         const data = await apiHandler(`/user/customer/shipping-address-select`, "POST", { id, active });

         if (data.message) {
            setLoading(false);
            setMessage(data?.message, "success");
            refetch();
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

   if (loading) {
      return <Spinner />
   }
   else {
      return (
         <div className="py-2">
            <h6 className=''>Shipping Address</h6>
            <hr />
            <div className="row">
               {
                  Array.isArray(addr) ? addr.map(addrs => {

                     const { id, name, division, city, phoneNumber, postalCode, landmark, active } = addrs;

                     return (
                        <div className="col-lg-6" key={id}>
                           <div className={`row shipping_address_card ${active ? "selected" : ""}`}>
                              <div className="col-12">
                                 <address>
                                    <div className="address_card">
                                       {
                                          <div style={{ wordBreak: "break-word" }} className={`${active ? '' : 'text-muted'}`}>
                                             <small><b className='me-3'>{name}</b>{active && <FontAwesomeIcon icon={faCheckCircle} />}</small>
                                             <p>
                                                <small>{division}, {city}, {postalCode}</small> <br />
                                                <small>{landmark}</small> <br />
                                                <small>Phone : {phoneNumber}</small> <br />
                                                {active === true &&
                                                   <small style={{ color: "gray", letterSpacing: "1px", fontWeight: 400, textTransform: "uppercase" }}>
                                                      Default Shipping Address
                                                   </small>
                                                }
                                             </p>
                                          </div>
                                       }


                                       <div className="d-flex align-items-center flex-row justify-content-start gap-3 py-1">
                                          <button className='bt9_trans'
                                             onClick={() => setOldShipAddrs(addrs)}>
                                             Edit
                                          </button>

                                          <button title='Delete this address!'
                                             onClick={() => deleteAddressHandler(id)}
                                             className="bt9_trans">
                                             Delete
                                          </button>

                                          <button
                                             title={active ? "Default shipping address." : 'Select as a default shipping address.'}
                                             className='bt9_trans_alt px-1' onClick={() => selectAddressHandler(id, active)}>
                                             {active ? "Unselect" : "Set As Default"}
                                          </button>

                                       </div>
                                    </div>

                                 </address>
                              </div>

                           </div>
                        </div>

                     )
                  })
                     : <div className="col-12">
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