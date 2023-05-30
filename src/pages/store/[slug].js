import Pagination from "@/Components/Global/Pagination";
import Product from "@/Components/Shared/Product";
import { textToTitleCase } from "@/Functions/common";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import useMenu from "@/Hooks/useMenu";
import { useUrlQuery } from "@/Hooks/useUrlQuery";
import useWindowDimensions from "@/Hooks/useWindowDimensions";
import { faFilter, faFilterCircleXmark, faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

function __DynamicStore({ data, active }) {

   const { storeInfo, allProducts, filteringProductTotal, error } = data?.data ?? {};

   const { query } = useRouter();
   const [pageNumber, setPageNumber] = useState(1);
   const { windowWidth } = useWindowDimensions();

   const { menuRef, openMenu, setOpenMenu } = useMenu();

   const { urlQuery, buildDynamicURL, removeUrlQuery } = useUrlQuery();

   // const [windowWidth, setWindowWidth] = useState();

   const { page, sorted } = query;

   const [filterData, setFilterData] = useState([]);

   // useEffect(() => setWindowWidth(width), [width]);

   useEffect(() => {
      if (filteringProductTotal) {
         setPageNumber(Math.ceil(filteringProductTotal / 1));
      }
   }, [filteringProductTotal]);



   // filtering url queries
   useEffect(() => {
      const result = [];

      if (Array.isArray(urlQuery)) {
         urlQuery?.forEach((item) => {
            const values = item.split(/__|--/).slice(1).filter((value) => value !== "");
            result.push(...values);
         });

         setFilterData(result);
      }

   }, [urlQuery]);

   // page button initialization here;
   let pageBtn = [];

   for (let i = 1; i <= pageNumber; i++) {
      pageBtn.push(i);
   }

   function getAttrs(payload = []) {
      return (
         <div>
            {
               payload?.map((fItem) => {
                  const { targetFor, name, data, option } = fItem;
                  return (
                     <React.Fragment key={name}>
                        <h6 className="juKJAb">{name}</h6>
                        <ul>
                           {
                              data?.map((b, index) => {
                                 return (
                                    <li key={index}>

                                       <input type="checkbox" name={`${targetFor}_${b}`}
                                          id={`${targetFor}_${b}`}
                                          checked={filterData?.includes(b)} value={b}
                                          onChange={(e) => filterData?.includes(b) ?
                                             removeUrlQuery(page, targetFor + "__" + e.target.value) :
                                             buildDynamicURL(page, sorted, targetFor + "__" + e.target.value)}
                                       />


                                       &nbsp;&nbsp;
                                       <label htmlFor={`${targetFor}_${b}`}>
                                          {`${b} ${option?.label ?? ""}`}
                                       </label>
                                    </li>
                                 )
                              })
                           }
                        </ul>
                     </React.Fragment>
                  )
               })
            }
         </div>
      )
   }

   return (
      <div className="section_default" ref={menuRef}>
         <div className={`container store_container`}>
            <div className="store_header">

               {/* <div className="storeImg" style={{ backgroundImage: `url(${storeInfo?.store?.img})` }}></div> */}

               <div className="store_header_top">
                  <div className="sh_img">
                     <Image src="/ecom/store-official-ecommerce-svgrepo-com.svg"
                        width="60" height="60" alt="" />
                  </div>

                  <div className="sh_title">
                     <h4>{textToTitleCase(storeInfo?.store?.name ?? "Unknown")?.toUpperCase()}</h4>
                     <div className="sht_meta">
                        <span className="shtm_average_rating">
                           {storeInfo?.averageRating}
                           <FontAwesomeIcon icon={faStar} />
                        </span>

                        <span className="shtm_data_count">
                           {storeInfo?.totalRatingCount}
                           {storeInfo?.totalRatingCount >= 2 ? " Ratings" : " Rating"}
                        </span>

                        <span className="shtm_data_count">
                           {storeInfo?.totalProduct}
                           {storeInfo?.totalProduct >= 2 ? " Products" : " Product"}
                        </span>
                     </div>
                  </div>
               </div>

               <div className="store_header_bottom">

                  <div className="sorting_div">
                     <select name="targetPrice"
                        className="form-select form-select-sm"
                        id="targetPrice"
                        onChange={(e) => filterData.includes(e.target.value) ?
                           removeUrlQuery(page, e.target.value) :
                           buildDynamicURL(page, e.target.value)
                        }>
                        <option value="best-match">Best Match</option>
                        <option value="popularity">Popularity</option>
                        <option value="lowest">Lowest</option>
                        <option value="highest">Highest</option>
                     </select>
                  </div>

                  <button className="filterBtn" onClick={() => setOpenMenu(e => !e)}>
                     <FontAwesomeIcon icon={faFilter} />
                  </button>
               </div>

            </div>


            <div className="store_wrapper">
               <div className="row">
                  <div className="col-lg-3 display_side">
                     <div className="store_sidebar" style={(openMenu || windowWidth >= 567) ? { display: "block" } : { display: "none" }}>

                        <div className="store_side_top">
                           <div>
                              <span>Filters</span> <br />
                              <small className="textMute">
                                 {`${filteringProductTotal} ${filteringProductTotal >= 2 ? " Products" : "Product"}`}
                              </small>
                           </div>

                           <button onClick={() => removeUrlQuery(null, null)}>Clear</button>
                        </div>

                        <hr />
                        {
                           getAttrs([
                              { name: "Category", targetFor: "categories", data: storeInfo?.categories },
                              { name: "Brands", targetFor: "brand", data: storeInfo?.brands },
                              { name: "Ratings", targetFor: "rating", data: ["1", "2", "3", "4"], option: { label: "and Above" } }
                           ])
                        }

                     </div>
                  </div>
                  <div className="col-lg-9 output_products">
                     <div className="row">
                        {
                           allProducts?.length >= 1 ? allProducts?.map((product) => {
                              return (
                                 <div key={product?._lid} className="col-lg-3">
                                    <Product product={product}></Product>
                                 </div>
                              )
                           }) : <p>No product found</p>
                        }
                     </div>

                     <div className="p-4 d-flex justify-content-center align-items-center">
                        <Pagination dynamicPageNumber={pageNumber} buildDynamicURL={buildDynamicURL} />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export async function getServerSideProps({ query, params }) {

   const { slug } = params;
   const { page, filters, sorted } = query;
   const regex = /[<>{}|\\^%]/g;

   const url = `${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/store/${slug}?page=${page ?? 1}&filters=${filters ?? ""}&sorted=${sorted ?? ""}`

   const response = await fetch(url.replace(regex, ""));

   if (!response.ok) {
      return {
         props: {
            data: {
               error: "Invalid response !"
            }
         }
      }
   }

   const data = await response.json();


   return { props: { data, active: "active" } }
}

export default withOutDashboard(__DynamicStore, []);