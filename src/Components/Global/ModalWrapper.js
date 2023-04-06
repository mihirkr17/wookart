import React from 'react';

const ModalWrapper = ({ children, closeModal }) => {


   return (
      <div className='modal_c' style={(children) ? { display: "block" } : { display: "none" }}>
         <div className="modal_body card_description">
            <button className="modal_close" onClick={closeModal}>x</button>
            <div className="modal_wrapper">
               <div className="modal_text">
                  {children}
               </div>
            </div>
         </div>
      </div>
   );
};

export default ModalWrapper;