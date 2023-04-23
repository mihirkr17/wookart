
export default function CartCalculation({ product, headTitle }) {
   return (
      <div className="py-1">
         <h6>{headTitle ? headTitle : "Price Details"}</h6>
         <hr />
         <div className="py-3 cart_card_body">
            <p><span>Sub Total({product?.totalQuantities || 0})</span> <span className="currency_sign">{product?.baseAmounts || 0}</span></p>
            <p><span>Shipping Fee</span><span className="currency_sign">{product?.shippingFees || 0}</span></p>
            <hr />
            <p><span>Final Amount</span><span className="currency_sign">{product?.finalAmounts || 0}</span></p>
            <p className='py-2 px-1 border rounded mt-3'>
               <small>
                  <i>Your total Saving amount on this order&nbsp;</i>
               </small>
               <small className="text-info currency_sign">{product?.savingAmounts || 0}</small>
            </p>
         </div>
      </div>
   );
};