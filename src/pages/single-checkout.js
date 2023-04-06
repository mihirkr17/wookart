// pages/single-checkout.js


import SingleCheckoutComponent from "@/Components/CheckoutComponents/SingleCheckoutComponent";
import StripePromises from "@/Components/StripeComponents/StripePromises";
import { withOutDashboard } from "@/Functions/withOutDashboard";


export default withOutDashboard(function SingleCheckout() {
   return (
      <StripePromises>
         <SingleCheckoutComponent></SingleCheckoutComponent>
      </StripePromises>
   )
}, []);
