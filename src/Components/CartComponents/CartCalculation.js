
export default function CartCalculation({ product, headTitle }) {
   return (
      <div className="py-1">
         <h6>{headTitle ? headTitle : "Price Details"}</h6>
         <hr />
         <div className="py-3 cart_card_body">
            <p><span>Sub Total({product?.totalQuantities || 0})</span> <span>$&nbsp;{product?.baseAmounts || 0}</span></p>
            <p><span>Shipping Fee</span><span>$&nbsp;{product?.shippingFees || 0}</span></p>
            <hr />
            <p><span>Final Amount</span><span>$&nbsp;{product?.finalAmounts || 0}</span></p>
            <p className='py-2 px-1 border rounded mt-3'>
               <small>
                  <i>Your total Saving amount on this order&nbsp;</i>
               </small>
               <small className="text-info">$&nbsp;{product?.savingAmounts || 0}</small>
            </p>
         </div>
      </div>
   );
};