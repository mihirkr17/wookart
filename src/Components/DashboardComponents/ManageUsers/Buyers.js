
import { apiHandler } from '@/Functions/common';
import { useFetch } from '@/Hooks/useFetch';
import { faEllipsis, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import BuyerInfoModal from './Modals/BuyerInfoModal';



export default function Buyers() {

   const { data } = useFetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/dashboard/all-buyers`);
   const [dropAction, setDropAction] = useState(false);
   const [getUserInfo, setGetUserInfo] = useState(false);

   async function deleteSellerHandler() {

   }


   const toggleDropdown = (id) => {
      if (dropAction !== id) {
         setDropAction(id);
      } else {
         setDropAction(false);
      }
   }

   async function getUserInfoHandler(id, email) {
      try {
         const { data, success } = await apiHandler(`/dashboard/get-buyer-info`, "POST", { id, email });

         if (success) {
            setGetUserInfo(data);
         }
      } catch (error) {

      }
   }


   return (
      <>
         {
            getUserInfo && <BuyerInfoModal
               closeModal={() => setGetUserInfo(false)}
               data={getUserInfo}
            ></BuyerInfoModal>
         }

         <div className="seller_section">
            <h5>Buyers</h5>
            <div className='table-responsive pt-4'>
               {
                  data?.buyers && data?.buyers.length > 0 ?
                     <table className='table table-striped table-sm table-borderless'>
                        <thead className='table-dark'>
                           <tr>
                              <th>Email</th>
                              <th>Registered</th>
                              <th>Status</th>
                              <th>Group</th>
                              <th>Action</th>
                           </tr>
                        </thead>
                        <tbody>
                           {
                              data?.buyers && data?.buyers.map((usr, ind) => {
                                 return (
                                    <tr key={ind}>
                                       <td><span>{usr?.email}</span></td>
                                       <td>{usr?.createdAt}</td>
                                       <td>{usr?.accountStatus}</td>
                                       <td>{usr?.role}</td>
                                       <td>
                                          <button onClick={() => getUserInfoHandler(usr?._id, usr?.email)}>Get Info</button>
                                       </td>
                                       <td style={{ position: 'relative' }}>
                                          <button onClick={() => toggleDropdown(usr?._id)} style={{ background: 'transparent', border: 'none', fontSize: '1.1rem' }}>
                                             <FontAwesomeIcon icon={faEllipsisV} />
                                          </button>

                                          <ul style={dropAction === usr?._id ? {
                                             display: 'block',
                                             position: 'absolute',
                                             padding: '0.5rem',
                                             inset: '0px auto auto 0px',
                                             borderRadius: '4px',
                                             backgroundColor: 'white',
                                             minWidth: '10rem',
                                             transform: 'translate(-95px, 30px)'
                                          } : { display: "none" }}>

                                             <li>
                                                <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => deleteSellerHandler(usr?._id)}>
                                                   Delete
                                                </span>
                                             </li>
                                          </ul>

                                       </td>
                                    </tr>
                                 )
                              })
                           }
                        </tbody>
                     </table> : <p className='text-center py-2'><span>No Buyers Found</span></p>
               }
            </div>
         </div>
      </>
   )
}