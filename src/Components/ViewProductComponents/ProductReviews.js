import React from 'react';

const ProductReviews = ({ product }) => {

   const { rating, reviews, reviewCount, ratingCount } = product ?? {};


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
                     <div className='textMute' style={{fontSize: "0.8rem", fontStyle: "italic"}}>
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
               reviews?.length > 0 ? reviews?.map((rats, index) => {
                  return (
                     <div className="col-lg-12 mb-3" key={index}>
                        <div className="card_default">
                           <div className="card_description">
                              <small className='text-primary'>{rats?.rating_point && rats?.rating_point} Out of 5</small>
                              <i className='text-muted' style={{fontSize: "0.7rem"}}>{rats?.name}</i>
                              <small>{rats?.product_review}</small>
                           </div>
                        </div>
                     </div>
                  )
               }) : <div className="p-4 d-flex align-items-center justify-content-center">
                  <p>No Reviews</p>
               </div>
            }
         </div>
      </div>
   );
};

export default ProductReviews;