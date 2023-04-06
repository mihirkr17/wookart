import { useState, useEffect } from "react";

export const usePrice = (price, sellPrice) => {
   const [discount, setDiscount] = useState(0);


   useEffect(() => {

      let oldPrice = parseFloat(price);
      let discount = 100 - ((parseFloat(sellPrice) * 100) / oldPrice);
      setDiscount(parseInt(discount));

   }, [price, sellPrice]);

   return { discount };
}