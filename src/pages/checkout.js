


import CartCheckoutComponent from "@/Components/CheckoutComponents/CartCheckOutComponent";
import StripePromises from "@/Components/StripeComponents/StripePromises";
import { withOutDashboard } from "@/Functions/withOutDashboard";

export default withOutDashboard(function Checkout() {
   return (
      <StripePromises>
         <CartCheckoutComponent></CartCheckoutComponent>
      </StripePromises>
   )
}, [])