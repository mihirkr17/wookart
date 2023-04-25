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
   const [productDetailModal, setProductDetailModal] = useState(false);
   const [openDropDown, setOpenDropDown] = useState("");
   const { width } = useWindowDimensions();
   const [flashSale, setFlashSale] = useState("");
   const [updateProductForm, setUpdateProductForm] = useState(false);
   const [openProductVariationModal, setOpenProductVariationModal] = useState(false);

   const deleteProductVariationHandler = async (vid, pid) => {
      try {
         const { success, message } = await apiHandler(`/dashboard/seller/${userInfo?.seller?.storeInfos?.storeName}/product/delete-product-variation/${pid}/${vid}`,
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

   const handleFlashSaleMenu = (params) => {
      if (params !== flashSale) {
         setFlashSale(params);
      }

      else {
         setFlashSale("");
      }
   }


   const stockHandler = async (e, productID, _vrid) => {
      const { value } = e.target;

      let available = parseInt(value);

      try {
         const { success, message } = await apiHandler(`/dashboard/seller/${userInfo?.seller?.storeInfos?.storeName}/product/update-stock`, "PUT", { productID, variations: { available, _vrid }, MARKET_PLACE: 'WooKart' });

         if (success) {
            setMessage(message, 'success');
            refetch();
            return
         } else {
            return setMessage(message, 'danger');
         }

      } catch (error) {
         setMessage(error?.message);
      }
   }


   async function productControlHandler(action, lId, pId, vId, mProduct) {
      try {

         if ((mProduct?.variations && mProduct?.variations.filter(v => v?.status === 'active').length <= 1) && (action === 'inactive')) {
            return setMessage("At least one variation need href active !", 'danger');
         }

         const { success, message } = await apiHandler(`/dashboard/seller/${mProduct?.sellerData?.storeName}/product-control`, "PUT", { market_place: 'woo-kart', actionType: action, data: { action, lId, pId, vId } });

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





   async function flashSellFormHandler(e, product) {
      try {
         e.preventDefault();

         const fSaleStart = e.target.fSaleStart?.value;
         const fSaleEnd = e.target.fSaleEnd?.value;

         if (fSaleEnd !== "" && fSaleStart !== "") {
            const fSale = {
               fSaleStart, fSaleEnd
            }
            const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/dashboard/seller/${userInfo?.seller?.storeInfos?.storeName}/start-flash-sale`, {
               method: "PUT",
               withCredentials: true,
               credentials: 'include',
               headers: {
                  "Content-Type": "application/json"
               },
               body: JSON.stringify({ market_place: 'woo-kart', actionType: "FLASH_SALE", data: { productID: product?._id, listingID: product?._lid, fSale } })
            });


            const result = await response.json();


            if (result?.success === true) {
               setMessage(result?.message, 'success')
            } else {
               setMessage(result?.message, 'danger');
            }

         }
      } catch (error) {

      }
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
               <h5 className='py-3'>{role === 'SELLER' ? "Active Products (" + counter + ")" : "All Products (" + counter + ")"}</h5>
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
                           <div className="p-1">
                              <img src={mProduct?.images && mProduct?.images[0]} alt="" style={{ width: "60px", height: "60px" }} />

                              <small>
                                 <pre style={{ whiteSpace: 'break-spaces' }}>
                                    TITLE           : {mProduct?.title} <br />
                                    PID             : {mProduct?._id} <br />
                                    Listing ID      : {mProduct?._lid} <br />
                                    BRAND           : {mProduct?.brand} <br />
                                    SELLING PRICE   : {mProduct?.pricing?.sellingPrice} <br />
                                    CATEGORIES      : {mProduct?.categories && mProduct?.categories.join(" >> ")} <br />
                                    Total Variation : {(mProduct?.totalVariation && mProduct?.totalVariation) || 0} <br />
                                    View            : <button onClick={() => setProductDetailModal(true && mProduct)}>view</button>
                                 </pre>
                              </small>
                              <br />

                              <button className='bt9_edit' onClick={() => handleFlashSaleMenu(mProduct)}>Start Flash Selling</button>

                              {
                                 flashSale?._lid === mProduct?._lid && <div className='card_default card_description'>

                                    <form onSubmit={(e) => flashSellFormHandler(e, mProduct)}>
                                       <div className='py-2'>
                                          <label htmlFor="fSaleStart">Start Date</label> <br />
                                          <input type="date" className='form-control form-control-sm' name='fSaleStart' id='fSaleStart' />
                                       </div>

                                       <div className='py-2'>
                                          <label htmlFor="fSaleEnd">End date</label> <br />
                                          <input type="date" className='form-control form-control-sm' name='fSaleEnd' id='fSaleEnd' />
                                       </div>

                                       <div className="py-2">
                                          <button type='submit' className='bt9_create'>Start Sale</button>
                                       </div>
                                    </form>

                                 </div>
                              }
                           </div>

                           <div className={`dropdown`} style={width <= 567 ? { width: '100%' } : { width: 'unset' }}>

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
                                 ></DropDown>
                              }
                           </div>

                        </div>

                        <div className="table-responsive">
                           <table className='table'>
                              <thead>
                                 <tr>
                                    <th>Variation ID</th>
                                    <th>sku</th>
                                    <th>Status</th>
                                    <th>Price Modifier ($)</th>
                                    <th>Availability (Pcs)</th>
                                    <th>Stock</th>
                                    <th>Action</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {
                                    mProduct?.variations ? mProduct?.variations.map(variation => {

                                       return (
                                          <tr key={variation?._vrid}>
                                             <td>{variation?._vrid}</td>
                                             <td>{variation?.sku}</td>
                                             <td>{variation?.status.toUpperCase()}</td>
                                             <td>{variation?.priceModifier}</td>
                                             <td>
                                                {
                                                   role === 'SELLER' ?
                                                      <input type="text" style={{ width: "50px", border: "1px solid black", padding: "0 2px", backgroundColor: "inherit" }}
                                                         onBlur={(e) => stockHandler(e, mProduct?._id, variation?._vrid)}
                                                         defaultValue={variation?.available}
                                                         readOnly onDoubleClick={e => e.target.readOnly = false} /> :
                                                      variation?.available

                                                }
                                             </td>
                                             <td>{variation?.stock}</td>
                                             <td>
                                                <button className={`${variation?.status === 'active' ? 'bt9_warning' : 'bt9_edit'}`}
                                                   onClick={() => productControlHandler(variation?.status === 'active' ? "inactive" : 'active', mProduct?._lid, mProduct?._id, variation?._vrid, mProduct)}
                                                >
                                                   {
                                                      variation?.status === 'active' ? 'Inactive Now' : 'Active Now'
                                                   }
                                                </button>

                                                <button className='bt9_edit' onClick={() => setOpenProductVariationModal(
                                                   {
                                                      variations: variation,
                                                      categories: mProduct?.categories,
                                                      listingID: mProduct?._lid,
                                                      _id: mProduct?._id,
                                                      title: mProduct?.title,
                                                      formType: "update-variation"
                                                   }
                                                )}>
                                                   Update Variation
                                                </button>

                                                {
                                                   mProduct?.variations && mProduct?.variations.length >= 2 && <button className='btn btn-sm m-1' title={`Delete ${mProduct?.title}`}
                                                      onClick={() => deleteProductVariationHandler(variation?._vrid, mProduct?._id)}>
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
                                    href={`/dashboard/manage-product?np=edit_product&store=${mProduct?.sellerData?.storeName}&pid=${mProduct?._id}`}>
                                    <FontAwesomeIcon icon={faPenToSquare} />
                                    &nbsp;Edit Product
                                 </Link>
                                 &nbsp;
                                 <button className='mt-2 bt9_delete' onClick={() => deleteThisProductHandler(mProduct?._id, mProduct?._lid, mProduct?.sellerData?.storeName)}>Delete This Product</button> &nbsp;
                                 {
                                    (Array.isArray(mProduct?.variations) && mProduct?.variations.length >= 1 && mProduct?.save_as === 'draft') ?
                                       <button className='bt9_edit me-2'
                                          onClick={() => productControlHandler("fulfilled", mProduct?._lid, mProduct?._id)}
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
                                                <th>_vrid</th>
                                                <th>sku</th>
                                                <th>Action</th>
                                             </tr>
                                          </thead>
                                          <tbody>
                                             {
                                                mProduct?.variations ? mProduct?.variations.map(variation => {

                                                   return (
                                                      <tr key={variation?._vrid}>
                                                         <td>
                                                            <img src={mProduct?.images && mProduct?.images[0]} alt="" style={{ width: "60px", height: "60px" }} />
                                                         </td>
                                                         <td>{variation?._vrid}</td>
                                                         <td>{variation?.sku}</td>
                                                         <td>
                                                            <Link className='bt9_edit' state={{ from: location }} replace
                                                               href={`/dashboard/manage-product?np=update-variation&store=${mProduct?.sellerData?.storeName}&pid=${mProduct?._id}&vId=${variation?._vrid}`}>
                                                               Update Variation
                                                            </Link>

                                                            <button className='bt9_delete m-1' title={`Delete ${mProduct?.title}`}
                                                               onClick={() => deleteProductVariationHandler(variation?._vrid, mProduct?._id)}>
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
                                             href={`/dashboard/manage-product?np=add-new-variation&store=${mProduct?.sellerData?.storeName}&pid=${mProduct?._id}`}>
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
                                                         onClick={() => productControlHandler("fulfilled", mProduct?._lid, mProduct?._id)}
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