// pages/category/__dynamicCategory

import Breadcrumbs from "@/Components/Shared/Breadcrumbs";
import Product from "@/Components/Shared/Product";
import { categories, filterOptions } from "@/CustomData/categories";
import { textToTitleCase } from "@/Functions/common";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export function __dynamicCategory({ products, filterData }) {
   const router = useRouter();
   const { ctg } = router.query;
   const [fBrand, setFBrand] = useState([]);
   const [sorted, setSorted] = useState("");
   const [priceRanger, setPriceRanger] = useState(0);
   const basePath = ctg?.join("/");


   useEffect(() => {
      setFBrand(router?.query?.brand?.replace(/\s/g, "-").split("~") ?? []);
      setSorted((router?.query?.sorted && router?.query?.sorted) || "");
      setPriceRanger((router?.query?.price_range && router?.query?.price_range) || "")
   }, [router?.query?.brand, router?.query?.sorted, router?.query?.price_range]);

   // useEffect(() => {
   //    let newData = priceRanger && products?.filter(e => e?.pricing?.sellingPrice <= priceRanger);
   //    setData(newData || products);
   // }, [priceRanger, products]);


   let sort = sorted ? `&sorted=${sorted}` : "";
   let priceR = priceRanger ? `&price_range=${priceRanger}` : "";

   // for handling products by brand value
   function handleBrandFilter(params) {
      const { value, checked } = params.target;
      let newVal = value.replace(/\s/g, "-");

      let b = checked
         ? [...fBrand, newVal].filter((e, i, fa) => fa.indexOf(e) === i)
         : fBrand.filter(e => e !== newVal);

      setFBrand(b);
      router.push(`${basePath}?brand=${(b ? b.join("~") : "") + sort + priceR}`);
   }

   // sorting products by price lower or higher
   function handleSortedPrice(e) {
      const { value } = e.target;
      setSorted(value);
      router.push(`${basePath}?brand=${fBrand && fBrand.join("~")}&sorted=${value + priceR}`)
   }

   function handlePriceRanger(e) {
      const { value } = e.target;
      setPriceRanger(value);
      router.push(`${basePath}?brand=${fBrand && fBrand.join("~") + sort}&price_range=${value}`)
   }


   // others options
   // function getAttributes(variants = []) {
   //     return variants.reduce((acc, curr) => {

   //       Object.entries(curr).forEach(([key, value]) => {

   //          if (acc.hasOwnProperty(key)) {

   //             if (Array.isArray(acc[key])) {
   //                acc[key].push(value);
   //             } else {
   //                acc[key] = [acc[key], value];
   //             }
   //          } else {
   //             acc[key] = value;
   //          }
   //       });
   //       return acc;
   //    });
   // }

   // let v = filterData?.map(item => item?.variant);


   let lastCtg = ctg?.slice(-1)[0];

   let fc = ctg?.[0];
   let options = ctg.join("/");

   const FilterOption = filterOptions.find((f) => f?.name === options);


   let category = categories?.find(c => c?.name === fc) ?? {};

   let brand = filterData?.map(d => d?.brand).filter(e => e) ?? [];
   const sizes = products?.map(d => d?.variant?.sizes).filter(e => e) ?? [];
   const ram = products?.map(d => d?.variant?.ram).filter(e => e) ?? [];
   const rom = products?.map(d => d?.variant?.rom).filter(e => e) ?? [];
   const colors = products?.map(d => d?.variant?.color).filter(e => e) ?? [];




   function generateFilterOption(attribute) {
      let arr = [];

      for (const key in attribute) {

         const value = attribute[key]

         if (Array.isArray(value)) {
            arr.push(<div key={key}>
               <strong>{key}</strong> <br />
               <div className="row">
                  <div className="col-lg-12">
                     {/* <select name="" id=""> */}
                     {
                        value.map((v, i) => {
                           return (
                              <div key={i}>
                                 <label htmlFor={key}>{v}</label>
                                 <input type="checkbox" id={key}/>
                              </div>
                           )

                        })
                     }
                     {/* </select> */}
                  </div>
               </div>
            </div>);
         }


      }
      return arr;
   }

   return (
      <section className="section_default">
         <div className="container">
            <div className="py-3">
               <Breadcrumbs path={ctg}></Breadcrumbs>
            </div>
            <div className="row">
               <div className="col-lg-3">

                  <div className="p-1">
                     <b>Categories</b> <br />
                     <ul>
                        {
                           category?.children && category?.children.map(sb => {
                              return (
                                 <li key={sb?.name}>
                                    <Link style={{ fontWeight: lastCtg === sb?.name ? "bold" : "normal" }} href={`/category/${category?.name}/${sb?.name}`}>{textToTitleCase(sb?.name)}</Link> <small>
                                       <FontAwesomeIcon icon={faArrowDown} />
                                    </small>

                                    <ul className='post_ctg'>
                                       {
                                          Array.isArray(sb?.children) && sb?.children.map((p) => {
                                             return (
                                                <li key={p?.name}>
                                                   <Link style={{ fontWeight: lastCtg === p?.name ? "bold" : "normal" }} href={`/category/${category?.name}/${sb?.name}/${p?.name}`}>{textToTitleCase(p?.name)}</Link>
                                                </li>
                                             )
                                          })
                                       }
                                    </ul>
                                 </li>
                              )
                           })
                        }
                     </ul>
                  </div>

                  <div className="p-1">
                     <b>Brand</b> <br />

                     {
                        brand?.map((b, i) => {
                           return (
                              <React.Fragment key={i}>
                                 <label htmlFor={b}>
                                    <input type="checkbox" name={b} id={b} value={b} onChange={(e) => handleBrandFilter(e)}
                                       checked={fBrand && fBrand.includes(b.replace(/\s/g, "-"))}
                                    />
                                    &nbsp;&nbsp;{b}
                                 </label> <br />
                              </React.Fragment>
                           )
                        })
                     }
                  </div>

                  {
                     Array.isArray(sizes) && sizes.length >= 1 ?
                        <div className="p-1">
                           <b>Size</b> <br />
                           {
                              sizes.map((s) => {
                                 return (
                                    <React.Fragment key={s}>
                                       <label htmlFor="size">
                                          <input type="checkbox" name="size" id="size" value={s}
                                             onChange={(e) => setSize(e.target.value)}

                                          />
                                          &nbsp;&nbsp;{s}
                                       </label> <br />
                                    </React.Fragment>
                                 )
                              })
                           }
                        </div> : ""
                  }

                  {
                     generateFilterOption(FilterOption?.attributes)
                  }


                  <div className="p-1">
                     <b>Price Range</b> <br />

                     <input type="range" name="priceRange" id="priceRange" min={0} max={10000} title={priceRanger} value={priceRanger} onChange={(e) => handlePriceRanger(e)} />
                  </div>


               </div>

               <div className="col-lg-9">
                  <div className="p-2">

                     <div className="py-1">
                        <h6>
                           {
                              textToTitleCase(lastCtg)
                           }
                        </h6>
                        <small className="textMute">
                           {
                              products?.length + " items found in " + textToTitleCase(lastCtg)
                           }
                        </small>

                        <div className="filter_by py-2">

                           <select name="sorted" id="sorted" onChange={(e) => handleSortedPrice(e)}>
                              <option selected={sorted === "relevant" ? true : false} value="relevant">Relevant</option>
                              <option selected={sorted === "lowest" ? true : false} value="lowest">Lowest Price</option>
                              <option selected={sorted === "highest" ? true : false} value="highest">Highest Price</option>
                           </select>

                           <br />
                           {
                              fBrand && fBrand.map((e, i) => {
                                 return e ? (
                                    <div className="badge_success m-1" key={i}>
                                       Brand: {e}
                                       &nbsp;
                                       &nbsp;
                                       &nbsp;
                                       <b onClick={
                                          () =>
                                             setFBrand(f => {
                                                let y = f?.filter(g => g !== e) || [];
                                                router.push(`${basePath}?brand=${(y ? y.join("~") : "") + sort + priceR}`);
                                                return y;
                                             })
                                       } style={{ cursor: "pointer" }}>X</b>
                                    </div>
                                 ) : ""
                              })
                           }
                        </div>
                     </div>

                     <div className="row">
                        {
                           Array.isArray(products) && products.map((product) => {
                              return (
                                 <Product key={product?.sku} product={product}></Product>
                              )
                           })
                        }
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section >
   )
}


export async function getServerSideProps({ params, query }) {
   const { ctg } = params;
   const { brand, sorted, price_range } = query;

   const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/product/product-by-category?categories=${ctg}`, {
      method: "POST",
      headers: {
         "Content-Type": "application/json"
      },
      body: JSON.stringify({ brand, sorted, price_range })
   });

   const { products, filterData } = await response.json();


   return {
      props: { products: products || [], filterData: filterData || null }
   }
}



export default withOutDashboard(__dynamicCategory, []);