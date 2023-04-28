import { useState, useEffect } from 'react';

import { useRouter } from 'next/router';

import OrderPaymentInfoModal from './OrderPaymentInfoModal';
import OrderDetailsModal from './OrderDetailsModal';
import OrderLabelModal from './OrderLabelModal';
import OrderTable from './OrderTable';
import { useOrder } from '@/lib/OrderProvider';
import Spinner from '@/Components/Shared/Spinner/Spinner';
import { useAuthContext } from '@/lib/AuthProvider';



const ManageOrders = () => {
   const router = useRouter();
   const { dbSlug, filters } = router?.query;
   const { userInfo, setMessage } = useAuthContext();
   const { orders, placeOrderCount, dispatchOrderCount, orderRefetch, orderLoading, filterOrders, orderCount } = useOrder();
   const [openModal, setOpenModal] = useState(false);
   const [openOrderPaymentInfo, setOpenOrderPaymentInfo] = useState(false);
   const [labelModal, setLabelModal] = useState(false);
   const [showOrders, setShowOrders] = useState("placed");
   const viewMode = new URLSearchParams(window && window.location.search).get("view");
   const [orderCounter, setOrderCounter] = useState(0);

   // Filtering orders by status

   return (
      <div className='section_default'>
         <div className="container">
            <h5 className="pb-1">
               Total Orders ({orderCount})
            </h5>
            <div className="headers">
               <button onClick={() => filterOrders("placed", dbSlug)} className={`hBtn ${(filters === "placed" || !filters) ? "active" : ""}`}>
                  Placed Orders ({placeOrderCount})
               </button>
               <button onClick={() => filterOrders("dispatch", dbSlug)} className={`hBtn ${filters === "dispatch" ? "active" : ""}`}>
                  On Processing ({dispatchOrderCount})
               </button>
               <button onClick={() => filterOrders("shipped", dbSlug)} className={`hBtn ${filters === "shipped" ? "active" : ""}`}>
                  Shipped
               </button>
            </div>

            <div className="row">

               {
                  <div className="col-lg-12 mb-4 p-3">

                     <div className="py-1">
                        {
                           orderLoading ? <Spinner /> :
                              <OrderTable
                                 setMessage={setMessage}
                                 orderRefetch={orderRefetch}
                                 orders={orders ? orders : []}
                                 setOpenModal={setOpenModal}
                                 setLabelModal={setLabelModal}
                                 setOpenOrderPaymentInfo={setOpenOrderPaymentInfo}
                                 userInfo={userInfo}
                              />
                        }
                     </div>

                  </div>
               }



            </div>
         </div>

         {
            openOrderPaymentInfo && <OrderPaymentInfoModal
               orderRefetch={orderRefetch}
               data={openOrderPaymentInfo}
               closeModal={() => setOpenOrderPaymentInfo(false)}
            />
         }

         {
            openModal && <OrderDetailsModal
               data={openModal}
               closeModal={() => setOpenModal(false)}
            ></OrderDetailsModal>
         }

         {labelModal && <OrderLabelModal
            data={labelModal}
            userInfo={userInfo}
            closeModal={() => setLabelModal(false)}
         ></OrderLabelModal>
         }
      </div >
   );
};

export default ManageOrders;