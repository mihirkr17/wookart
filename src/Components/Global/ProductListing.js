import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import BtnSpinner from '../Shared/BtnSpinner/BtnSpinner';
import { apiHandler, slugMaker } from '@/Functions/common';
import { newCategory } from '@/CustomData/categories';
import dynamic from 'next/dynamic';

const Ckeditor = dynamic(() => import('../Shared/Ckeditor'), { ssr: false });

const ProductListing = ({ required, userInfo, formTypes, data, refetch, setMessage, super_category }) => {
   const specs = data?.specification && data?.specification;

   const [specification, setSpecification] = useState(specs || {});
   const [slug, setSlug] = useState(data?.slug || "");

   const [actionLoading, setActionLoading] = useState(false);
   // Category states
   const [category, setCategory] = useState((data?.categories && data?.categories[0]) || '');
   const [subCategory, setSubCategory] = useState((data?.categories && data?.categories[1]) || '');
   const [postCategory, setPostCategory] = useState((data?.categories && data?.categories[2]) || '');


   const [warrantyTerm, setWarrantyTerm] = useState(data?.warranty?.wType || "");
   const [warrantyPeriod, setWarrantyPeriod] = useState(data?.warranty?.wTime || "");

   const [description, setDescription] = useState(data?.description ?? "CKEditor v5");
   const [image, setImage] = useState(data?.image ?? "");


   // search keywords
   const [searchKeywords, setSearchKeywords] = useState(data?.keywords ?? [""]);

   // this is global variable of categories states
   const sub_category = newCategory && newCategory.find(e => e.category === category);
   const post_category = sub_category?.sub_category_items && sub_category?.sub_category_items.find(e => e.name === subCategory);
   const superCategory = post_category?.post_category_items && post_category?.post_category_items.find(e => e.name === postCategory);

   const [highlight, setHighlight] = useState((data?.highlights && data?.highlights) || [""]);


   // keyword action
   const searchKeywordInputHandler = (e, index) => {
      const { value } = e.target;
      let list = [...searchKeywords];
      list[index] = value;
      setSearchKeywords(list);
   }

   const removeSearchKeywordInputHandler = (i) => {
      let list = [...searchKeywords];
      list.splice(i, 1);
      setSearchKeywords(list);
   }

   const handleTitle = (value) => {
      let slugs = slugMaker(value);

      setSlug(slugs);
   }


   // handle key features
   const handleHighlightInput = (e, index) => {
      const { value } = e.target;

      let list = [...highlight];
      list[index] = value;

      setHighlight(list);
   }

   const removeHighlightInputHandler = (index) => {
      let list = [...highlight]
      list.splice(index, 1);

      setHighlight(list);
   }

   async function productIntroHandler(e) {
      try {
         e.preventDefault();
         let metaDescription = e.target.metaDescription.value;

         if (highlight?.length >= 4 || highlight?.length < 1) {
            return setMessage("Maximum 3 highlights allowed !");
         }

         let warranty = {
            term: warrantyTerm,
            period: warrantyPeriod || null
         }

         let formData = new FormData(e.currentTarget);
         formData.append('slug', slug);
         formData.append('category', category);
         formData.append('subCategory', subCategory);
         formData.append('postCategory', postCategory);

         formData = Object.fromEntries(formData.entries());
         formData['warranty'] = warranty;
         formData['specification'] = specification;
         formData["description"] = description;
         formData["discount"] = discount;
         formData["isFree"] = e.target.isFree.checked;
         formData["image"] = image;
         formData["highlights"] = highlight;
         formData["keywords"] = searchKeywords;
         formData["meta_description"] = metaDescription;


         const notEmpty = Object.values(formData).every(x => x !== null && x !== '');

         if (!notEmpty) {
            return setMessage("Required all fields!!!", 'danger');
         }

         const { success, message } = await apiHandler(`/dashboard/seller/${userInfo?.store?.name}/product/listing/${formTypes}/${data?._lid}`, "POST", formData);
         setActionLoading(false);

         if (success) {
            setMessage(message, 'success');
            if (formTypes === "create") {
               // e.target.reset();
            } else {
               refetch();
            }
         }

      } catch (error) {
         setMessage(error?.message, 'danger');
      } finally {
         setActionLoading(false);
      }
   }

   const btnStyle = {
      cursor: "pointer",
      display: "block",
      padding: "0.2rem",
      marginLeft: "0.5rem"
   }

   function cSl(spec = {}, existSpecs = {}) {

      let attObject = Object.entries(spec);

      let str = [];

      for (let [key, value] of attObject) {

         str.push(
            (Array.isArray(value) && <div className="col-lg-3 mb-3">
               <label htmlFor={key}>{required}&nbsp;{key.replace(/_+/gi, " ").toUpperCase()}</label>
               <select name={key} id={key} className='form-select form-select-sm' onChange={(e) => setSpecification({ ...specification, [e.target.name]: e.target.value })}>
                  {
                     existSpecs.hasOwnProperty(key) && <option value={existSpecs[key]}>{existSpecs[key]}</option>
                  }

                  <option value="">Select {key.replace(/_+/gi, " ")}</option>
                  {
                     value && value.map((type, index) => {
                        return (<option key={index} value={type}>{type}</option>)
                     })
                  }
               </select>
            </div>

            ), typeof value !== 'object' && <div className="col-lg-3 mb-3">
               <label htmlFor={key}>{required} {key.replace(/_+/gi, " ").toUpperCase()}</label>
               <input type="text" name={key} id={key} onChange={(e) => setSpecification({ ...specification, [e.target.name]: e.target.value })} placeholder={"Write " + key.replace(/_+/gi, " ")} defaultValue={existSpecs.hasOwnProperty(key) ? existSpecs[key] : ""} className='form-control form-control-sm' />
            </div>

         )
      }

      return str;
   }


   return (
      <>
         <form onSubmit={productIntroHandler} encType="multipart/form-data">
            <div className="card_default card_description">
               <h6>Product Intro</h6>
               <div className="row my-4">

                  <div className="col-lg-12 my-2">
                     <label htmlFor="title">{required} Title</label>
                     <input className='form-control form-control-sm' type="text" name='title' id='title' defaultValue={data?.title || ""} onChange={(e) => handleTitle(e.target.value)} />
                     <input className='form-control form-control-sm mt-1' key={slug || ""} defaultValue={slug || ""} type="text" disabled />
                  </div>

                  {/* Brand */}
                  <div className='col-lg-3 mb-3'>
                     <label htmlFor='brand'>{required} Brand</label>
                     <input name="brand" id='brand' className='form-control form-control-sm' type="text" defaultValue={data?.brand || ""} placeholder="Brand Name..." />
                  </div>

                  {
                     formTypes !== 'update' && <>
                        <div className='col-lg-3 mb-3'>
                           <label htmlFor='category'>{required} Category</label> <br />
                           <select className="form-select form-select-sm text-capitalize" name="category" id="category" onChange={(e) => setCategory(e.target.value)}>

                              {category && <option value={category}>{category}</option>}
                              <option value={""}>{"Choose"}</option>
                              {
                                 newCategory && newCategory.map((category, index) => {
                                    return (
                                       <option value={category?.category} key={index}>{category?.category}</option>
                                    )
                                 })
                              }
                           </select>
                        </div>

                        {/* Sub Category */}
                        <div className='col-lg-3 mb-3'>
                           <label htmlFor='sub_category'>{required} Sub Category</label> <br />
                           <select className="form-select form-select-sm text-capitalize" name="sub_category" id="sub_category" onChange={(e) => setSubCategory(e.target.value)}>
                              {subCategory && <option value={subCategory}>{subCategory}</option>}
                              <option value="">Choose</option>

                              {
                                 sub_category?.sub_category_items && sub_category?.sub_category_items.map((category, index) => {
                                    return (
                                       <option value={category?.name} key={index}>{category?.name}</option>
                                    )
                                 })
                              }
                           </select>
                        </div>

                        {/* Post Category */}
                        <div className='col-lg-3 mb-3'>
                           <label htmlFor='post_category'>{required} Post Category</label> <br />
                           <select className="form-select form-select-sm text-capitalize" name="post_category" id="post_category" onChange={(e) => setPostCategory(e.target.value)}>
                              {postCategory && <option value={postCategory}>{postCategory}</option>}
                              <option value={""}>{"Choose"}</option>
                              {
                                 post_category?.post_category_items && post_category?.post_category_items.map((c, i) => {
                                    return (
                                       <option value={c.name} key={i}>{c.name}</option>
                                    )
                                 })
                              }
                           </select>
                        </div>

                     </>
                  }

                  <div className="col-lg-12 py-2">
                     <label htmlFor='image'>{required} Image(<small>Product Image (Main)</small>)&nbsp;</label>
                     <input className="form-control form-control-sm" name="image" id='image' type="text"
                        placeholder='Image url' value={image ?? ""} onChange={(e) => setImage(e)} />
                     <div className="py-2">
                        <img style={{ width: "180px", height: "auto" }} src={image} alt="" />
                     </div>
                  </div>


                  {/* Inventory Details */}
                  <div className="col-lg-12 my-2">
                     <h6>Inventory Details</h6>
                     <div className="row">
                        <div className="col-lg-3 mb-3">
                           <label htmlFor="fulfilledBy">{required} Fulfillment By</label>
                           <select name="fulfilledBy" id="fulfilledBy" className='form-select form-select-sm'>
                              <option value={data?.shipping?.fulfilledBy || ""}>{data?.shipping?.fulfilledBy || "Select One"}</option>
                              <option value="wooKart">WooKart</option>
                              <option value="seller">Seller</option>
                              <option value="smart-seller">Seller Smart</option>
                           </select>
                        </div>

                        <div className="col-lg-3 mb-3">
                           <label htmlFor="procurementType">{required} Procurement Type</label>
                           <select name="procurementType" id="procurementType" className='form-select form-select-sm'>
                              <option value={data?.shipping?.procurementType || ""}>{data?.shipping?.procurementType || "Select One"}</option>
                              <option value="instock">Instock</option>
                              <option value="express">Express</option>
                           </select>
                        </div>

                        <div className="col-lg-3 mb-3">
                           <label htmlFor="procurementSLA">{required} Procurement SLA</label>
                           <input type={'number'} name="procurementSLA" id="procurementSLA" className='form-control form-control-sm'
                              defaultValue={data?.shipping?.procurementSLA || 0} />
                        </div>

                     </div>
                  </div>

                  {/* Shipping Provider */}
                  <div className="col-lg-12 my-2">
                     <h6>Shipping Provider</h6>
                     <div className="row">
                        {/* Shipping Provider */}
                        <div className='col-lg-3 mb-3'>
                           <label htmlFor='shippingProvider'>{required} Shipping Provider</label>
                           <select name="shippingProvider" id="shippingProvider" className='form-select form-select-sm'>
                              <option value={data?.shipping?.provider || ""}>{data?.shipping?.provider || "Select One"}</option>
                              <option value="wooKart">WooKart</option>
                              <option value="seller">Seller</option>
                              <option value="seller-wooKart">Seller And WooKart</option>
                           </select>
                        </div>
                     </div>
                  </div>

                  {/* Packaging Details */}
                  <div className="col-lg-12 my-2">
                     <h6>Packaging Details</h6>
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
                  </div>

                  {/* Tax Details */}
                  <div className="col-lg-12 my-2">
                     <h6>Tax Details</h6>
                     <div className="row">
                        <div className="col-lg-3">
                           <label htmlFor="taxHsn">{required} HSN</label>
                           <input type="text" className='form-control form-control-sm' name='taxHsn' id='taxHsn'
                              defaultValue={data?.tax?.hsn || ""} />
                        </div>

                        <div className="col-lg-3">
                           <label htmlFor="taxCode">{required} Tax Code</label>
                           <input type="text" className='form-control form-control-sm' name='taxCode' id='taxCode'
                              defaultValue={data?.tax?.code || ''} />
                        </div>
                     </div>
                  </div>

                  <div className="col-lg-12 my-2">
                     <div className="py-2">
                        <label htmlFor="isFree">
                           Free Shipping &nbsp;
                           <input type="checkbox" name="isFree" id="isFree" defaultChecked={data?.shipping?.isFree ? true : false} />
                        </label>
                     </div>
                  </div>

                  {/* Manufacturing Details */}
                  <div className="col-lg-12 my-2">
                     <h6>Manufacturing Details</h6>
                     <div className="row">
                        <div className="col-lg-3">
                           <label htmlFor="manufacturerOrigin">{required} Country Of Origin</label>
                           <select name="manufacturerOrigin" id="manufacturerOrigin" className='form-select form-select-sm'>
                              <option value={data?.manufacturer?.origin || 'bangladesh'}>{data?.manufacturer?.origin || 'bangladesh'}</option>
                           </select>
                        </div>

                        <div className="col-lg-3">
                           <label htmlFor="manufacturerDetails">Manufacturer Details</label>
                           <input type="text" className='form-control form-control-sm' name='manufacturerDetails' id='manufacturerDetails'
                              defaultValue={data?.manufacturer?.details || ''}
                           />
                        </div>
                     </div>
                  </div>


                  <div className="col-lg-3 my-2">
                     <label htmlFor="warrantyTerm">Warranty</label>
                     <select className='form-select form-select-sm' name="warrantyTerm" id="warrantyTerm"
                        onChange={(e) => setWarrantyTerm(e.target.value)}>
                        {data?.warranty?.wType &&
                           <option value={data?.warranty?.wType}>{data?.warranty?.wType}</option>}
                        <option value="">Choose Warranty Terms</option>
                        <option value="seller_warranty">Seller Warranty</option>
                        <option value="brand_warranty">Brand Warranty</option>
                        <option value="no_warranty">No Warranty</option>
                     </select>
                  </div>

                  {
                     warrantyTerm === "seller_warranty" &&
                     <div className="col-lg-3 my-2">
                        <label htmlFor="warrantyPeriod">Choose Warranty Period</label>
                        <select className='form-select form-select-sm' name="warrantyPeriod" id="warrantyPeriod"
                           onChange={(e) => setWarrantyPeriod(e.target.value)}>

                           {
                              data?.warranty?.period &&
                              <option value={data?.warranty.period}>{data?.warranty?.period}</option>
                           }
                           <option value="">Choose Warranty Time</option>
                           <option value={"6-months"}>6 Months</option>
                           <option value="1-year">1 Year</option>
                           <option value="1.5-years">1.5 Years</option>
                           <option value="2-years">2 Years</option>
                        </select>
                     </div>
                  }

                  <div className="col-lg-12 my-2">
                     <h6>Specification</h6>
                     <div className="row">
                        {
                           cSl(super_category?.specification || superCategory?.specification, specs || {})
                        }
                     </div>
                  </div>

                  <div className="col-lg-12 my-2">
                     <div className="d-flex align-items-start justify-content-between pb-3">
                        <h5>Additional Description</h5>
                     </div>

                     <div className="row">
                        <div className='col-lg-12'>
                           <label htmlFor='searchKeyword'>{required} Search Keywords</label>
                           {
                              searchKeywords && searchKeywords.map((keys, i) => {
                                 return (
                                    <div className='py-2 d-flex align-items-end justify-content-start' key={i}>
                                       <input
                                          className='form-control form-control-sm'
                                          name="searchKeyword" id='searchKeyword'
                                          value={keys} type="text"
                                          placeholder="Search Keywords"
                                          onChange={(e) => searchKeywordInputHandler(e, i)}
                                       />

                                       {
                                          searchKeywords.length !== 1 && <span style={btnStyle}
                                             onClick={() => removeSearchKeywordInputHandler(i)}>
                                             <FontAwesomeIcon icon={faMinusSquare} />
                                          </span>
                                       }
                                       {
                                          searchKeywords.length - 1 === i && <span style={btnStyle}
                                             onClick={() => setSearchKeywords([...searchKeywords, ''])}>
                                             <FontAwesomeIcon icon={faPlusSquare} />
                                          </span>

                                       }
                                    </div>
                                 )
                              })
                           }
                        </div>

                        <div className="col-lg-12 my-2">
                           <label htmlFor='highlight'>{required} Product Highlight&nbsp;</label>
                           {
                              highlight && highlight.map((keys, i) => {
                                 return (
                                    <div className='py-2 d-flex align-items-end justify-content-start' key={i}>
                                       <input
                                          className='form-control form-control-sm'
                                          name="highlight" id='highlight'
                                          value={keys} type="text"
                                          placeholder="Key Features"
                                          onChange={(e) => handleHighlightInput(e, i)}
                                       />

                                       {
                                          highlight.length !== 1 && <span style={btnStyle}
                                             onClick={() => removeHighlightInputHandler(i)}>
                                             <FontAwesomeIcon icon={faMinusSquare} />
                                          </span>
                                       }
                                       {
                                          highlight.length - 1 === i && <span style={btnStyle}
                                             onClick={() => setHighlight([...highlight, ''])}>
                                             <FontAwesomeIcon icon={faPlusSquare} />
                                          </span>
                                       }
                                    </div>
                                 )
                              })
                           }
                        </div>


                        <div className='col-lg-12 my-2'>
                           <label htmlFor='metaDescription'>{required} Meta Description</label>
                           <textarea className='form-control'
                              name="metaDescription"
                              id='metaDescription'
                              defaultValue={data?.meta_description || ""} type="text"
                              placeholder="Meta description"></textarea>
                        </div>

                        <div className="col-lg-12 my-2">
                           <label htmlFor='description'>Description</label>
                           <Ckeditor description={description} setDescription={setDescription} />
                        </div>

                     </div>
                  </div>


                  <div className="col-lg-12">
                     <button className='bt9_edit' type="submit">
                        {
                           actionLoading ? <BtnSpinner text={formTypes === "create" ? "Saving..." : "Updating..."} /> :
                              formTypes === "create" ? "Save" : "Update"
                        }
                     </button>
                  </div>
               </div>
            </div>



         </form >
      </>
   );
};

export default ProductListing;