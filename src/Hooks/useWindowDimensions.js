import { useState, useEffect } from 'react';

function getWindowDimension() {
   if (typeof window === "undefined") {
      return {};
   }

   return {
      width: window.innerWidth,
      height: window.innerHeight
   };
}


const useWindowDimensions = () => {

   const [windowDimension, setWindowDimension] = useState(getWindowDimension() ?? {});
   const { width, height } = windowDimension;

   const [windowWidth, setWindowWidth] = useState(0);
   const [windowHeight, setWindowHeight] = useState(0);

   useEffect(() => {
      function handleWindow() {
         setWindowDimension(getWindowDimension());
      }

      window.addEventListener('resize', handleWindow);

      setWindowHeight(height);
      setWindowWidth(width);

      return () => window.removeEventListener('resize', handleWindow);
   }, [ width, height]);

   return { windowWidth, windowHeight };
};

export default useWindowDimensions;