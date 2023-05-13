// pages/single-checkout.js


import SingleCheckoutComponent from "@/Components/CheckoutComponents/SingleCheckoutComponent";
import StripePromises from "@/Components/StripeComponents/StripePromises";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import RequiredAuth from "@/Middlewares/RequiredAuth";


export default withOutDashboard(function SingleCheckout() {
   return (
      <RequiredAuth>
         <StripePromises>
            <SingleCheckoutComponent></SingleCheckoutComponent>
         </StripePromises>
      </RequiredAuth>
   )
}, []);
