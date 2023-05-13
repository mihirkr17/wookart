


import CartCheckoutComponent from "@/Components/CheckoutComponents/CartCheckOutComponent";
import StripePromises from "@/Components/StripeComponents/StripePromises";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import RequiredAuth from "@/Middlewares/RequiredAuth";

export default withOutDashboard(function Checkout() {
   return (
      <RequiredAuth>
         <StripePromises>
            <CartCheckoutComponent></CartCheckoutComponent>
         </StripePromises>
      </RequiredAuth>
   )
}, [])