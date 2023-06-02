import { useFetch } from '@/Hooks/useFetch';
import React, { useEffect, useState } from 'react';
import Pagination2 from '../Global/Pagination2';
import Spinner from '../Shared/Spinner/Spinner';
import { apiHandler } from '@/Functions/common';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const ProductReviews = ({ product, userInfo }) => {
   const [dynamicPage, setDynamicPage] = useState(2);

   const { rating, ratingCount, _id } = product ?? {};

   const [page, setPage] = useState(1);

   const { data, loading } = useFetch(`/review/product-review/${_id}?page=${page ?? 1}`);

   let { reviews, reviewCount } = data ?? {};

   useEffect(() => {
      if (reviewCount) {
         setDynamicPage(Math.ceil(reviewCount / 2));
      }
   }, [reviewCount]);


   function outputOfRating(rat) {
      let totalCount = rat.reduce((total, rats) => total + rats?.count, 0);

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
               <p style={{ width: "62px", fontSize: "0.8rem", textAlign: "right" }}>
                  {payload[weight][0]}
               </p>

               <p style={{
                  backgroundColor: "#ededed",
                  width: `${(totalCount / 100) * 100}%`,
                  flex: "1 1 0%",
                  marginLeft: "1rem",
                  marginRight: "1rem",
                  borderRadius: "10px",
                  overflow: "hidden"
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

   async function toggleLikeHandler(reviewID) {
      try {
         const { success, message, data } = await apiHandler(`/review/toggle-vote-like`, "POST", { reviewID });

         if (success) {

            reviews.forEach(review => {
               if (review?._id === reviewID) {
                  review = data;
               }
            });
         }
      } catch (error) {

      }
   }

   return (
      <div className='p_content_wrapper'>
         <h6 className='dwhYrQ'>Rating & Review Of {product?.title}</h6>
         <div className="row mt-5 border w-100">
            <div className="py-1 my-4 border-bottom">
               <div className="row">

                  <div className="col-lg-4 p-4">
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
                     <ul>
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

                     return (
                        <div className="col-lg-12 mb-3" key={index}>
                           <div className="card_default">
                              <div className="card_description">
                                 <small className='text-primary'>{review?.rating_point && review?.rating_point} Out of 5</small>
                                 <i className='text-muted' style={{ fontSize: "0.7rem" }}>By__{review?.name}</i>

                                 <p style={{ marginTop: "5px" }}>{review?.product_review}</p>

                                 <br />
                                 <div className="d-flex flex-wrap">
                                    {
                                       Array.isArray(review?.product_images) && review?.product_images.map((img, index) => {
                                          return (
                                             <img alt={`review_img_${index}`} key={index} src={img ?? ""} width="84" height="84" style={{ margin: "6px" }} />
                                          )
                                       })
                                    }
                                 </div>
                                 <div className='mt-3'>
                                    <button onClick={() => toggleLikeHandler(review?._id)} style={{
                                       border: "none",
                                       display: "inline-block",
                                       background: "transparent"
                                    }}>
                                       <FontAwesomeIcon style={review?.likes?.includes(userInfo?._uuid) ? { color: "red" } : { color: "gray" }} icon={faHeart} />
                                       &nbsp;{review?.likes?.length ?? 0}
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