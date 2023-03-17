import React from 'react';

const AddressForm = ({ setOpenAddressForm, addAddressHandler }) => {
   return (
      <div className="address_edit_form">
         <div className="d-flex align-items-center justify-content-between flex-wrap py-2">
            <strong>Add Shipping Address</strong>
            <button className='badge bg-danger' onClick={() => setOpenAddressForm(false)}>Cancel</button>
         </div>

         <form onSubmit={addAddressHandler}>
            <div className="row">
               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="name">Name</label>
                     <input type="text" className='form-control form-control-sm' name='name' required />
                  </div>
               </div>

               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="street">Street</label>
                     <input type="text" className='form-control form-control-sm' name='street' required />
                  </div>
               </div>

               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="district">District</label>
                     <input type="text" className='form-control form-control-sm' name='district' required />
                  </div>
               </div>

               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="state">State</label>
                     <input type="text" className='form-control form-control-sm' name='state' required />
                  </div>
               </div>

               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="country">Country</label>
                     <input type="text" className='form-control form-control-sm' name='country' required />
                  </div>
               </div>

               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="pinCode">Pin Code</label>
                     <input type="text" className='form-control form-control-sm' name='pinCode' required />
                  </div>
               </div>

               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="phoneNumber">Phone</label>
                     <input type="number" className='form-control form-control-sm' name='phoneNumber' required />
                  </div>
               </div>

               <div className="col-lg-6">
                  <div className="form-group my-1">
                     <label htmlFor="altPhoneNumber">Alternative Phone</label>
                     <input type="number" className='form-control form-control-sm' name='altPhoneNumber' required />
                  </div>
               </div>

            </div>
            <div className="form-group my-1">
               <button className='btn btn-primary btn-sm' type='submit'>Add Address</button>
            </div>
         </form>
      </div>
   );
};

export default AddressForm;