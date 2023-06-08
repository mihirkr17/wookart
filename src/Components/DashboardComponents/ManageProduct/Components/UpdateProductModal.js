import React, { useState } from 'react';
import { useBaseContext } from '../../../../lib/BaseProvider';
import ModalWrapper from '@/Components/Global/ModalWrapper';
import { CookieParser } from '@/Functions/common';
import dynamic from 'next/dynamic';

const Ckeditor = dynamic(() => import('../../../Shared/Ckeditor'), { ssr: false });


const UpdateProductModal = ({ data, closeModal, refetch }) => {
   const { setMessage } = useBaseContext();

   const [description, setDescription] = useState(data?.description ?? "Edit description");

   const required = <span style={{ color: "red" }}>*</span>;

   async function handleAPI(uri = "", action = "", body = {}) {
      try {
         const { appSession } = CookieParser();
         const url = `${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/dashboard/seller/store/product/update-product`;
         body["listingID"] = data?._lid;
         body["productID"] = data?._id;
         body["actionType"] = action;

         const response = await fetch(url + uri, {
            method: "POST",
            withCredentials: true,
            credentials: "include",
            headers: {
               "Content-Type": "application/json",
               authorization: `Bearer ${appSession || ""}`
            },
            body: JSON.stringify(body)
         });

         const { success, message } = await response.json();

         if (success) {
            setMessage(message, "success");
            refetch();
            return { success };
         } else {
            return {
               error: { message }
            }
         }
      } catch (error) {
         return error;
      }
   }

   const handlePricing = async (e) => {
      try {
         e.preventDefault();
         let price = e.target.price.value;
         let sellingPrice = e.target.sellingPrice.value;

         if (price === "" || sellingPrice === "") {
            return setMessage("Required price and selling price !");
         }

         const { error } = await handleAPI("/pricing", "PRICING", {
            pricing: {
               price: parseInt(price), sellingPrice: parseInt(sellingPrice)
            }
         });


         if (error) {
            setMessage(error?.message, "danger");
         }

      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }

   const handleShipping = async (e) => {
      try {
         e.preventDefault();

         let fulfilledBy = e.target.fulfilledBy.value;
         let procurementType = e.target.procurementType.value;
         let procurementSLA = e.target.procurementSLA.value;
         let provider = e.target.shippingProvider.value;
         let isFree = e.target.isFree.checked;


         if (procurementType === "" || fulfilledBy === "" || procurementSLA === "") {
            return setMessage("Required price and selling price !");
         }

         const { error } = await handleAPI("/shipping-information", "SHIPPING-INFORMATION", {
            shipping: {
               fulfilledBy,
               procurementType,
               procurementSLA,
               provider,
               isFree
            }
         });

         if (error) {
            setMessage(error?.message, "danger");
         }

      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }

   async function handlePackageDimension(e) {
      try {
         e.preventDefault();

         let formData = new FormData(e.currentTarget);
         formData = Object.fromEntries(formData.entries());

         const { error } = await handleAPI("/packaged-dimension", "PACKAGE-DIMENSION", {
            packageInfo: formData
         });

         if (error) {
            setMessage(error?.message, "danger");
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }

   async function handleManufacturer(e) {
      try {
         e.preventDefault();

         let formData = new FormData(e.currentTarget);
         formData = Object.fromEntries(formData.entries());

         const { error } = await handleAPI("/manufacturer-information", "MANUFACTURER-INFORMATION", {
            manufacturer: formData
         });

         if (error) {
            setMessage(error?.message, "danger");
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }


   async function handleDescription(e) {
      try {
         e.preventDefault();

         const { error } = await handleAPI("/description", "DESCRIPTION-INFORMATION", {
            description
         });

         if (error) {
            setMessage(error?.message, "danger");
         }
      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }

   return (
      <ModalWrapper closeModal={closeModal}>

         {/* Product pricing form  */}
         <div className='p-3 handle_pricing'>
            <b>Pricing Information</b> <br />
            <form action="" className='form' onSubmit={handlePricing}>
               <div className="row">
                  <div className="col-lg-6 py-2">
                     <label htmlFor="price">Price</label>
                     <input className='form-control form-control-sm' type="text" name="price" id='price' defaultValue={data?.pricing?.price} />
                  </div>

                  <div className="col-lg-6 py-2">
                     <label htmlFor="sellingPrice">Selling Price</label>
                     <input className='form-control form-control-sm' type="text" name="sellingPrice" id="sellingPrice" defaultValue={data?.pricing?.sellingPrice} />
                  </div>
               </div>
               <button className='bt9_edit'>Update Price</button>
            </form>
         </div>

         <hr />

         <div className="p-3 handle_shipping">
            <b>Shipping Information</b> <br />
            <form onSubmit={handleShipping}>
               <div className="row">

                  <div className="col-lg-3 py-2">
                     <label htmlFor="fulfilledBy">{required} Fulfillment By</label>
                     <select name="fulfilledBy" id="fulfilledBy" className='form-select form-select-sm'>
                        <option value={data?.shipping?.fulfilledBy || ""}>{data?.shipping?.fulfilledBy || "Select One"}</option>
                        <option value="wooKart">WooKart</option>
                        <option value="seller">Seller</option>
                        <option value="smart-seller">Seller Smart</option>
                     </select>
                  </div>

                  <div className="col-lg-3 py-2">
                     <label htmlFor="procurementType">{required} Procurement Type</label>
                     <select name="procurementType" id="procurementType" className='form-select form-select-sm'>
                        <option value={data?.shipping?.procurementType || ""}>{data?.shipping?.procurementType || "Select One"}</option>
                        <option value="instock">Instock</option>
                        <option value="express">Express</option>
                     </select>
                  </div>

                  <div className="col-lg-3 py-2">
                     <label htmlFor="procurementSLA">{required} Procurement SLA</label>
                     <input type={'number'} name="procurementSLA" id="procurementSLA" className='form-control form-control-sm'
                        defaultValue={data?.shipping?.procurementSLA || 0} />
                  </div>
                  <div className='col-lg-3 py-2'>
                     <label htmlFor='shippingProvider'>{required} Shipping Provider</label>
                     <select name="shippingProvider" id="shippingProvider" className='form-select form-select-sm'>
                        <option value={data?.shipping?.provider || ""}>{data?.shipping?.provider || "Select One"}</option>
                        <option value="wooKart">WooKart</option>
                        <option value="seller">Seller</option>
                        <option value="seller-wooKart">Seller And WooKart</option>
                     </select>
                  </div>
               </div>
               <div className="py-2">
                  <label htmlFor="isFree">
                     Free Shipping &nbsp;
                     <input type="checkbox" name="isFree" id="isFree" defaultChecked={data?.shipping?.isFree ? true : false} />
                  </label>
               </div>

               <button className='bt9_edit'>Update Shipping Information</button>
            </form>
         </div>

         <hr />

         <div className="p-3 handle_package">
            <b>Package Information</b> <br />

            <form onSubmit={handlePackageDimension}>
               <div className="row ">

                  <div className="col-lg-3 col-sm-6 mb-2">
                     <label htmlFor="packageWeight">Weight (kg)</label>
                     <input className='form-control form-control-sm' type="text" id='packageWeight' name="packageWeight"
                        defaultValue={(data?.packaged?.weight) || ""} />
                  </div>
                  <div className="col-lg-3 col-sm-6 mb-2">
                     <label htmlFor="packageLength">Length (cm)</label>
                     <input className='form-control form-control-sm' type="text" id='packageLength' name='packageLength'
                        defaultValue={(data?.packaged?.dimension?.length) || ""} />
                  </div>
                  <div className="col-lg-3 col-sm-6 mb-2">
                     <label htmlFor="packageWidth">Width (cm)</label>
                     <input className='form-control form-control-sm' type="text" id='packageWidth' name='packageWidth'
                        defaultValue={(data?.packaged?.dimension?.width) || ""} />
                  </div>
                  <div className="col-lg-3 col-sm-6 mb-2">
                     <label htmlFor="packageHeight">Height (cm)</label>
                     <input className='form-control form-control-sm' type="text" id='packageHeight' name='packageHeight'
                        defaultValue={((data?.packaged?.dimension?.height) || "") || ""} />
                  </div>
                  <div className='col-lg-12 mb-3'>
                     <label htmlFor='inTheBox'>{required} What is in the box</label>
                     <input className='form-control form-control-sm' name="inTheBox" id='inTheBox' type="text"
                        defaultValue={(data?.packaged?.inTheBox || "")} placeholder="e.g: 1 x hard disk" />
                  </div>

               </div>

               <button className='bt9_edit'>Update Package Information</button>
            </form>
         </div>

         <hr />

         <div className="p-3 handle_manufacturer">
            <b>Manufacturer Information</b> <br />

            <form onSubmit={handleManufacturer}>
               <div className="row">
                  <div className="col-lg-3 py-2">
                     <label htmlFor="manufacturerOrigin">{required} Country Of Origin</label>
                     <select name="manufacturerOrigin" id="manufacturerOrigin" className='form-select form-select-sm'>
                        <option value={data?.manufacturer?.origin || ''}>{data?.manufacturer?.origin || 'Select Origin'}</option>
                        <option value="bangladesh">Bangladesh</option>
                        <option value="india">India</option>
                        <option value="china">China</option>
                     </select>
                  </div>

                  <div className="col-lg-3 py-2">
                     <label htmlFor="manufacturerDetails">Manufacturer Details</label>
                     <input type="text" className='form-control form-control-sm' name='manufacturerDetails' id='manufacturerDetails'
                        defaultValue={data?.manufacturer?.details || ''}
                     />
                  </div>
               </div>

               <button className='bt9_edit' type='submit'>Update Manufacture Information</button>
            </form>
         </div>

         <hr />

         <div className="p-3 handle_description">
            <b>Manufacturer Information</b> <br />

            <form onSubmit={handleDescription}>
               <div className="input_group">
                  <label htmlFor=""></label>
                  <Ckeditor description={description} setDescription={setDescription} />
               </div>

               <div className="input_gro">
                  <button className='bt9_edit'>Update Description</button>
               </div>
            </form>
         </div>

      </ModalWrapper >
   );
};

export default UpdateProductModal;