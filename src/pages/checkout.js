


import CartCheckoutComponent from "@/Components/CheckoutComponents/CartCheckOutComponent";
import StripePromises from "@/Components/StripeComponents/StripePromises";
export default function Checkout () {
   return(
      <StripePromises>
         <CartCheckoutComponent></CartCheckoutComponent>
      </StripePromises>
   )
}