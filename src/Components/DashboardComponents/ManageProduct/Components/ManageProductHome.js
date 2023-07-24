import React, { useState } from 'react';
import DropDown from './DropDown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import ProductDetailsModal from './ProductDetailsModal';
import UpdateProductModal from './UpdateProductModal';
import ProductVariationModal from './ProductVariationModal';
import Link from 'next/link';
import useWindowDimensions from '@/Hooks/useWindowDimensions';
import { apiHandler } from '@/Functions/common';
import { useRouter } from 'next/router';

const ManageProductHome = (
   {
      refetch,
      setMessage,
      newCategory,
      role,
      counter,
      loading,
      manageProducts,
      setSearchValue,
      setFilterCategory,
      // counterRefetch,
      queryPage,
      items,
      pageBtn,
      location,
      Spinner,
      userInfo
   }
) => {
   const router = useRouter();
   const [productDetailModal, setProductDetailModal] = useState(false);
   const [openDropDown, setOpenDropDown] = useState("");
   const { windowWidth } = useWindowDimensions();
   const [updateProductForm, setUpdateProductForm] = useState(false);
   const [openProductVariationModal, setOpenProductVariationModal] = useState(false);

   const deleteProductVariationHandler = async (sku, pid) => {
      try {
         const { success, message } = await apiHandler(`/dashboard/seller/${userInfo?.store?.name}/product/delete-product-variation/${pid}/${sku}`,
            "DELETE");

         if (success) {
            setMessage(message, 'success');
            refetch();
            return;
         } else {
            return setMessage(message, 'danger');
         }
      } catch (error) {
         setMessage(error?.message, 'danger');
      }
   }


   const deleteThisProductHandler = async (_id, _lid, storeName) => {
      if (window.confirm("Want href delete this product ?")) {

         const { success, message } = await apiHandler(`/dashboard/${storeName}/product/delete-product/${_id}/${_lid}`, "DELETE");

         if (success) {
            refetch();
            return setMessage(message, 'success');
         } else {
            return setMessage(message, 'danger');
         }
      }
   }


   const stockHandler = async (e, productID, sku) => {
      const { value } = e.target;

      let available = parseInt(value);

      try {
         const { success, message } = await apiHandler(`/dashboard/seller/${userInfo?.store?.name}/product/update-stock`, "PUT", { productID, variations: { available, sku }, MARKET_PLACE: 'WooKart' });

         if (success) {
            refetch();
            setMessage(message, 'success');
            return
         } else {
            return setMessage(message, 'danger');
         }

      } catch (error) {
         setMessage(error?.message);
      }
   }


   async function productControlHandler(actionType, actionFor, mProduct) {
      try {

         if (!actionType || !actionFor || !mProduct) return;

         const { _lid, _id } = mProduct;

         const { success, message } = await apiHandler(`/dashboard/seller/${mProduct?.supplier?.store_name}/product-control`, "PUT", {
            market_place: 'wooKart',
            actionType,
            actionFor,
            listingID: _lid,
            productID: _id
         });

         if (success) {
            setMessage(message, "success");
            refetch();
            return;
         }

         return setMessage(message, "danger");
      } catch (error) {
         setMessage(error?.error, "danger");
      }
   }


   function openDropDownHandler(p) {

      if (p !== openDropDown) {
         setOpenDropDown(p);
      } else {
         setOpenDropDown('');
      }

   }


   function extractVariant(variants) {

      let items = [];

      for (const variant in variants) {
         if (variants.hasOwnProperty(variant)) {
            items.push(<span>
               <b>{variant}:&nbsp;</b>{variants[variant]?.split(",#")[0]} <br />
            </span>)
         }
      }

      return items
   }



   return (
      <>
         {
            openProductVariationModal &&
            <ProductVariationModal
               closeModal={() => setOpenProductVariationModal(false)}
               data={openProductVariationModal}
               refetch={refetch}
               userInfo={userInfo}
            />
         }
         {
            updateProductForm && <UpdateProductModal
               closeModal={() => setUpdateProductForm(false)}
               data={updateProductForm}
               setMessage={setMessage}
               refetch={refetch}
            />
         }
         <div className="product_header">

            <div className="d-flex justify-content-between align-items-center flex-wrap">
               <h5 className='py-3'>
                  {role === 'SELLER' ? "Active Products (" + manageProducts?.data?.products?.length + ")" :
                     "All Products (" + manageProducts?.data?.products?.length + ")"}
               </h5>

               <div className='py-3'>

                  <select name="filter_product" style={{ textTransform: "capitalize" }} className='form-select form-select-sm' onChange={e => setFilterCategory(e.target.value)}>
                     <option value="">All</option>
                     {
                        newCategory && newCategory.map((opt, index) => {
                           return (
                              <option value={opt?.category} key={index}>{opt?.category}</option>
                           )
                        })
                     }
                  </select>
               </div>

               <div className='py-3'>
                  <input type="search" className='form-control form-control-sm' placeholder='Search product by name...' onChange={(e) => setSearchValue(e.target.value)} />
               </div>
            </div>
         </div>

         {
            loading ? <Spinner /> :
               manageProducts?.data?.products && manageProducts?.data?.products.map((mProduct, index) => {
                  return (
                     <div className='border my-3 card_default card_description w-100' key={index}>

                        <div className={`p-1 d-flex justify-content-between flex-wrap`}>
                           <div className="p-1" style={{
                              display: "flex"
                           }}>

                              <div style={{ paddingLeft: "10px" }}>
                                 <small>
                                    <pre style={{ whiteSpace: 'break-spaces' }}>
                                       TITLE           : {mProduct?.title} <br />
                                       Product ID      : {mProduct?._id} <br />
                                       BRAND           : {mProduct?.brand} <br />
                                       CATEGORIES      : {mProduct?.categories && mProduct?.categories.join(" >> ")} <br />
                                       Total Variation : {(mProduct?.totalVariation && mProduct?.totalVariation) || 0} <br />
                                    </pre>
                                 </small>

                                 <button className={`${mProduct?.status === 'active' ? 'bt9_warning' : 'bt9_edit'}`}
                                    onClick={() => productControlHandler(mProduct?.status === 'active' ? "inactive" : 'active', "status", mProduct)}
                                 >
                                    {
                                       mProduct?.status === 'active' ? 'Inactive Now' : 'Active Now'
                                    }
                                 </button>
                                 <button className='bt9_primary ms-2' onClick={() => setProductDetailModal(true && mProduct)}>view</button>
                              </div>

                           </div>

                           <div className={`dropdown`} style={windowWidth <= 567 ? { width: '100%' } : { width: 'unset' }}>

                              <button className='dropdown-toggle' style={{ border: 'none', background: 'transparent' }} type="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={() => openDropDownHandler(mProduct)}>
                                 Option
                              </button>

                              {
                                 <DropDown mProduct={mProduct}
                                    openDropDown={openDropDown}
                                    FontAwesomeIcon={FontAwesomeIcon}
                                    faPenToSquare={faPenToSquare}
                                    location={location} productControlHandler={productControlHandler}
                                    setUpdateProductForm={setUpdateProductForm}
                                    setOpenProductVariationModal={setOpenProductVariationModal}
                                    router={router}
                                 ></DropDown>
                              }
                           </div>

                        </div>

                        <div className="table-responsive">
                           <table className='table'>
                              <thead>
                                 <tr>
                                    <th>Product</th>
                                    <th>Meta Info</th>
                                    <th>Brand Color</th>
                                    <th>Variant</th>
                                    <th>Pricing</th>
                                    <th>Availability (Pcs)</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {
                                    mProduct?.variations ? mProduct?.variations.map(variation => {
                             
                                       return (
                                          <tr key={variation?.sku}>
                                             <td>
                                                <img src={(variation?.images && variation?.images[0]) || ""} style={{ objectFit: "contain" }} width="40" height="40" alt="" />
                                             </td>
                                             <td>
                                                <small><b>SKU:</b>&nbsp;{variation?.sku}</small>
                                             </td>
                                             <td>
                                                <small style={{ wordBreak: "break-all" }}>{variation?.brandColor}</small>
                                             </td>
                                             <td>
                                                <small>{
                                                   extractVariant(variation?.variant)
                                                }</small>
                                             </td>
                                             <td>
                                                <small><b>Base:</b>&nbsp;{variation?.pricing?.price} Tk</small> <br />
                                                <small><b>Selling:</b>&nbsp;{variation.pricing.sellingPrice} Tk</small>
                                             </td>
                                             <td>
                                                {
                                                   role === 'SELLER' ?
                                                      <input type="text" style={{ width: "50px", border: "1px solid black", padding: "0 2px", backgroundColor: "inherit" }}
                                                         onBlur={(e) => stockHandler(e, mProduct?._id, variation?.sku)}
                                                         defaultValue={variation?.available}
                                                         readOnly onDoubleClick={e => e.target.readOnly = false} /> :
                                                      variation?.available

                                                }
                                             </td>
                                             <td>{variation?.stock}</td>
                                             <td>

                                                <button className='btn btn-sm m-1' onClick={() => setOpenProductVariationModal(
                                                   {
                                                      variations: variation,
                                                      categories: mProduct?.categories,
                                                      listingID: mProduct?._lid,
                                                      _id: mProduct?._id,
                                                      title: mProduct?.title,
                                                      formType: "update-variation"
                                                   }
                                                )}>
                                                   {/* Update Variation */}
                                                   <FontAwesomeIcon icon={faPenToSquare} />
                                                </button>

                                                {
                                                   mProduct?.variations && mProduct?.variations.length >= 2 && <button className='btn btn-sm m-1' title={`Delete ${mProduct?.title}`}
                                                      onClick={() => deleteProductVariationHandler(variation?.sku, mProduct?._id)}>
                                                      <FontAwesomeIcon icon={faTrashAlt} />
                                                   </button>
                                                }
                                             </td>
                                          </tr>
                                       )
                                    }) : <tr><td>No product in your drafts</td></tr>
                                 }
                              </tbody>
                           </table>
                        </div>
                     </div>
                  );
               }
               )
         }


         <div className="py-3 text-center pagination_system">
            <ul className='pagination justify-content-center pagination-sm'>
               {queryPage >= 2 && <li className='page-item'><Link className='page-link' href={`/dashboard/manage-product?page=${queryPage - 1}`}>Prev</Link></li>}

               {items >= 0 ? pageBtn.map((p, i) => {
                  return (
                     <li className='page-item' key={i}><Link className='page-link' href={`/dashboard/manage-product?page=${p}`}>{p}</Link></li>
                  );
               }) : ""}
               {queryPage < items && <li className='page-item'><Link className='page-link' href={`/dashboard/manage-product?page=${queryPage + 1}`}>Next</Link></li>}
            </ul>

            <ProductDetailsModal
               data={productDetailModal}
               closeModal={() => setProductDetailModal(false)}
            />
         </div>

         {
            role === 'SELLER' &&
            <div className="mt-3">
               <h6>Draft Products</h6>
               <div className="card_default card_description">

                  {
                     manageProducts?.data?.draftProducts ? manageProducts?.data?.draftProducts.map((mProduct, index) => {
                        return (
                           <div className='border my-3' key={index}>
                              <div className='p-1'>
                                 <small>
                                    <pre>
                                       TITLE           : {mProduct?.title} <br />
                                       PID             : {mProduct?._id} <br />
                                       Listing ID      : {mProduct?._lid} <br />
                                       BRAND           : {mProduct?.brand} <br />
                                       CATEGORIES      : {mProduct?.categories && mProduct?.categories.join(" >> ")} <br />
                                       Total Variation : {(mProduct?.variations && mProduct?.variations.length) || 0}
                                    </pre>
                                 </small>

                                 <Link className='bt9_edit' state={{ from: location }} replace
                                    href={`/dashboard/manage-product?np=edit_product&store=${mProduct?.supplier?.store_name}&pid=${mProduct?._id}`}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                    &nbsp;Edit Product
                                 </Link>
                                 &nbsp;
                                 <button className='mt-2 bt9_delete' onClick={() => deleteThisProductHandler(mProduct?._id, mProduct?._lid, mProduct?.supplier?.store_name)}>Delete This Product</button> &nbsp;
                                 {
                                    (Array.isArray(mProduct?.variations) && mProduct?.variations.length >= 1 && mProduct?.save_as === 'draft') ?
                                       <button className='bt9_edit me-2'
                                          onClick={() => productControlHandler("fulfilled", "save_as", mProduct)}
                                       >
                                          Publish
                                       </button> : <p>Please Create at least one variation for publish this product</p>
                                 }
                              </div>

                              {
                                 mProduct?.variations && mProduct?.variations.length >= 0 ?
                                    <>
                                       <div className="px-1 pb-3">
                                          <button className="bt9_primary" onClick={() => setOpenProductVariationModal(mProduct && {
                                             _id: mProduct?._id,
                                             formType: "new-variation",
                                             title: mProduct?.title,
                                             categories: mProduct?.categories,
                                             listingID: mProduct?._lid,
                                          })}>
                                             Add New Variation
                                          </button>
                                       </div>


                                       <table className='table '>
                                          <thead>
                                             <tr>
                                                <th>Image</th>
                                                <th>sku</th>
                                                <th>Action</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {
                                                mProduct?.variations ? mProduct?.variations.map(variation => {

                                                   return (
                                                      <tr key={variation?.sku}>
                                                         <td>
                                                            <img src={mProduct?.images && mProduct?.images[0]} alt="" style={{ width: "60px", height: "60px" }} />
                                                         </td>

                                                         <td>{variation?.sku}</td>
                                                         <td>
                                                            <Link className='bt9_edit' state={{ from: location }} replace
                                                               href={`/dashboard/manage-product?np=update-variation&store=${mProduct?.supplier?.store_name}&pid=${mProduct?._id}&sku=${variation?.sku}`}>
                                                               Update Variation
                                                            </Link>

                                                            <button className='bt9_delete m-1' title={`Delete ${mProduct?.title}`}
                                                               onClick={() => deleteProductVariationHandler(variation?.sku, mProduct?._id)}>
                                                               Delete this variation
                                                            </button>
                                                         </td>
                                                      </tr>
                                                   )
                                                }) : <tr><td>No product in your drafts</td></tr>
                                             }
                                          </tbody>
                                       </table>
                                    </> :
                                    <>
                                       <div className="px-1">
                                          <Link className='bt9_create me-2' state={{ from: location }} replace
                                             href={`/dashboard/manage-product?np=add-new-variation&store=${mProduct?.supplier?.store_name}&pid=${mProduct?._id}`}>
                                             Create Variation
                                          </Link>
                                       </div>

                                       <div className="d-flex align-items-center justify-content-between p-2">


                                          <div className="p-1">


                                             {
                                                mProduct.variations && mProduct.variations.length >= 1 && <>
                                                   {
                                                      mProduct?.save_as === 'draft' &&
                                                      <button className='bt9_edit me-2'
                                                         onClick={() => productControlHandler("fulfilled", "save_as", mProduct)}
                                                      >Publish</button>
                                                   }
                                                </>

                                             }


                                          </div>
                                       </div>
                                    </>
                              }
                           </div>
                        )
                     }) : <p>Add Variation</p>
                  }

               </div>
            </div>
         }
      </>
   )
};

export default ManageProductHome;