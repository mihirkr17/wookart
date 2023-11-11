import React from 'react';

const ImagePreviewer = ({ previewImages, setPreviewImages }) => {
   return (
      <div className="preview_images">
         <div className="image_wrapper">
            {
               previewImages?.map((image, index) => {
                  return (
                     <div className='images' key={index}>
                        <img srcSet={image} alt="review-preview-image" width="60" height="60" />
                     </div>
                  )
               })
            }
         </div>

         {
            previewImages?.length >= 1 && <button className='bt9_status' onClick={() => setPreviewImages([])}>Clear</button>
         }
      </div>
   );
};

export default ImagePreviewer;