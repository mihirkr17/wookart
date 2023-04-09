
import { apiHandler } from '@/Functions/common';
import { useFetch } from '@/Hooks/useFetch';
import { faEllipsis, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import BuyerInfoModal from './Modals/BuyerInfoModal';
import { useRouter } from 'next/router';



export default function Buyers() {

   const [url, setUrl] = useState("");
   const { data, loading } = useFetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/dashboard/all-buyers${url}`);
   const [dropAction, setDropAction] = useState(false);
   const [getUserInfo, setGetUserInfo] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [item, setItem] = useState(1);
   const [page, setPage] = useState(1);

   useEffect(() => {
      setItem((data?.totalBuyerCount && Math.ceil(parseInt(data?.totalBuyerCount) / 2)));
   }, [data?.totalBuyerCount]);

   useEffect(() => {
      setUrl(`?search=${searchQuery}&page=${page}&item=${item || 1}`);
   }, [searchQuery, page, item]);

   const pageBtn = [];

   for (let i = 1; i <= item; i++) {
      pageBtn.push(i);
   }


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

            <div className="py-1">
               <input className='form-control form-control-sm' type="search" name="search" id="search" placeholder='Search by email...' onChange={(e) => setSearchQuery(e.target.value)} />
            </div>

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
                              loading ? <tr><td>Loading...</td></tr> : data?.buyers && data?.buyers.map((usr, ind) => {
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

            <div>
               <div className="py-3 text-center pagination_system">
                  <ul className='pagination justify-content-center pagination-sm'>
                     {item >= 0 ? pageBtn.map((p, i) => {
                        return (
                           <button className={`page-item ${page === p && " bg-dark text-light"}`} style={{
                              padding: "0.1rem 0.3rem",
                              fontSize: "0.8rem",
                              border: "1px solid black",
                              backgroundColor: "white",
                              borderRadius: "3px",
                              margin: "0.2rem"
                           }} key={i} onClick={() => setPage(p)}>
                              {p}
                           </button>
                        );
                     }) : ""}
                  </ul>
               </div>
            </div>
         </div >
      </>
   )
}