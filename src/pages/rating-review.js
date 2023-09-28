import ImagePreviewer from '@/Components/Shared/ImagePreviewer';
import Spinner from '@/Components/Shared/Spinner/Spinner';
import { apiHandler } from '@/Functions/common';
import { useFetch } from '@/Hooks/useFetch';
import { useAuthContext } from '@/lib/AuthProvider';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const RatingReview = () => {
   const { setMessage, userInfo } = useAuthContext();

   const [reviewLoading, setReviewLoading] = useState(false);

   const [previewImages, setPreviewImages] = useState([]);

   const [reviewImages, setReviewImages] = useState([]);

   const [star, setStar] = useState(5);

   const router = useRouter();
   const { query } = router;

   const { pid, oid, sku } = query;

   const { data, loading } = useFetch((pid && sku && oid) && `/review/product-details?pid=${pid}&sku=${sku}&oid=${oid}`);

   const { imageUrl, title, ratingAverage, ratingCount, _id } = data?.response ?? {};

   const maxSize = 500 * 1024; // 500 KB

   const ratingStatus = {
      1: ["Poor", "red"], 2: ["Average", "rgb(236, 128, 61)"],
      3: ["Good", "rgb(244, 183, 67)"], 4: ["Very Good", "green"], 5: ["Excellent", "rgb(6, 167, 89)"]
   };


   async function handleProductReview(e) {
      try {
         e.preventDefault();
         const description = e.target.review_description.value;
         let lengthOfImg = reviewImages.length;


         if (lengthOfImg >= 6) {
            return setMessage("Maximum 5 image can upload !", "danger");
         }

         setReviewLoading(true);

         const promises = [];

         for (let i = 0; i < lengthOfImg; i++) {
            const formData = new FormData();
            let file = reviewImages[i];

            if (file.size > maxSize) {
               continue;
            }

            formData.append('file', file);
            formData.append('upload_preset', 'review_images');

            promises.push(
               fetch('https://api.cloudinary.com/v1_1/duixvo0uu/image/upload', {
                  method: 'POST',
                  body: formData,
               }).then(response => response.json())
                  .catch(error => console.error('Error:', error))
            );
         }

         const responses = await Promise.all(promises);

         let imgUrls = responses?.map(img => img?.secure_url);


         const { success, message } = await apiHandler(`/review/add-product-rating`, "POST", {
            name: userInfo?.fullName,
            description,
            orderId: oid,
            productId: _id,
            ratingWeight: star,
            reviewImage: imgUrls ?? []
         });

         setReviewLoading(false);

         if (success) {
            setMessage(message, "success");
            return router.push(`/user/my-reviews`);
         }

         return setMessage(message, "danger");

      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }

   function starsFunc(s) {
      let stars = [];
      let maxStar = 5;

      s = Array.from({ length: s }, (any, index) => index + 1);

      for (let i = 1; i <= maxStar; i++) {

         stars.push(
            <span key={i} onClick={() => setStar(i)}>
               <FontAwesomeIcon icon={faStar}
                  style={{
                     color: s.includes(i) ? "rgb(251 193 0)" : "gray",
                     fontSize: "20px" ?? "1.2rem", marginRight: "6px"
                  }} />
            </span>
         )
      }

      return stars;
   }



   // preview images
   function handleImagesPreview(e) {
      const files = Array.from(e.target.files);
      const readers = [];

      if (files?.length >= 6) return setMessage("Minimum 5 images are allowed !", "danger");

      files.forEach((file) => {

         if (file.size > maxSize) {
            return setMessage("Only 4 kb file size allowed !", "danger");
         }

         const reader = new FileReader();

         reader.onload = function (e) {
            setPreviewImages((prevImages) => [...prevImages, e.target.result]);
            setReviewImages(img => [...img, file]);
         };

         reader.readAsDataURL(file);
         readers.push(reader);
      });
   }

   const reviewFaqs = [
      {
         id: 1,
         question: "Have you used this product?",
         answer: "Your review should be about your experience with the product."
      },
      {
         id: 2,
         question: "Why review a product?",
         answer: "Your valuable feedback will help fellow shoppers decide!"
      },
      {
         id: 3,
         question: "How to review a product?",
         answer: "Your review should include facts. An honest opinion is always appreciated. If you have an issue with the product or service please contact us from the help centre."
      }
   ]


   if (loading) return <Spinner />

   return (
      <div className='section_default'>

         {
            data?.hasOwnProperty("response") ?
               <div className="container">

                  <div className="row">
                     <div className="col-12">
                        <div className="mb-3 card_default card_description">
                           <div className='d-flex align-items-center justify-content-between'>
                              <h4>Rating & Reviews</h4>
                              <div className='d-flex align-items-center justify-content-between'>
                                 <div className='d-flex flex-column'>
                                    <h6>{title?.slice(0, 20) + "..."}</h6>
                                    <div>
                                       <b className='badge bg-success me-2'>{ratingAverage}</b>
                                       <span className='textMute'>({
                                          ratingCount
                                       })</span>
                                    </div>
                                 </div>
                                 <div className="p-1">
                                    <img src={imageUrl ?? ""} width="50" height="50" alt="" />
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                     <div className="col-lg-4">
                        <div className="card_default card_description">
                           <h5 className='mb-4'>What makes a good review</h5>

                           {
                              reviewFaqs?.map((faq) => {
                                 return (
                                    <div key={faq?.id} className='d-flex flex-column my-2'>
                                       <h6>{faq?.question}</h6>
                                       <p>{faq?.answer}</p>
                                       <hr />
                                    </div>
                                 )
                              })
                           }
                        </div>
                     </div>

                     <div className="col-lg-8">

                        {
                           data?.message ? <div className="card_default card_description">
                              <h2>{data?.message}</h2>
                           </div> :
                              <div className="card_default card_description">
                                 <div className='py-2'>
                                    <h5>Rate this product</h5>
                                    <div className='d-flex align-items-center mt-3'>
                                       <div>
                                          {starsFunc(star)}
                                       </div>

                                       <span style={{
                                          color: ratingStatus[star][1],
                                          fontWeight: "bolder",
                                          marginLeft: "10px"
                                       }}>{ratingStatus[star][0]}</span>
                                    </div>
                                 </div>

                                 <hr />

                                 <div className="py-2">
                                    <h5>Review this product</h5>
                                    <form
                                       className=""
                                       encType="multipart/form-data"
                                       style={{ backgroundColor: "white", padding: "10px" }}
                                       onSubmit={handleProductReview}>

                                       <div className="input_group textarea_group">
                                          <label htmlFor="review_description">Write review</label> <br />
                                          <textarea name="review_description" id="review_description" style={{ width: "100%" }} rows="5" placeholder='Description...'></textarea>
                                       </div>

                                       <div className="d-flex align-items-center justify-content-between">
                                          <div className="input_group" style={{ position: "relative" }}>
                                             <label htmlFor="images" className='imagesLabel'></label>
                                             <input type="file" accept="image/*" name="images" id="images" multiple onChange={(e) => handleImagesPreview(e)} />

                                          </div>

                                          <ImagePreviewer previewImages={previewImages} setPreviewImages={setPreviewImages} />

                                          {
                                             reviewLoading ? <p>Loading...</p> : <button className="bt9_primary">Submit</button>
                                          }

                                       </div>

                                       <small className='textMute'>
                                          <pre>
                                             1. Maximum 5 images can be uploaded, <br />
                                             2. Image size should be maximum 500 kb are allowed.<br />
                                             3. Only (png, webp, jpg, jpeg) are allowed.
                                          </pre>
                                       </small>
                                    </form>
                                 </div>
                              </div>
                        }



                     </div>


                  </div>
               </div> : <div className='container'>
                  <h2>Something Wrong</h2>
               </div>
         }
      </div >
   );
};

export default RatingReview;