// pages/single-checkout.js


import SingleCheckoutComponent from "@/Components/CheckoutComponents/SingleCheckoutComponent";
import StripePromises from "@/Components/StripeComponents/StripePromises";
import { ProtectedHOC } from "./_ProtectedHOC";


export default ProtectedHOC(function SingleCheckout() {
   return (
      <StripePromises>
         <SingleCheckoutComponent></SingleCheckoutComponent>
      </StripePromises>

   )
});
