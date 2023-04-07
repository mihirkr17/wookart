import ModalWrapper from "@/Components/Global/ModalWrapper";



export default function BuyerInfoModal({ closeModal, data }) {

   return (
      <ModalWrapper closeModal={closeModal}>
         <p>Total Orders : {data?.totalOrder}</p>
      </ModalWrapper>
   )
}