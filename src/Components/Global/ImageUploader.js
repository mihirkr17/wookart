import { faMinusSquare, faPlusSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import ImagePreviewer from '../Shared/ImagePreviewer';
import { useBaseContext } from '@/lib/BaseProvider';

const ImageUploader = ({ images, setImages }) => {
   const [imageUrls, setImageUrls] = useState([]);
   const [previewImages, setPreviewImages] = useState([]);
   const { setMessage } = useBaseContext();

   const maxSize = 500 * 1024; // 500 KB
   // images upload handlers 
   const imageInputHandler = (e, index) => {
      const { value } = e.target;
      let list = [...images];
      list[index] = value;
      setImages(list);
   }

   const removeImageInputFieldHandler = (index) => {
      let listArr = [...images];
      listArr.splice(index, 1);
      setImages(listArr);
   }


   // preview the selected images from client local computer
   function handleImagesPreview(e) {
      const files = Array.from(e.target.files);
      const readers = [];

      files.forEach((file) => {
         const reader = new FileReader();

         // if file size greater than max size then throwing errors... 
         if (file.size > maxSize) {
            return setMessage("Only 4 kb file size allowed !", "danger");
         }


         reader.onload = function (e) {
            setPreviewImages((prevImages) => [...prevImages, e.target.result]);
            setImageUrls(img => [...img, file]);
         };

         reader.readAsDataURL(file);
         readers.push(reader);
      });
   }


   // uploading variation images to the cloudinary server
   async function uploadImageHandler(e) {
      try {
         e.preventDefault();

         const promises = [];
         let lengthOfImg = imageUrls.length;


         if (lengthOfImg >= 6) {
            return setMessage("Maximum 5 image can upload !", "danger");
         }

         for (let i = 0; i < lengthOfImg; i++) {

            const formData = new FormData();

            let file = imageUrls[i];

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

         let urls = responses?.map(img => img?.secure_url);

         setImages(prevUrls => [...prevUrls, ...urls]);

         return urls ? setMessage("Image uploaded.", "success") :
            setMessage("Failed to upload !", "danger");
      } catch (error) {
         setMessage("Failed to upload !", "danger");
      }
   }


   return (

      <div className="col-lg-12 py-2">
         <form encType='multipart/form-data' onSubmit={uploadImageHandler}>
            <div className="py-2" style={{ position: "relative" }}>
               <label htmlFor="images" className='imagesLabel'></label>
               <input type="file" accept='image/*' name='images' id="images" multiple onChange={(e) => handleImagesPreview(e)} />

               <br />

            </div>

            <ImagePreviewer previewImages={previewImages} setPreviewImages={setPreviewImages} />

            <small className='textMute'>
               <pre>
                  1. Maximum 5 images can be uploaded, <br />
                  2. Image size should be maximum 500 kb are allowed.<br />
                  3. Only (png, webp, jpg, jpeg) are allowed.
               </pre>
            </small>

            <div className="input_group">
               <button className='bt9_primary'>Upload Product Images</button>
            </div>
         </form>




         <label htmlFor='existImages'>Image(<small>Product Image</small>)&nbsp;</label>
         {
            Array.isArray(images) && images?.map((img, index) => {
               return (
                  <div className="py-2 d-flex align-items-end justify-content-start" key={index}>
                     <input className="form-control form-control-sm" name="existImages" id='existImages' type="text"
                        placeholder='Image url' value={img} onChange={(e) => imageInputHandler(e, index)} />

                     {
                        images.length !== 1 && <span className='bt9_dynamic'
                           onClick={() => removeImageInputFieldHandler(index)}>
                           <FontAwesomeIcon icon={faMinusSquare} />
                        </span>
                     } {
                        images.length - 1 === index && <span className='bt9_dynamic'
                           onClick={() => setImages([...images, ''])}>
                           <FontAwesomeIcon icon={faPlusSquare} />
                        </span>
                     }

                  </div>
               )
            })
         }
         <div className="py-2" style={{ display: "flex", alignItems: "center" }}>
            {
               images && images?.map((img, index) => {
                  return (
                     img ? <img width="80" height="80" style={{ objectFit: "contain", margin: "4px" }} key={index} srcSet={img} alt="Image" /> : ""
                  )
               })
            }
         </div>
      </div>

   );
};

export default ImageUploader;