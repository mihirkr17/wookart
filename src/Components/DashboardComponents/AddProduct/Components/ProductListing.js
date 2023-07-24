import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { apiHandler, inputHandler, slugMaker } from '@/Functions/common';
import dynamic from 'next/dynamic';
import ImageUploader from '@/Components/Global/ImageUploader';
import { productCategories } from '@/CustomData/categories';
import BtnSpinner from '@/Components/Shared/BtnSpinner/BtnSpinner.js';
import { usePrice } from '@/Hooks/usePrice.js';

const Ckeditor = dynamic(() => import('../../../Shared/Ckeditor.js'), { ssr: false });

const ProductListing = ({ userInfo, formTypes, setMessage }) => {
   const required = <span style={{ color: "red" }}>*</span>;

   const [specification, setSpecification] = useState({});
   const [slug, setSlug] = useState("");

   const [images, setImages] = useState([""]);

   const [variations, setVariations] = useState({});

   const [variant, setVariant] = useState({});

   const [attrs, setAttrs] = useState({});

   const [actionLoading, setActionLoading] = useState(false);

   // Category states
   const [category, setCategory] = useState("");
   const [subCategory, setSubCategory] = useState('');
   const [postCategory, setPostCategory] = useState('');

   const [warrantyTerm, setWarrantyTerm] = useState("");
   const [warrantyPeriod, setWarrantyPeriod] = useState("");

   const [description, setDescription] = useState("CKEditor v5");

   // search keywords
   const [searchKeywords, setSearchKeywords] = useState([""]);


   const [pricing, setPricing] = useState({
      price: "",
      sellingPrice: ""
   });

   const { discount } = usePrice(pricing.price, pricing.sellingPrice);

   // this is global variable of categories states
   const sub_category = productCategories && productCategories.find(e => e.name === category);
   const post_category = sub_category?.subCategories?.find(e => e.name === subCategory);
   const categoryFeatures = post_category?.postCategories?.find(e => e.name === postCategory);

   const [highlight, setHighlight] = useState([""]);

   const handleTitle = (value) => {
      let slugs = slugMaker(value);
      setSlug(slugs);
   }

   async function productIntroHandler(e) {
      try {
         e.preventDefault();


         let metaDescription = e.target.metaDescription.value;

         let warranty = {
            type: warrantyTerm,
            duration: warrantyPeriod || null
         }

         let formData = new FormData(e.currentTarget);

         variations["attrs"] = attrs;
         variations["variant"] = variant;
         variations["pricing"] = pricing;
         variations["images"] = images;


         formData.append('slug', slug);
         formData.append('category', category);
         formData.append('subCategory', subCategory);
         formData.append('postCategory', postCategory);

         formData = Object.fromEntries(formData.entries());
         formData['warranty'] = warranty;
         formData['specification'] = specification;
         formData["description"] = description;
         formData["isFree"] = e.target.isFree.checked;
         formData["highlights"] = highlight;
         formData["keywords"] = searchKeywords;
         formData["metaDescription"] = metaDescription;
         // formData["imageUrls"] = images;
         formData["variation"] = variations;


         // if all fields are empty then throwing error messages.
         const notEmpty = Object.values(formData).every(x => x !== null && x !== '');

         if (!notEmpty) {
            return setMessage("Required all fields!!!", 'danger');
         }

         const { success, message } = await apiHandler(`/dashboard/seller/${userInfo?.store?.name}/product/listing/${formTypes}`, "POST", formData);
         setActionLoading(false);

         if (success) {
            setMessage(message, 'success');
            if (formTypes === "create") {
               e.target.reset();
            }
         }

      } catch (error) {
         setMessage(error?.message, 'danger');
      } finally {
         setActionLoading(false);
      }
   }

   function cSl(spec = {}, params = "") {

      let attObject = Object.entries(spec);

      let str = [];

      for (let [key, value] of attObject) {

         str.push(
            (Array.isArray(value) && <div className="col-lg-3 my-2">
               <label htmlFor={key}>{required}&nbsp;{key.replace(/_+/gi, " ").toUpperCase()}</label>

               <select name={key} id={key} className='form-select form-select-sm'
                  onChange={(e) => (params === "variant" ? setVariant({ ...variant, [e.target.name]: e.target.value }) :
                     params === "attrs" ? setAttrs({ ...attrs, [e.target.name]: e.target.value }) :
                        setSpecification({ ...specification, [e.target.name]: e.target.value }))}>

                  <option value="">Select {key.replace(/_+/gi, " ")}</option>
                  {
                     value && value.map((type, index) => {
                        return (<option key={index} value={type}>{type}</option>)
                     })
                  }
               </select>
            </div>

            ), typeof value !== 'object' && <div className="col-lg-3 my-2">
               <label htmlFor={key}>{required} {key.replace(/_+/gi, " ").toUpperCase()}</label>
               <input type="text" name={key} id={key}
                  onChange={(e) => params === "variant" ? setVariant({ ...variant, [e.target.name]: e.target.value }) :
                     params === "attrs" ? setAttrs({ ...attrs, [e.target.name]: e.target.value }) :
                        setSpecification({ ...specification, [e.target.name]: e.target.value })}
                  placeholder={"Write " + key.replace(/_+/gi, " ")}
                  defaultValue={""} className='form-control form-control-sm' />
            </div>

         )
      }

      return str;
   }


   return (
      <>
         <ImageUploader images={images} setImages={setImages} />
         <form onSubmit={productIntroHandler} encType="multipart/form-data">
            <div className="card_default card_description">
               <h6>Product Intro</h6>
               <div className="row my-4">

                  <div className="col-lg-12 my-2">
                     <label htmlFor="title">{required} Title</label>
                     <input className='form-control form-control-sm' type="text" name='title' id='title' defaultValue={""} onChange={(e) => handleTitle(e.target.value)} />
                     <input className='form-control form-control-sm mt-1' key={slug || ""} defaultValue={slug || ""} type="text" disabled />
                  </div>

                  {/* Brand */}
                  <div className='col-lg-3 mb-3'>
                     <label htmlFor='brand'>{required} Brand</label>
                     <input name="brand" id='brand' className='form-control form-control-sm' type="text" defaultValue={""} placeholder="Brand Name..." />
                  </div>



                  {/* Categories Section  */}
                  <div className='col-lg-3 mb-3'>
                     <label htmlFor='category'>{required} Category</label> <br />
                     <select className="form-select form-select-sm text-capitalize" name="category" id="category" onChange={(e) => setCategory(e.target.value)}>
                        <option value={""}>{"Choose"}</option>
                        {
                           productCategories && productCategories.map((category, index) => {
                              return (
                                 <option value={category?.name} key={index}>{category?.name}</option>
                              )
                           })
                        }
                     </select>
                  </div>

                  {/* Sub Category */}
                  <div className='col-lg-3 mb-3'>
                     <label htmlFor='sub_category'>{required} Sub Category</label> <br />
                     <select className="form-select form-select-sm text-capitalize" name="sub_category" id="sub_category" onChange={(e) => setSubCategory(e.target.value)}>
                        <option value="">Choose</option>

                        {
                           sub_category?.subCategories && sub_category?.subCategories.map((category, index) => {
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
                        <option value={""}>{"Choose"}</option>
                        {
                           post_category?.postCategories && post_category?.postCategories.map((c, i) => {
                              return (
                                 <option value={c.name} key={i}>{c.name}</option>
                              )
                           })
                        }
                     </select>
                  </div>


                  {
                     (postCategory) &&

                     <>
                        {/* Price information  */}
                        <div className="col-lg-12 my-2">
                           <hr />
                           <h6>Price Details</h6>
                           <div className="row">
                              {/* Price */}
                              <div className='col-lg-3 mb-3'>
                                 <label htmlFor='price'>{required} Price (BDT)</label>
                                 <input name='price' id='price' type='number' className="form-control form-control-sm" value={pricing.price || ""}
                                    onChange={e => setPricing({ ...pricing, [e.target.name]: e.target.value })} />
                              </div>

                              {/* Selling Price */}
                              <div className='col-lg-3 mb-3'>
                                 <label htmlFor='sellingPrice'>Selling Price<small>(Discount : {discount || 0}%)</small></label>
                                 <input name='sellingPrice' id='sellingPrice' type='number' className="form-control form-control-sm"
                                    value={pricing.sellingPrice}
                                    onChange={e => setPricing({ ...pricing, [e.target.name]: e.target.value })} />
                              </div>
                           </div>
                        </div>

                        {/* Price Details */}
                        <div className="col-lg-12 my-2">
                           <hr />
                           <b>Stock Details</b>
                           <div className="row">

                              {/* Stock */}
                              <div className='col-lg-3 mb-3'>
                                 <label htmlFor='available'>{required} Stock</label>
                                 <input className='form-control form-control-sm' name='available' id='available' type='number'
                                    onChange={(e) => setVariations({ ...variations, [e.target.name]: e.target.value })} />
                              </div>

                              {/* SKU */}
                              <div className='col-lg-3 mb-3'>
                                 <label htmlFor='sku'>{required} SKU <small>(Stock Keeping Unit)</small></label>
                                 <input className='form-control form-control-sm' name='sku' id='sku' type='text'
                                    onChange={(e) => setVariations({ ...variations, [e.target.name]: e.target.value })} />
                              </div>
                           </div>
                        </div>


                        <br />

                        <div className="col-lg-3">
                           <label htmlFor="brandColor">Brand Color</label>
                           <select name="brandColor" className='form-select' id="brandColor"
                              onChange={(e) => setVariations({ ...variations, [e.target.name]: e.target.value })}>

                              <option value="">Select Color</option>
                              {
                                 categoryFeatures?.color?.map((clr) => {
                                    return (
                                       <option key={clr} value={clr}>{clr}</option>
                                    )
                                 })
                              }
                           </select>
                        </div>

                        {
                           cSl(categoryFeatures?.variant, "variant")
                        }

                        <br />

                        {
                           cSl(categoryFeatures?.attrs, "attrs")
                        }


                     </>
                  }




                  {/* Inventory Details */}
                  <div className="col-lg-12 my-2">
                     <hr />
                     <h6>Inventory Details</h6>
                     <div className="row">
                        <div className="col-lg-3 mb-3">
                           <label htmlFor="fulfilledBy">{required} Fulfillment By</label>
                           <select name="fulfilledBy" id="fulfilledBy" className='form-select form-select-sm'>
                              <option value="">Select One</option>
                              <option value="wooKart">WooKart</option>
                              <option value="seller">Seller</option>
                           </select>
                        </div>

                        <div className="col-lg-3 mb-3">
                           <label htmlFor="procurementType">{required} Procurement Type</label>
                           <select name="procurementType" id="procurementType" className='form-select form-select-sm'>
                              <option value="">Select One</option>
                              <option value="instock">Instock</option>
                              <option value="express">Express</option>
                           </select>
                        </div>

                        <div className="col-lg-3 mb-3">
                           <label htmlFor="procurementSLA">{required} Procurement SLA</label>
                           <input type={'number'} name="procurementSLA" id="procurementSLA" className='form-control form-control-sm' />
                        </div>

                     </div>
                  </div>

                  {/* Packaging Details */}
                  <div className="col-lg-12 my-2">
                     <hr />
                     <h6>Packaging Details</h6>
                     <div className="row ">

                        <div className="col-lg-3 col-sm-6 mb-2">
                           <label htmlFor="packageWeight">Weight (kg)</label>
                           <input className='form-control form-control-sm' type="text" id='packageWeight' name="packageWeight" />
                        </div>
                        <div className="col-lg-3 col-sm-6 mb-2">
                           <label htmlFor="packageLength">Length (cm)</label>
                           <input className='form-control form-control-sm' type="text" id='packageLength' name='packageLength' />
                        </div>
                        <div className="col-lg-3 col-sm-6 mb-2">
                           <label htmlFor="packageWidth">Width (cm)</label>
                           <input className='form-control form-control-sm' type="text" id='packageWidth' name='packageWidth' />
                        </div>
                        <div className="col-lg-3 col-sm-6 mb-2">
                           <label htmlFor="packageHeight">Height (cm)</label>
                           <input className='form-control form-control-sm' type="text" id='packageHeight' name='packageHeight' />
                        </div>
                        <div className='col-lg-12 mb-3'>
                           <label htmlFor='inTheBox'>{required} What is in the box</label>
                           <input className='form-control form-control-sm' name="inTheBox" id='inTheBox' type="text" placeholder="e.g: 1 x hard disk" />
                        </div>

                     </div>
                  </div>



                  <div className="col-lg-12 my-2">
                     <hr />
                     <div className="py-2">
                        <label htmlFor="isFree">
                           Free Shipping &nbsp;
                           <input type="checkbox" name="isFree" id="isFree" />
                        </label>
                     </div>
                  </div>

                  {/* Manufacturing Details */}
                  <div className="col-lg-12 py-2">
                     <hr />
                     <h6>Manufacturing Details</h6>
                     <div className="row">
                        <div className="col-lg-3">
                           <label htmlFor="manufacturerOrigin">{required} Country Of Origin</label>
                           <select name="manufacturerOrigin" id="manufacturerOrigin" className='form-select form-select-sm'>
                              <option value="bangladesh">bangladesh</option>
                              <option value="india">India</option>
                              <option value="china">China</option>
                              <option value="pakistan">Pakistan</option>
                              <option value="taiwan">Taiwan</option>
                           </select>
                        </div>

                        <div className="col-lg-3">
                           <label htmlFor="manufacturerDetails">Manufacturer Details</label>
                           <input type="text" className='form-control form-control-sm' name='manufacturerDetails' id='manufacturerDetails' />
                        </div>

                        <div className="col-lg-3">
                           <label htmlFor="warrantyTerm">Warranty</label>
                           <select className='form-select form-select-sm' name="warrantyTerm" id="warrantyTerm"
                              onChange={(e) => setWarrantyTerm(e.target.value)}>

                              <option value="">Choose Warranty Terms</option>
                              <option value="seller_warranty">Seller Warranty</option>
                              <option value="brand_warranty">Brand Warranty</option>
                              <option value="no_warranty">No Warranty</option>
                           </select>
                        </div>

                        {
                           warrantyTerm === "seller_warranty" &&
                           <div className="col-lg-3">
                              <label htmlFor="warrantyPeriod">Choose Warranty Period</label>
                              <select className='form-select form-select-sm' name="warrantyPeriod" id="warrantyPeriod"
                                 onChange={(e) => setWarrantyPeriod(e.target.value)}>
                                 <option value="">Choose Warranty Time</option>
                                 <option value={"6-months"}>6 Months</option>
                                 <option value="1-year">1 Year</option>
                                 <option value="1.5-years">1.5 Years</option>
                                 <option value="2-years">2 Years</option>
                              </select>
                           </div>
                        }
                     </div>
                  </div>



                  {
                     categoryFeatures?.specification &&

                     <div className="col-lg-12 my-2">
                        <hr />
                        <h6>Specification</h6>
                        <div className="row">
                           {
                              cSl(categoryFeatures?.specification)
                           }
                        </div>
                     </div>
                  }

                  <div className="col-lg-12 my-2">
                     <hr />
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
                                          onChange={(e) => inputHandler(searchKeywords, setSearchKeywords, e, i)}
                                       />

                                       {
                                          searchKeywords.length !== 1 && <span className="dynamic_bt9"
                                             onClick={() => inputHandler(searchKeywords, setSearchKeywords, null, i)}>
                                             <FontAwesomeIcon icon={faMinusSquare} />
                                          </span>
                                       }
                                       {
                                          searchKeywords.length - 1 === i && <span className="dynamic_bt9"
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
                                          onChange={(e) => inputHandler(highlight, setHighlight, e, i)}
                                       />

                                       {
                                          highlight.length !== 1 && <span className="dynamic_bt9"
                                             onClick={() => inputHandler(highlight, setHighlight, null, i)}>
                                             <FontAwesomeIcon icon={faMinusSquare} />
                                          </span>
                                       }
                                       {
                                          highlight.length - 1 === i && <span className="dynamic_bt9"
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
                              type="text"
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

                     <button>Save as a draft</button>
                  </div>
               </div>
            </div >
         </form >
      </>
   );
};

export default ProductListing;