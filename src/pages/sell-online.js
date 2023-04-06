import { sellerAddressBook } from "@/CustomData/sellerAddressBook";
import { apiHandler, slugMaker } from "@/Functions/common";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import { useAuthContext } from "@/lib/AuthProvider";
import { useEffect, useState } from "react";


export default withOutDashboard(function SellOnline() {
   const { setMessage } = useAuthContext();
   const [inputs, setInputs] = useState({
      email: "",
      password: "",
      phone: "",
      fullName: ""
   });
   const [address, setAddress] = useState({
      country: "",
      division: "",
      city: "",
      area: "",
      landmark: "",
      postal_code: 0,
   });
   const [sellerInputs, setSellerInputs] = useState({
      taxId: "",
      storeInfos: {
         storeName: "",
         storeLicense: ""
      }
   });

   const [storeInfo, setStoreInfo] = useState({
      storeName: "",
      storeLicense: ""
   });
   const [newCountry, setNewCountry] = useState({});
   const [newDivision, setNewDivision] = useState({});
   const [newCity, setNewCity] = useState({});

   const [regAlert, setRegAlert] = useState("");
   
   useEffect(() => {
      setNewCountry(Array.isArray(sellerAddressBook?.country) && sellerAddressBook?.country.find(e => e.name === address?.country));
      setNewDivision(Array.isArray(newCountry?.division) && newCountry?.division.find(e => e.name === address?.division));
      setNewCity(Array.isArray(newDivision?.city) && newDivision?.city.find(e => e?.name === address?.city))
   }, [address?.country, newCountry?.division, address?.division, address?.city, newDivision?.city]);




   async function handleSellerRequest(e) {
      e.preventDefault();

      sellerInputs['address'] = address;
      sellerInputs['storeInfos'] = storeInfo;
      inputs['seller'] = sellerInputs;


      if (window.confirm("Submit the form ?")) {

         const { success, message } = await apiHandler(`/user/register-new-seller`, "POST", inputs);

         if (success) {
            setRegAlert(message);
            return setMessage(message, 'success');
         }

         return setMessage(message, 'danger');
      }
   }

   return (
      <div className="section_default">
         <div className="container">
            <h5>Sell Online</h5>


            <div className="row">
               <div className="col-lg-4"></div>

               <div className="col-lg-8">

                  {
                     regAlert && <div className="py-3">
                        <p style={{ color: "green" }}>{regAlert}</p>
                     </div>
                  }


                  <div className="p-3">

                     <form onSubmit={handleSellerRequest} encType='multipart/form-data'>
                        <small><strong>Be a Seller ? Add your information below...</strong></small>

                        <div className="form-group my-1">
                           <label htmlFor="fullName">Full Name <span className='text-mute'>Not Changeable</span></label>
                           <input type="text" className="form-control" name='fullName' id='fullName' placeholder='Full Name' onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })} />
                        </div>

                        <div className="form-group my-1">
                           <label htmlFor="email">Email</label>
                           <input type="email" className="form-control" name='email' id='email' placeholder='Email address' onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })} />
                        </div>

                        <div className="form-group my-1">
                           <label htmlFor="password">Password</label>
                           <input type="password" className="form-control" name='password' id='password' placeholder='Password' onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })} />
                        </div>

                        <div className="form-group my-1">
                           <label htmlFor="taxId">Tax ID</label>
                           <input type="text" className="form-control" name='taxId' id='taxId' placeholder='Tax ID' onChange={e => setSellerInputs({ ...sellerInputs, [e.target.name]: e.target.value })} />
                        </div>

                        <div className="row">

                           <div className="col-lg-6">
                              <div className="form-group my-1">
                                 <label htmlFor="division">Country</label>
                                 <select name="country" className='form-select form-select-sm' id="country" onChange={(e) => setAddress({ ...address, [e.target.name]: e.target.value })}>

                                    <option value={address?.country || ""}>{address?.country || "Select Country"}</option>
                                    {
                                       Array.isArray(sellerAddressBook?.country) && sellerAddressBook?.country.map((item, index) => {
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
                                 <label htmlFor="division">Division</label>
                                 <select name="division" className='form-select form-select-sm' id="division" onChange={(e) => setAddress({ ...address, [e.target.name]: e.target.value })}>

                                    <option value={address?.division || ""}>{address?.division || "Select Division"}</option>
                                    {
                                       newCountry?.division && newCountry?.division.map((item, index) => {
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
                                 <select className='form-select form-select-sm' name="city" id="city" onChange={(e) => setAddress({ ...address, [e.target.name]: e.target.value })}>
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
                                 <select className='form-select form-select-sm' name="area" id="area" onChange={(e) => setAddress({ ...address, [e.target.name]: e.target.value })}>
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
                                 <input className='form-control form-control-sm' name="landmark" id="landmark" onChange={(e) => setAddress({ ...address, [e.target.name]: e.target.value })} />
                              </div>
                           </div>
                        </div>


                        <div className="form-group my-1">
                           <label htmlFor="phone">Phone</label>
                           <input type="text" className="form-control" name='phone' id='phone' placeholder='Phone number' onChange={e => setInputs({ ...inputs, [e.target.name]: e.target.value })} />
                        </div>

                        <div className="form-group my-1">
                           <label htmlFor="postal_code">Postal Code</label>
                           <input type="text" className="form-control" name='postal_code' id='postal_code' placeholder='Type pinCode' onChange={(e) => setAddress({ ...address, [e.target.name]: e.target.value })} />
                        </div>

                        <div className="row">
                           <div className="col-6">
                              <div className="form-group my-1">
                                 <label htmlFor="storeName">Store Name</label>
                                 <input type="text" className="form-control" name='storeName' id='storeName' placeholder='Type Store Name' onChange={(e) => setStoreInfo({ ...storeInfo, [e.target.name]: slugMaker(e.target.value) })} />
                              </div>
                           </div>
                           <div className="col-6">
                              <div className="form-group my-1">
                                 <label htmlFor="storeName">Store License</label>
                                 <input type="text" className="form-control" name='storeLicense' id='storeLicense' placeholder='Type Store License Number' onChange={(e) => setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })} />
                              </div>
                           </div>
                        </div>

                        <div className="card_default my-3">
                           <div className="card_description">
                              <p>
                                 <small className="text-muted">
                                    NB. If you want to become seller your role will be changed to seller and your existing cart & order
                                    information will be deleted from this account. <br />
                                    So we recommended to you, create new account first and become seller.
                                 </small>
                              </p>
                           </div>
                        </div>

                        <button type='submit' className='btn btn-sm btn-primary'>Submit</button>
                     </form>

                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}, [])