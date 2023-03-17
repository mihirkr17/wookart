// pages/single-checkout.js


import SingleCheckoutComponent from "@/Components/CheckoutComponents/SingleCheckoutComponent";
import StripePromises from "@/Components/StripeComponents/StripePromises";


export default function SingleCheckout() {
   return (
      <StripePromises>
         <SingleCheckoutComponent></SingleCheckoutComponent>
      </StripePromises>
   )
}
