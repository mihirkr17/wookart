import { useFetch } from '@/Hooks/useFetch';
import { faEllipsis, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

export default function Sellers() {

   const { data } = useFetch(`/dashboard/all-sellers`);
   const [dropAction, setDropAction] = useState(false);

   async function deleteSellerHandler() {

   }


   const toggleDropdown = (id) => {
      if (dropAction !== id) {
         setDropAction(id);
      } else {
         setDropAction(false);
      }
   }

   return (
      <div className="seller_section">
         <h5>Sellers</h5>
         <div className='table-responsive pt-4'>
            {
               data?.sellers && data?.sellers.length > 0 ?
                  <table className='table table-striped table-sm table-borderless'>
                     <thead className='table-dark'>
                        <tr>
                           <th>Email</th>
                           <th>Registered</th>
                           <th>SellerAt</th>
                           <th>Group</th>
                           <th>Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {
                           data?.sellers && data?.sellers.map((usr, ind) => {
                              return (
                                 <tr key={ind}>
                                    <td><span>{usr?.email}</span></td>
                                    <td>{usr?.createdAt}</td>
                                    <td>{usr?.becomeSellerAt}</td>
                                    <td>{usr?.role}</td>
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
                  </table> : <p className='text-center py-2'><span>No Seller Found</span></p>
            }
         </div>
      </div>
   )
}