import Product from "@/Components/Shared/Product";
import { apiHandler, textToTitleCase } from "@/Functions/common";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import { faStar, faStarAndCrescent } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
function __DynamicStore({ data }) {

   const router = useRouter();
   const { slug } = router.query;

   const { storeInfo, allProducts } = data;

   return (
      <div className="section_default">
         <div className="container">
            <div className="store_header">
               <div className="store_header_img">
                  <img src="/ecom/store-official-ecommerce-svgrepo-com.svg"
                     width="60" height="60" alt="" />
               </div>

               <div className="store_header_title">
                  <h4>{textToTitleCase(data?.storeInfo?.storeName).toUpperCase()}</h4>
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
                        <h6 className="juKJAb">Category</h6>
                        <ul>
                           {
                              Array.isArray(storeInfo?.categories) && storeInfo?.categories.map((category, index) => {
                                 return (
                                    <li key={index}>
                                       <input type="checkbox" name="category" id="category" />&nbsp;&nbsp;{textToTitleCase(category)}
                                    </li>
                                 )
                              })
                           }
                        </ul>

                        <h6 className="juKJAb">Brand</h6>
                        <ul>
                           {
                              Array.isArray(storeInfo?.brands) && storeInfo?.brands.map((brand, index) => {
                                 return (
                                    <li key={index}>
                                       <input type="checkbox" name="brand" id="brand" />&nbsp;&nbsp;{textToTitleCase(brand)}
                                    </li>
                                 )
                              })
                           }
                        </ul>
                     </div>
                  </div>
                  <div className="col-lg-9">
                     <div className="row">
                        {
                           Array.isArray(allProducts) && allProducts.map((product, index) => {
                              return (
                                 <div key={product?._lid} className="col-lg-3">
                                    <Product product={product}></Product>
                                 </div>
                              )
                           })
                        }
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

   const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/store/${slug}?limit=${6}`);

   const data = await response.json();

   return { props: data }
}

export default withOutDashboard(__DynamicStore, []);