import React from 'react';

const ReviewForm = () => {


   async function handleProductReview(e) {
      try {
         e.preventDefault();
         const productReview = e.target.productReview.value;
         const itemID = e.target.itemID.value;
         const productID = e.target.productID.value;
         const ratingWeight = e.target.ratingWeight.value;



         let lengthOfImg = e.target.images.files.length;

         if (lengthOfImg >= 6) {
            return setMessage("Maximum 5 image can upload !", "danger");
         }

         setReviewLoading(true);
         const promises = [];
         for (let i = 0; i < lengthOfImg; i++) {
            const formData = new FormData();
            formData.append('file', e.target.images.files[i]);
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
            name: userInfo?.fullName, productReview, orderID, productID, itemID, ratingWeight, reviewImage: imgUrls ?? []
         });

         setReviewLoading(false);

         if (success) {
            setOpenReviewForm(false);
            setMessage(message, "success");
            return refetch();
         }

         return setMessage(message, "danger");

      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }

   return (
      <div>
         <form
            className="review_form"
            encType="multipart/form-data"
            style={{ backgroundColor: "white", padding: "10px" }}
            onSubmit={handleProductReview}>

            <div className="input_group">
               <label htmlFor="images">Review images</label> <br />
               <input type="file" accept="image/*" name="images" id="images" multiple />
            </div>

            <div className="input_group">
               <label htmlFor="ratingWeight">Select Stars ({ratingPoints})</label> <br />
               <input type="range" name="ratingWeight" id="ratingWeight" min="1"
                  max="5" step="1"
                  onChange={(e) => setRatingPoints(e.target.value || "5")} />
            </div>

            <div className="input_group">
               <label htmlFor="productReview">Write product review</label> <br />
               <textarea name="productReview" id="productReview" cols="30" rows="5"></textarea>
            </div>

            <div className="input_group">
               <input type="hidden" id="productID" name="productID" value={productID} />
               <input type="hidden" id="itemID" name="itemID" value={itemID} />

               {
                  reviewLoading ? <p>Loading...</p> : <button className="bt9_edit">Submit</button>
               }

            </div>
         </form>
      </div>
   );
};

export default ReviewForm;