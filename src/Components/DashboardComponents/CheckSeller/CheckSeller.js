import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import Spinner from '@/Components/Shared/Spinner/Spinner';
import { useBaseContext } from '@/lib/BaseProvider';
import { useAdminContext } from '@/lib/AdminProvider';
import { apiHandler } from '@/Functions/common';

const CheckSeller = () => {
   const { setMessage } = useBaseContext();
   const [modals, setModals] = useState(false);

   const { data, loading, refetch } = useAdminContext();

   if (loading) return <Spinner></Spinner>;

   const makeSellerHandler = async (userId, uuid, userEmail) => {

      if (!userId || !uuid || !userEmail) {
         return;
      }

      if (window.confirm("Make Seller ?")) {

         const { success, message } = await apiHandler(`/dashboard/verify-seller-account`, "POST", { id: userId, uuid, email: userEmail });

         if (success) {
            setMessage(message, "success");
            refetch();
            setModals(false);
            return;
         }

         return setMessage(message, 'danger');

      }
   }



   async function deleteSellerAccount(userId, uuid, userEmail) {
      try {

         if (!userId || !uuid || !userEmail) {
            return;
         }

         const { success, message } = await apiHandler(`/dashboard/delete-seller-account-request`, "POST", { id: userId, uuid, email: userEmail });

         if (success) {
            setMessage(message, "success");
            refetch();
            setModals(false);
            return;
         }

         setMessage(message, "danger");
      } catch (error) {
         setMessage(error?.message, "danger");
      }
   }


   return (
      <div className='section_default'>
         <div className="container">

            <div className="row">
               {data?.newSellers && data.newSellers.length > 0 ? <table className='table table-responsive'>
                  <thead>
                     <tr>
                        <th>Seller Name</th>
                        <th>Store Name</th>
                        <th>Seller Phone</th>
                        <th>Status</th>
                        <th>Action</th>
                     </tr>
                  </thead>
                  <tbody>
                     {
                        Array.isArray(data?.newSellers) && data?.newSellers.map((user, index) => {

                           return (
                              <tr key={index}>
                                 <td>{user?.fullName}</td>
                                 <td>{user?.seller?.storeInfos?.storeTitle}</td>
                                 <td>{user?.phone}</td>
                                 <td>{user?.isSeller}</td>
                                 <td>
                                    <button className="btn btn-sm" onClick={() => setModals(true && user)}><FontAwesomeIcon icon={faEye} /></button>
                                 </td>
                              </tr>
                           )
                        })
                     }

                  </tbody>
               </table> : <p>No seller request found</p>
               }

               <Modal show={modals}>
                  <Modal.Header>
                     <Modal.Title>Seller Information : </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     <div className="card_default">
                        <div className="card_description">
                           <small><strong>Seller Name</strong> : {modals?.fullName}</small><br />
                           <small><strong>Seller Email</strong> : {modals?.email}</small><br />
                           <small><strong>Tax ID</strong> : {modals?.seller?.taxId}</small><br />
                           <address>
                              <h6>Address</h6>
                              <small>
                                 {modals?.seller?.address?.country} ,&nbsp;{modals?.seller?.address?.division},&nbsp;
                                 {modals?.seller?.address?.city},&nbsp;{modals?.seller?.address?.area}
                              </small>
                           </address> <br />
                           <small><strong>Seller Phone</strong> : {modals?.phone}</small><br />
                           <small><strong>Seller Request</strong> : {modals?.isSeller}</small><br />
                           <small><strong>Store Name</strong> : {modals?.seller?.storeInfos?.storeTitle}</small><br />
                           <small><strong>Store License</strong> : {modals?.seller?.storeInfos?.storeLicense}</small><br />
                           <div className="py-3">
                              <button className="btn btn-sm btn-primary me-3" onClick={() => makeSellerHandler(modals?._id, modals?._uuid, modals?.email)}>Make Seller</button>
                              <button className="btn btn-sm btn-danger" onClick={() => deleteSellerAccount(modals?._id, modals?._uuid, modals?.email)}>Delete Request</button>
                           </div>
                        </div>
                     </div>
                  </Modal.Body>
                  <Modal.Footer>
                     <Button variant="danger" className="btn-sm" onClick={() => setModals(false)}>
                        Cancel
                     </Button>
                  </Modal.Footer>
               </Modal>
            </div>
         </div>
      </div>
   );
};

export default CheckSeller;