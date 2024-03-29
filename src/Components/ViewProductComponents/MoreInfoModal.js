import { textToTitleCase } from "@/Functions/common";
import ModalWrapper from "../Global/ModalWrapper";

export default function MoreInfoModal({ data, closeModal }) {

   const { policies, manufacturer, storeTitle, weight, weightUnit, supplierPhone } = data;

   function destructObject(obj = {}) {

      let items = [];

      for (const item in obj) {
         let temp = obj[item];

         items.push(
            <li key={item}><span className="qqr">{textToTitleCase(item)}</span>
               <span className="qqs">{temp}</span> <hr /> </li>
         );
      }

      return items;
   }

   return (
      <ModalWrapper closeModal={closeModal}>
         <div className="more_info_policies">
            <ul>
               {destructObject({
                  manufacturer_information: `${manufacturer?.details}, Origin of ${manufacturer?.origin}`,
                  packer_information: textToTitleCase(storeTitle),
                  net_weight: `${weight} (${weightUnit})`,
                  supplier_information: `${textToTitleCase(storeTitle)} c/o WooKart`,
                  contact_information: `Contact seller ${supplierPhone}, c/o ${policies?.contact_info}`,
                  legal_disclaimer: policies?.legal_disclaimer,
               })}
            </ul>
         </div>
      </ModalWrapper>
   );
};