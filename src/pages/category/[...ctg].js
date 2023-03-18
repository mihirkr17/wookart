// pages/category/__dynamicCategory

import Breadcrumbs from "@/Components/Shared/Breadcrumbs";
import Product from "@/Components/Shared/Product";
import { newCategory } from "@/CustomData/categories";
import { textToTitleCase } from "@/Functions/common";
import { faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function __dynamicCategory({ p }) {
   const [data, setData] = useState([]);
   const [size, setSize] = useState("");
   const [brnd, setBrnd] = useState("");
   const router = useRouter();
   const { ctg } = router.query;

   useEffect(() => {
      let newP = [];

      if (size) {
         newP = p && p.filter(m => m?.variant?.sizes === size);
      } else if (brnd) {
         newP = p && p.filter(m => m?.brand === brnd);
      } else {
         newP = p;
      }

      setData(newP);
   }, [p, size, brnd]);

   let lastCtg = ctg && ctg.slice(-1)[0];

   let fc = ctg && ctg[0];

   let category = newCategory && newCategory.find(c => c?.category === fc);

   let brand = p && p.map(d => d?.brand).filter(e => e);

   let sizes = p && p.map(d => d?.variant?.sizes).filter(e => e) || false;

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
                           category?.sub_category_items && category?.sub_category_items.map(sb => {
                              return (
                                 <li key={sb?.name}>
                                    <Link style={{ fontWeight: lastCtg === sb?.name ? "bold" : "normal" }} href={`/category/${category?.category}/${sb?.name}`}>{textToTitleCase(sb?.name)}</Link> <small>
                                       <FontAwesomeIcon icon={faArrowDown} />
                                    </small>

                                    <ul className='post_ctg'>
                                       {
                                          Array.isArray(sb?.post_category_items) && sb?.post_category_items.map((p) => {
                                             return (
                                                <li key={p?.name}>
                                                   <Link style={{ fontWeight: lastCtg === p?.name ? "bold" : "normal" }} href={`/category/${category?.category}/${sb?.name}/${p?.name}`}>{textToTitleCase(p?.name)}</Link>
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
                        brand && brand.map((b, i) => {
                           return (
                              <>
                                 <label htmlFor="brand" key={i}>
                                    <input type="checkbox" name="brand" id="brand" value={b} onChange={(e) => setBrnd(e.target.value)} />
                                    &nbsp;&nbsp;{b}
                                 </label> <br />
                              </>
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
                                    <>
                                       <label htmlFor="size" key={s}>
                                          <input type="checkbox" name="size" id="size" value={s} onChange={(e) => setSize(e.target.value)} />
                                          &nbsp;&nbsp;{s}
                                       </label> <br />
                                    </>
                                 )
                              })
                           }
                        </div> : ""
                  }


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
                              data && data.length + " items found in " + textToTitleCase(lastCtg)
                           }
                        </small>
                     </div>

                     <div className="row">
                        {
                           Array.isArray(data) && data.map((product) => {
                              return (
                                 <Product key={product?._vrid} product={product}></Product>
                              )
                           })
                        }
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}


export async function getServerSideProps({ params }) {
   const { ctg } = params;

   const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/product/product-by-category?categories=${ctg}`);

   const data = await response.json();


   return {
      props: { p: data }
   }
}