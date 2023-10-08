// pages/category/__dynamicCategory

import Breadcrumbs from "@/Components/Shared/Breadcrumbs";
import Product from "@/Components/Shared/Product";
import { categories, filterOptions } from "@/CustomData/categories";
import { textToTitleCase } from "@/Functions/common";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export function __dynamicCategory({ products, filterData }) {
   const router = useRouter();
   const { ctg } = router.query;
   const [priceRanger, setPriceRanger] = useState(0);
   const basePath = ctg?.join("/");


   const [filterOption, setFilterOption] = useState(router.query || {});


   const handleInputChanges = (event) => {
      const { name, value, type, checked } = event.target;
      // Clone the current filter options
      const updatedOptions = { ...filterOption };

      // Update the filter options based on checkbox change
      if (type === "checkbox") {

         if (!updatedOptions[name]) {
            updatedOptions[name] = [];
         }

         // Toggle the selected value for checkboxes
         if (checked) {
            if (Array.isArray(updatedOptions[name]) && !updatedOptions[name].includes(value)) {
               updatedOptions[name].push(value);
            }
         } else {
            updatedOptions[name] = (Array.isArray(updatedOptions[name])
               ? updatedOptions[name].filter((item) => item !== value)
               : []
            );
         }
      }

      if (type === 'select-one') {
         if (!updatedOptions[name]) {
            updatedOptions[name] = "";
         }
         updatedOptions[name] = value;
      }


      // Update state with the new filter options
      setFilterOption(updatedOptions);

      // Apply filters immediately when a checkbox changes
      applyFilters(updatedOptions);
   };

   const applyFilters = (filterOpt) => {

      // Construct the URL based on filterOptions
      const queryParams = Object.keys(filterOpt)?.filter(e => e !== "ctg").map((key) => {
         const value = filterOpt[key];
         const values = Array.isArray(value) ? value.join(',') : value;
         return `${encodeURIComponent(key)}=${encodeURIComponent(values)}`;
      });

      const queryString = queryParams.join('&');
      const finalURL = `${basePath}${queryString ? `?${queryString}` : ''}`;

      // Redirect or navigate to the finalURL using router.push
      router.push(finalURL);
   };


   let lastCtg = ctg?.slice(-1)[0];

   let fc = ctg?.[0];
   let options = ctg.join(",");

   const FilterOption = filterOptions.find((f) => f?.categories.includes(lastCtg));


   let category = categories?.find(c => c?.value === fc) ?? {};

   let brands = filterData?.map(d => d?.brand).filter(e => e) ?? [];

   function generateFilterOption(attribute) {
      let arr = [];

      for (const key in attribute) {

         const value = attribute[key]

         if (Array.isArray(value)) {
            arr.push(<div key={key} className="p-1">
               <b style={{ textTransform: "capitalize" }}>{key}</b> <br />
               <div className="row">
                  <div className="col-lg-12">
                     {
                        value.map((v) => {
                           return (
                              <div key={v?.codec}>
                                 <label className="form-check-label" htmlFor={v?.codec}>
                                    <input
                                       className="form-check-input"
                                       type="checkbox"
                                       id={v?.codec}
                                       name={"filters"}
                                       value={v?.codec.toString()}
                                       checked={filterOption["filters"] && filterOption["filters"]?.includes(v?.codec.toString())
                                       }
                                       onChange={handleInputChanges}
                                    />

                                    &nbsp;&nbsp;{v.value}
                                 </label>

                              </div>
                           )

                        })
                     }
                  </div>
               </div>
            </div>);
         }
      }
      return arr;
   }


   return (
      <section className="section_default">
         <div className="container">
            <div className="py-3">
               <Breadcrumbs path={ctg}></Breadcrumbs>
            </div>
            <div className="row">
               <div className="col-lg-3">

                  <div className="p-1">
                     <b>Categories</b> <br />
                     <ul>
                        {
                           category?.children && category?.children.map(sb => {
                              return (
                                 <li key={sb?.value}>
                                    <Link style={{ fontWeight: lastCtg === sb?.value ? "bold" : "normal" }} href={`/category/${category?.value}/${sb?.value}`}>{sb?.title}</Link> <small>
                                       <FontAwesomeIcon icon={faArrowDown} />
                                    </small>

                                    <ul className='post_ctg'>
                                       {
                                          Array.isArray(sb?.children) && sb?.children.map((p) => {
                                             return (
                                                <li key={p?.value}>
                                                   <Link style={{ fontWeight: lastCtg === p?.value ? "bold" : "normal" }} href={`/category/${category?.value}/${sb?.value}/${p?.value}`}>{textToTitleCase(p?.name)}</Link>
                                                </li>
                                             )
                                          })
                                       }
                                    </ul>
                                 </li>
                              )
                           })
                        }
                     </ul>
                  </div>

                  <div className="p-1">
                     <b>Brand</b> <br />

                     {
                        brands?.map((b, i) => {
                           return (
                              <React.Fragment key={i}>
                                 <label className="form-check-label" htmlFor={"brand"}>
                                    <input type="checkbox" className="form-check-input" name={"brand"} id={"brand"} value={b} onChange={handleInputChanges}
                                       checked={filterOption["brand"] && filterOption["brand"].includes(b)}
                                    />

                                    &nbsp;&nbsp;{b}
                                 </label>
                              </React.Fragment>
                           )
                        })
                     }
                  </div>

                  {
                     generateFilterOption(FilterOption?.attributes)
                  }


                  <div className="p-1">
                     <b>Price Range</b> <br />

                     <input type="range" name="priceRange" id="priceRange" min={0} max={10000} title={priceRanger} value={priceRanger} onChange={(e) => handlePriceRanger(e)} />
                  </div>


               </div>

               <div className="col-lg-9">
                  <div className="p-2">

                     <div className="py-1">
                        <h6>
                           {
                              textToTitleCase(lastCtg)
                           }
                        </h6>
                        <small className="textMute">
                           {
                              products?.length + " items found in " + textToTitleCase(lastCtg)
                           }
                        </small>

                        <div className="filter_by py-2">

                           <select name="sorted" id="sorted" value={filterOption["sorted"] || ""} onChange={handleInputChanges}>
                              <option value="relevant">Relevant</option>
                              <option value="lowest">Lowest Price</option>
                              <option value="highest">Highest Price</option>
                           </select>


                        </div>
                     </div>

                     <div className="row">
                        {
                           Array.isArray(products) && products.map((product) => {
                              return (
                                 <Product key={product?.sku} product={product}></Product>
                              )
                           })
                        }
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section >
   )
}


export async function getServerSideProps({ params, query }) {
   const { ctg } = params;
   const { brand, sorted, price_range } = query;

   const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/product/product-by-category?categories=${ctg}`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({ brand, sorted, price_range, queries: query })
   });

   const { products, filterData } = await response.json();


   return {
      props: { products: products || [], filterData: filterData || null }
   }
}



export default withOutDashboard(__dynamicCategory, []);