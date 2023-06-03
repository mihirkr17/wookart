import { useFetch } from '@/Hooks/useFetch';
import { useAuthContext } from '@/lib/AuthProvider';
import Link from 'next/link';
import React from 'react';
import GenerateStar from '../Shared/GenerateStar';

const MyReviews = () => {
   const { userInfo } = useAuthContext();
   const { data } = useFetch(userInfo?.role === "BUYER" && `/review/my-reviews/${userInfo?._uuid}`);

   const { reviews } = data ?? {};


   return (
      <div className="container">

         <h5 className="py-4 text-start">
            My Reviews
         </h5>

         <div className="row">
            {
               Array.isArray(reviews) && reviews.map((review) => {
                  const { _id, orderAT, item, seller, rating_point, likes, comments, product_images } = review;

                  return (
                     <div key={_id} className="col-12 mb-2">
                        <div className="card_default">
                           <div className="card_description">

                              <h6 className='textMute'>Purchased On {orderAT?.time}</h6>

                              <small>Your Product rating & review:</small>

                              <div className='py-2'>
                                 <div className="d-flex">
                                    <div className="p-1 d-flex align-items-start justify-content-center">
                                       <img src={item?.image ?? ""} alt="" width="50" height="50" />
                                    </div>

                                    <ul>
                                       <li>
                                          <Link href={`/product/${item?.slug}?pId=${item?.productID}&vId=${item?.variationID}`}>
                                             {item?.title}
                                          </Link>
                                       </li>
                                       <li>
                                          <div className="my-4">
                                             <GenerateStar star={rating_point ?? 5} />
                                          </div>
                                       </li>
                                       <li>

                                          <div style={{
                                             padding: "15px 12px",
                                             border: "1px solid #d5d5d5",
                                             whiteSpace: "pre-wrap",
                                             fontSize: "14px",
                                             color: "#212121",
                                             background: "#eff0f5",
                                             margin: "12px 0"
                                          }}>
                                             {comments}
                                          </div>

                                       </li>

                                       <li>
                                          <div className="d-flex flex-wrap">
                                             {
                                                Array.isArray(product_images) && product_images.map((img, index) => {
                                                   return (
                                                      <img alt={`review_img_${index}`} key={index} src={img ?? ""} width="70" height="70" style={{ margin: "6px" }} />
                                                   )
                                                })
                                             }
                                          </div>
                                       </li>
                                    </ul>
                                 </div>
                              </div>

                           </div>
                        </div>
                     </div>
                  )
               })
            }
         </div>
      </div>
   );
};

export default MyReviews;