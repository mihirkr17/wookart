import { useFetch } from '@/Hooks/useFetch';
import React, { useEffect, useState } from 'react';
import Pagination2 from '../Global/Pagination2';
import Spinner from '../Shared/Spinner/Spinner';
import { apiHandler } from '@/Functions/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import GenerateStar from '../Shared/GenerateStar';

const ProductReviews = ({ product, userInfo }) => {
   const [dynamicPage, setDynamicPage] = useState(2);

   const { rating, ratingCount, _id } = product ?? {};

   const [page, setPage] = useState(1);

   const [sorting, setSorting] = useState("");

   const { data, loading, refetch } = useFetch(`/review/product-review/${_id}?page=${page ?? 1}&sort=${sorting ?? ""}`);

   let { reviews, reviewCount } = data ?? {};

   useEffect(() => {
      setDynamicPage(Math.ceil(reviewCount / 2));

   }, [reviewCount]);

   function outputOfRating(rat) {
      let totalCount = rat?.reduce((total, rats) => total + rats?.count, 0);

      return rat?.map((rat, index) => {
         const { weight, count } = rat;
         let percentage = (count / totalCount) * 100;

         let payload = {
            1: ["Poor", "red"], 2: ["Average", "rgb(236, 128, 61)"],
            3: ["Good", "rgb(244, 183, 67)"], 4: ["Very Good", "green"], 5: ["Excellent", "rgb(6, 167, 89)"]
         };
         return (
            <li key={index} style={{
               width: `${100}%`, display: "flex",
               alignItems: "center",
               justifyContent: "space-between"
            }}>
               <p style={{
                  width: "62px",
                  fontSize: "0.8rem",
                  textAlign: "right",
                  marginBottom: "unset"
               }}>
                  {payload[weight][0]}
               </p>

               <p style={{
                  backgroundColor: "#ededed",
                  width: `${(totalCount / 100) * 100}%`,
                  flex: "1 1 0%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                  borderRadius: "10px",
                  overflow: "hidden",
                  marginBottom: "unset"
               }}>
                  <span style={{
                     width: `${percentage}%`, display: "block", height: "10px",
                     backgroundColor: payload[weight][1]
                  }}> </span>
               </p>
               <p style={{ flex: "0.1 1 0%", fontSize: "0.8rem" }}>{count}</p> </li>
         )
      })
   }

   async function toggleLikeHandler(reviewID, action) {
      try {
         const { success, message, data } = await apiHandler(`/review/toggle-vote`, "POST", { reviewID, action });

         if (success) {
            refetch();
         }
      } catch (error) {

      }
   }




   return (
      <div className='p_content_wrapper'>
         <h6 className='h6_title'>Rating & Review Of {product?.title}</h6>

         <div className="py-3">
            Sort By&nbsp;
            <select name="sorting" id="sorting" onChange={(e) => setSorting(e.target.value)}>
               <option value="relevant">Relevant</option>
               <option value="asc">Low To High</option>
               <option value="dsc">High To Low</option>
            </select>
         </div>
         <div className="row my-2">
            <div className="py-1 mb-4 border col-12">
               <div className="row align-items-center py-3">

                  <div className="col-lg-4">
                     <p className='text-warning'>
                        <span className="fs-1">
                           {(product?.ratingAverage) || 0}
                        </span>
                        <span className="fs-4 text-muted">/5</span>
                     </p>
                     <div className='textMute' style={{ fontSize: "0.8rem", fontStyle: "italic" }}>
                        {reviewCount ?? 0} Reviews, <br />
                        {ratingCount ?? 0} Ratings
                     </div>
                  </div>

                  <div className='col-lg-8'>
                     <ul style={{ marginBottom: "unset" }}>
                        {
                           outputOfRating(rating)
                        }
                     </ul>
                  </div>

               </div>
            </div>

            {
               loading ? <p>Loading reviews...</p> : <div>
                  {reviews?.length > 0 ? reviews?.map((review, index) => {

                     const { _id, verified_purchase, rating_point, likes, product_images, comments, name } = review ?? {};

                     return (
                        <div className="col-lg-12 mb-3" key={index}>
                           <div style={{ borderBottom: "1px solid #dbdbdb" }}>
                              <div className="card_description">
                                 {<GenerateStar star={rating_point} starSize={"12px"} />}

                                 <div className="py-1 d-flex">
                                    <i className='text-muted' style={{ fontSize: "0.7rem" }}>By__{name}</i>
                                    {
                                       verified_purchase &&
                                       <span style={{ fontSize: "0.7rem", marginLeft: "20px", color: "#009d00" }}>
                                          <FontAwesomeIcon style={{ color: "#009d00" }} icon={faShield} /> Verified Purchase
                                       </span>
                                    }

                                 </div>

                                 <p style={{ marginTop: "5px" }}>{comments}</p>

                                 <br />

                                 <div className="preview_images">
                                    <div className="image_wrapper">
                                       {
                                          Array.isArray(product_images) && product_images.map((img, index) => {
                                             return (
                                                <div className="images" key={index}>
                                                   <img alt={`review_img_${index}`} src={img ?? ""} width="64" height="64" />
                                                </div>
                                             )
                                          })
                                       }
                                    </div>
                                 </div>

                                 <div className='mt-3'>
                                    <button onClick={() => toggleLikeHandler(_id, "like")} style={{
                                       border: "none",
                                       display: "inline-block",
                                       background: "transparent"
                                    }}>
                                       <FontAwesomeIcon style={likes?.includes(userInfo?._uuid) ? { color: "red" } : { color: "gray" }} icon={faThumbsUp} />
                                       &nbsp;&nbsp;{likes?.length ?? 0}
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     )
                  }) : <div className="p-4 d-flex align-items-center justify-content-center">
                     <p>No Reviews</p>
                  </div>
                  }
               </div>
            }


            <div className='p-4 d-flex justify-content-center align-items-center'>
               <Pagination2 dynamicPageNumber={dynamicPage} page={page} setPage={setPage}></Pagination2>
            </div>
         </div>
      </div>
   );
};

export default ProductReviews;