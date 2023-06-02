import React from 'react';
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const GenerateStar = ({ star, starSize }) => {

   function starsFunc(s) {
      let stars = [];
      let maxStar = 5;

      s = Array.from({ length: s }, (any, index) => index + 1);

      for (let i = 1; i <= maxStar; i++) {

         stars.push(
            <span key={i}>
               <FontAwesomeIcon icon={faStar}
                  style={{
                     color: s.includes(i) ? "#f3cd4e" : "gray",
                     fontSize: starSize ?? "1.2rem", marginRight: "6px"
                  }} />
            </span>
         )
      }

      return stars;
   }

   return (
      <div>
         {starsFunc(star ?? 5)}
      </div>
   );
}

export default GenerateStar;
