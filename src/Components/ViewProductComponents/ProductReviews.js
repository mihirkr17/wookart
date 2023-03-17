import React from 'react';

const ProductReviews = ({ product }) => {
   return (
      <div className='pt-5'>
         <h5 id='rating'>Rating & Review Of {product?.title}</h5>
         <div className="row mt-5 border w-100">
            <div className="py-1 my-4 border-bottom">
               <div className="row">
                  <div className="col-lg-12">
                     <div className="p-4">
                        <p className='text-warning'>
                           <span className="fs-1">
                              {(product?.ratingAverage) || 0}
                           </span>
                           <span className="fs-4 text-muted">/5</span>
                        </p>
                        <div>
                           {product?.reviews && product?.reviews.length} Reviews
                        </div>
                     </div>
                  </div>
               </div>
            </div>
            {
               product?.reviews && product?.reviews.length > 0 ? product?.reviews.map((rats, index) => {
                  return (
                     <div className="col-lg-12 mb-3" key={index}>
                        <div className="card_default">
                           <div className="card_description">
                              <small className='text-warning'>{rats?.rating_point && rats?.rating_point} Out of 5</small>
                              <i className='text-muted'>{rats?.rating_customer && rats?.rating_customer}</i>
                              <small>{rats?.rating_description && rats?.rating_description}</small>
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