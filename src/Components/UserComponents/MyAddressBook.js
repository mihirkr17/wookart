import React from 'react';
import { faCheckCircle, faPlus, faPenAlt, faClose, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuthContext } from '@/lib/AuthProvider';
import { addressBook } from '@/CustomData/addressBook';
import { apiHandler } from '@/Functions/common';
import Spinner from '../Shared/Spinner/Spinner';


const MyAddressBook = () => {
   const { authRefetch, userInfo, setMessage } = useAuthContext();
   const [newShipAddrs, setNewShipAddrs] = useState(false);
   const [oldShipAddrs, setOldShipAddrs] = useState(false);
   const [newDivision, setNewDivision] = useState({});
   const [newCity, setNewCity] = useState({});
   const [address, setAddress] = useState({});
   const addr = userInfo?.buyer?.shippingAddress && userInfo?.buyer?.shippingAddress;
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      if (oldShipAddrs) {
         setAddress(oldShipAddrs);
      } else {
         setAddress({
            name: "",
            division: "",
            city: "",
            area: "",
            area_type: "",
            landmark: "",
            phone_number: 0,
            postal_code: 0,
            default_shipping_address: false
         })
      }

   }, [oldShipAddrs]);


   useEffect(() => {
      setNewDivision(Array.isArray(addressBook?.division) && addressBook?.division.find(e => e.name === address?.division));
      setNewCity(Array.isArray(newDivision?.city) && newDivision?.city.find(e => e?.name === address?.city))
   }, [address?.division, address?.city, newDivision?.city]);

   function addressHandler(e) {
      let { name, value } = e.target;
      setAddress({ ...address, [name]: value });
   }

   function closeAddressForm() {
      setNewShipAddrs(false);
      setOldShipAddrs(false);
   }

   const addAddressHandler = async (e) => {
      e.preventDefault();

      if (e.type === "submit") {

         address['area_type'] = newDivision?.area_type || address?.area_type;

         if (oldShipAddrs?.addrsID) {
            address['addrsID'] = oldShipAddrs?.addrsID;
         }

         const data = await apiHandler(`/user/shipping-address`, oldShipAddrs?.addrsID ? "PUT" : "POST", address);

         if (data.success) {
            closeAddressForm();
            setMessage(data?.message, "success");
            await authRefetch();
         } else {
            setMessage(data?.message, "danger");
         }
      }
   }


   const selectAddressHandler = async (addrsID, selectAddress) => {
      setLoading(true);

      const data = await apiHandler(`/user/shipping-address-select`, "POST", { addrsID, default_shipping_address: selectAddress });

      if (data.success) {
         setLoading(false);
         await authRefetch();
         setMessage(data?.message, "success");
      } else {
         setLoading(false);
         setMessage(data?.message, "danger");
      }
   }

   // delete shipping address form account.
   const deleteAddressHandler = async (addressId) => {
      if (window.confirm("Want to remove address ?")) {
         const data = await apiHandler(`/user/shipping-address-delete/${addressId}`, "DELETE");

         if (data.success) {
            setMessage(data?.message, "success");
            await authRefetch();
            return;
         } else {
            setMessage(data?.message, "danger");
         }
      }
   }

   if (loading) return <Spinner></Spinner>;

   return (
      <div className="row">
         <div className="col-lg-12">
            <div className="d-flex align-items-center justify-content-between flex-wrap w-100">
               <h6 className=''>Shipping Address</h6>
               <button onClick={() => setNewShipAddrs((Array.isArray(addr) && addr.length < 2) ? true : false)} title="Add New Address" className="bt9_edit ms-2">
                  <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>&nbsp; Add new address
               </button>

            </div>
            <hr />
            <div className="py-2">
               {
                  (newShipAddrs || oldShipAddrs) ?
                     <div className="p-1">
                        <form onSubmit={addAddressHandler}>

                           <div className="row">
                              <div className="col-lg-6">
                                 <div className="form-group my-1">
                                    <label htmlFor="name">Full Name</label>
                                    <input type="text" value={address?.name || ""} className='form-control form-control-sm' name='name' id='name' required onChange={(e) => addressHandler(e)} />
                                 </div>
                              </div>

                              <div className="col-lg-6">
                                 <div className="form-group my-1">
                                    <label htmlFor="phone_number">Phone Number</label>
                                    <input type="number" value={address?.phone_number || ""} className='form-control form-control-sm' name='phone_number' id='phone_number' required onChange={(e) => addressHandler(e)} />
                                 </div>
                              </div>

                              <div className="col-lg-6">
                                 <div className="form-group my-1">
                                    <label htmlFor="division">Division</label>
                                    <select name="division" className='form-select form-select-sm' id="division" onChange={(e) => addressHandler(e)}>

                                       <option value={address?.division || ""}>{address?.division || "Select Division"}</option>
                                       {
                                          addressBook?.division && addressBook?.division.map((item, index) => {
                                             return (
                                                <option value={item?.name} key={index}>{item?.name}</option>
                                             )
                                          })
                                       }
                                    </select>
                                 </div>
                              </div>

                              <div className="col-lg-6">
                                 <div className="form-group my-1">
                                    <label htmlFor="city">City</label>
                                    <select className='form-select form-select-sm' name="city" id="city" onChange={(e) => addressHandler(e)}>
                                       <option value={address?.city || ""}>{address?.city || "Select City"}</option>
                                       {
                                          Array.isArray(newDivision?.city) && newDivision?.city.map((item, index) => {
                                             return (
                                                <option key={index} value={item?.name}>{item?.name}</option>
                                             )
                                          })
                                       }
                                    </select>
                                 </div>
                              </div>

                              <div className="col-lg-6">
                                 <div className="form-group my-1">
                                    <label htmlFor="area">Area</label>
                                    <select className='form-select form-select-sm' name="area" id="area" onChange={(e) => addressHandler(e)}>
                                       <option value={address?.area || ""}>{address?.area || "Select Area"}</option>
                                       {
                                          Array.isArray(newCity?.areas) && newCity?.areas.map((ar, ind) => {

                                             return (
                                                <option key={ind} value={ar}>{ar}</option>
                                             )
                                          })
                                       }
                                    </select>
                                 </div>
                              </div>

                              <div className="col-lg-6">
                                 <div className="form-group my-1">
                                    <label htmlFor="landmark">Landmark</label>
                                    <input value={address?.landmark || ""} type="text"
                                       className='form-control form-control-sm' name='landmark' id='landmark'
                                       required onChange={(e) => addressHandler(e)}
                                       placeholder="e.g: Beside Railway station."
                                    />
                                 </div>
                              </div>

                              <div className="col-lg-6">
                                 <div className="form-group my-1">
                                    <label htmlFor="postal_code">Postal Code</label>
                                    <input value={address?.postal_code || ""} type="number"
                                       className='form-control form-control-sm' name='postal_code' id='postal_code' required onChange={(e) => addressHandler(e)} />
                                 </div>
                              </div>

                              <div className="form-group my-1">
                                 <button className='bt9_edit me-2' type='submit'>{
                                    oldShipAddrs ? "Edit Address" : "Add Address"
                                 }</button>
                                 {
                                    <span className='bt9_cancel' title='Cancel' onClick={closeAddressForm}>
                                       Cancel
                                    </span>
                                 }
                              </div>
                           </div>
                        </form>
                     </div> :
                     <div className="row">
                        {
                           Array.isArray(addr) && addr.map(addrs => {
                        
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
                                       <div className="col-2 d-flex align-items-center flex-column justify-content-center">


                                          {
                                             (!oldShipAddrs) ?
                                                <button className='btn btn-sm'
                                                   style={oldShipAddrs === false ? { display: "block" } : { display: "none" }}
                                                   onClick={() => setOldShipAddrs(addrs)}>
                                                   {address && <FontAwesomeIcon icon={faPenAlt} />}
                                                </button> :
                                                <button className='btn btn-sm' title='Cancel'>
                                                   {<FontAwesomeIcon icon={faClose} />}
                                                </button>
                                          }

                                          <button title='Delete this address!' onClick={() => deleteAddressHandler(addrsID)} className="btn btn-sm mt-3">
                                             <FontAwesomeIcon icon={faTrashAlt}></FontAwesomeIcon>
                                          </button>
                                       </div>
                                    </div>
                                 </div>

                              )
                           })
                        }
                        {
                           Array.isArray(addr) && addr.length === 0 && <>
                              <div className="col-12">
                                 <button onClick={() => setNewShipAddrs(true)} title="Insert Your Address" className="btn mb-3">
                                    Insert Your Address
                                 </button>
                              </div>
                           </>
                        }
                     </div>
               }

            </div>
         </div>
      </div>
   );
};

export default MyAddressBook;