import { useEffect, useRef, useState } from "react";



export default function useMenu() {
   const menuRef = useRef();
   const [openMenu, setOpenMenu] = useState(false);

   useEffect(() => {
      function handleOutsideClick(e) {
         if (menuRef.current && !menuRef.current.contains(e.target)) {
            setOpenMenu(false);
         }
      }

      document.addEventListener("click", handleOutsideClick);

      return () => document.removeEventListener("click", handleOutsideClick);
   }, [menuRef]);

   return { menuRef, openMenu, setOpenMenu };
}