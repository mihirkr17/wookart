import { useState, useEffect } from 'react';

function getWindowDimension() {
   if (typeof window === "undefined") {
      return {};
   }

   return window;
}


const useWindowDimensions = () => {

   const [windowDimension, setWindowDimension] = useState(getWindowDimension() ?? {});
   const { innerHeight, innerWidth } = windowDimension;

   const [windowWidth, setWindowWidth] = useState(0);
   const [windowHeight, setWindowHeight] = useState(0);

   useEffect(() => {
      function handleWindow() {
         setWindowDimension(getWindowDimension());
      }

      window.addEventListener('resize', handleWindow);

      return () => window.removeEventListener('resize', handleWindow);
   }, []);

   useEffect(() => {
      setWindowHeight(innerHeight);
      setWindowWidth(innerWidth);
   }, [innerHeight, innerWidth]);

   return { windowWidth, windowHeight };
};

export default useWindowDimensions;