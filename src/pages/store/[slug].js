import Product from "@/Components/Shared/Product";
import { textToTitleCase } from "@/Functions/common";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import { useUrlQuery } from "@/Hooks/useUrlQuery";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function __DynamicStore({ data }) {

   const { query } = useRouter();
   const [pageNumber, setPageNumber] = useState(1);

   const { urlQuery, buildDynamicURL, removeUrlQuery } = useUrlQuery();

   const { category, page } = query;
   const { storeInfo, allProducts, filteringProductTotal, error } = data ?? {};
   const [filterData, setFilterData] = useState([]);


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

   function getAttrs(attrs = [], targetFor = "", option = {}) {
      return (
         <ul>
            {
               attrs?.map((b, index) => {
                  return (
                     <li key={index}>

                        <input type="checkbox" name={`${targetFor}_${b}`}
                           id={`${targetFor}_${b}`}
                           checked={filterData?.includes(b)} value={b}
                           onChange={(e) => filterData?.includes(b) ?
                              removeUrlQuery(page, targetFor + "__" + e.target.value) :
                              buildDynamicURL(page, targetFor + "__" + e.target.value)}
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
      )
   }

   return (
      <div className="section_default">
         <div className="container">
            <div className="store_header">
               <div className="store_header_img">
                  <img src="/ecom/store-official-ecommerce-svgrepo-com.svg"
                     width="60" height="60" alt="" />
               </div>

               <div className="store_header_title">
                  <h4>{textToTitleCase(data?.storeInfo?.storeName)?.toUpperCase()}</h4>
                  <div className="store_meta">
                     <span className="store_average_rating">
                        {data?.storeInfo?.averageRating}
                        <FontAwesomeIcon icon={faStar} />
                     </span>
                     <span className="store_data_count">
                        {data?.storeInfo?.totalRatingCount}
                        {storeInfo?.totalRatingCount >= 2 ? " Ratings" : " Rating"}
                     </span>

                     <span className="store_data_count">
                        {data?.storeInfo?.totalProduct}
                        {storeInfo?.totalProduct >= 2 ? " Products" : " Product"}
                     </span>
                  </div>
               </div>

            </div>


            <div className="store_wrapper">
               <div className="row">
                  <div className="col-lg-3">
                     <div className="store_sidebar">

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

                        <h6 className="juKJAb">Category</h6>
                        {
                           getAttrs(storeInfo?.categories, "categories")
                        }

                        <hr />

                        <h6 className="juKJAb">Brand</h6>

                        {getAttrs(storeInfo?.brands, "brand")}

                        <h6 className="juKJAb">Ratings</h6>
                        {
                           getAttrs(["1", "2", "3", "4"], "rating", { label: "and Above" })
                        }

                     </div>
                  </div>
                  <div className="col-lg-9">
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
                        <ul className="pagination pagination-sm">
                           {
                              page >= 2 &&
                              <li className="page-item">
                                 <button className="page-link" onClick={() => buildDynamicURL(page ? parseInt(page) - 1 : 1, category)}>Prev</button>
                              </li>
                           }
                           {

                              pageBtn?.map((p, i) => {
                                 return (
                                    <li className="page-item" key={i}>
                                       <button className="page-link" onClick={() => buildDynamicURL(p, category)}>{p}</button>
                                    </li>
                                 )
                              })
                           }

                           {
                              ((page ?? 1) < pageBtn.length) &&
                              <li className="page-item">
                                 <button className="page-link" onClick={() => buildDynamicURL(page ? parseInt(page) + 1 : 2, category)}>Next</button>
                              </li>
                           }
                        </ul>
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
   const { page, filters } = query;
   const regex = /[<>{}|\\^%]/g;

   const url = `${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/store/${slug}?page=${page ?? 1}&filters=${filters ?? ""}`

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

   return { props: data }
}

export default withOutDashboard(__DynamicStore, []);