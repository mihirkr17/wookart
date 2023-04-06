import { useState, useEffect } from 'react';

function getWindowDimension() {
   const { innerHeight: height, innerWidth: width } = window;

   return { height, width };
}

const useWindowDimensions = () => {
   const [windowDimension, setWindowDimension] = useState(getWindowDimension() || {});

   useEffect(() => {
      function handleWindow() {
         setWindowDimension(getWindowDimension())
      }

      window.addEventListener('resize', handleWindow);

      return () => window.removeEventListener('resize', handleWindow);
   }, []);

   return windowDimension;
};

export default useWindowDimensions;