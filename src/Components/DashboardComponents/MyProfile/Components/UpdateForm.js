import React, { useState, useEffect } from 'react';
import BtnSpinner from '../../../../Components/Shared/BtnSpinner/BtnSpinner';
import { country, bangladeshInfo, indiaData } from "../../../../CustomData/data";

const UpdateForm = ({ updateDocHandler, actionLoading, userInfo, inputValue, setInputValue }) => {
   const [division, setDivision] = useState([]);
   const [district, setDistrict] = useState([]);
   const [thana, setThana] = useState([]);

   const handleInput = (e) => {
      let values = e.target.value;
      setInputValue({ ...inputValue, [e.target.name]: values })
   }

   useEffect(() => {
      const setAddress = (countryName, countryData) => {

         if (inputValue.country === countryName) {

            setDivision(Object.keys(countryData));

            let div = countryData[inputValue.division];

            if (div && inputValue.division) {
               setDistrict(Object.keys(div));

               let div2 = countryData[inputValue.division][inputValue.district];
               if (div2 && inputValue.district) {
       
                  setThana(div2)
               } else {
                  setThana([]);
               }
            } else {
               setDistrict([]);
            }
         } else {
            setDivision([]);
            setDistrict([]);
            setThana([]);
         }
      }

      if (inputValue.country === "Bangladesh") {
         setAddress("Bangladesh", bangladeshInfo);
      } else if (inputValue.country === "India") {
         setAddress("India", indiaData);
      } else {
         setAddress("", {});
      }
   }, [inputValue]);

   const selectOption = (arr, values) => {
      return (
         <select name={values} id={values} onChange={handleInput}>
            <option value="">Choose {values}</option>
            {
               arr && arr.map((c, i) => {
                  return (
                     <option value={c} key={i}>{c}</option>
                  )
               })
            }
         </select>
      )
   }


   return (
      <form onSubmit={updateDocHandler}>
         <table className='table table-sm table-borderless'>
            <thead>
            </thead>
            <tbody>
               <tr>
                  <th>Country</th>
                  <td className='d-flex align-items-center justify-content-between flex-wrap'>
                     {userInfo?.country || "Not Set"}
                     {selectOption(country, "country")}
                  </td>
               </tr>
               <tr>
                  <th>Division</th>
                  <td className='d-flex align-items-center justify-content-between flex-wrap'>
                     {userInfo?.division || "Not Set"}
                     {selectOption(division, "division")}
                  </td>
               </tr>
               <tr>
                  <th>District</th>
                  <td className='d-flex align-items-center justify-content-between flex-wrap'>
                     {userInfo?.district || "Not Set"}
                     {selectOption(district, "district")}
                  </td>
               </tr>
               <tr>
                  <th>Thana</th>
                  <td className='d-flex align-items-center justify-content-between flex-wrap'>
                     {userInfo?.thana || "Not Set"}
                     {selectOption(thana, "thana")}
                  </td>
               </tr>
               <tr>
                  <th>DOB</th>
                  <td className='d-flex align-items-center justify-content-between flex-wrap'>
                     {userInfo?.dob || "Not Set"}
                     <input type="date" name='dob' id='dob' onChange={handleInput} />
                  </td>
               </tr>
            </tbody>
         </table>
         <button className='bt9_edit' type='submit'>{actionLoading ? <><BtnSpinner text={"Updating..."}></BtnSpinner></> : "Update"}</button>
      </form>
   );
};

export default UpdateForm;