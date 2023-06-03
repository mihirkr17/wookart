import Breadcrumbs from "@/Components/Shared/Breadcrumbs";
import ProductAdditionalDetails from "@/Components/ViewProductComponents/ProductAdditionalDetails";
import ProductContents from "@/Components/ViewProductComponents/ProductContents";
import ProductImages from "@/Components/ViewProductComponents/ProductImages";
import ProductReviews from "@/Components/ViewProductComponents/ProductReviews";
import RelatedProducts from "@/Components/ViewProductComponents/RelatedProducts";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import { useAuthContext } from "@/lib/AuthProvider";
import Head from "next/head";
import { useRouter } from "next/router"
import { useEffect } from "react";


export function ViewProduct({ data }) {
   const router = useRouter();
   const product = data?.product && data?.product;
   const { vId, pId } = router.query;
   const { authRefetch, userInfo, setMessage } = useAuthContext();


   useEffect(() => {
      if (!pId || !vId) {
         router.push("/");
      };
   }, [router, pId, vId])

   return (
      <div className='view_product section_default'>
         <Head>
            <title>{product?.title}</title>
            <meta name="description" content={product?.bodyInfo?.metaDescription} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
         </Head>

         <div className="container product_detail_container">
            <div className="row">
               {/* breadcrumbs  */}
               <div className="p_content_wrapper col-12">
                  <Breadcrumbs
                     path={(Array.isArray(product?.categories)) && product?.categories}
                  />
               </div>
            </div>

            {/* first content  */}
            <div className=" mb-5 row product_top">

               <div className="pb-3 col-lg-4">
                  <ProductImages
                     product={product}
                     userInfo={userInfo}
                     authRefetch={authRefetch}
                     setMessage={setMessage}
                  />
               </div>


               <div className="pb-3 product_description col-lg-8">
                  <ProductContents
                     product={product}
                     variationID={vId && vId}
                     authRefetch={authRefetch}
                     setMessage={setMessage}
                     userInfo={userInfo}
                  />
               </div>
            </div>

            <div className="row product_bottom_row">
               <div className="col-lg-9">
                  <ProductAdditionalDetails
                     product={product}
                     userInfo={userInfo}
                  />
               </div>

               <div className="col-lg-3">
                  <RelatedProducts
                     relatedProducts={data?.relatedProducts ? data?.relatedProducts : []}
                  />
               </div>
            </div>
         </div>
      </div>
   )
}

export async function getServerSideProps({ query, params, req }) {
   const { pId, vId, oTracker } = query;
   const { slug } = params;
   const { cookie } = req.headers;

   const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/product/fetch-single-product/${slug}?pId=${pId}&vId=${vId}&oTracker=${oTracker}`, {
      method: "GET",
      withCredentials: true,
      credentials: "include",
      headers: {
         Cookie: cookie || "",
         "Content-Type": "application/json"
      }
   });

   const data = await response.json();

   return {
      props: data
   }
}


export default withOutDashboard(ViewProduct, []);