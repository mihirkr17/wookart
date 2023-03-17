import React from 'react';

const BtnSpinner = ({ text }) => {
   return (
      <div>
         <span className="spinner-border spinner-border-sm" style={{ marginRight : "5px" }} role="status" aria-hidden="true"></span>
         {text || "Loading"}
      </div>
   );
};

export default BtnSpinner;