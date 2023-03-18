import Breadcrumbs from "@/Components/Shared/Breadcrumbs";
import ProductAdditionalDetails from "@/Components/ViewProductComponents/ProductAdditionalDetails";
import ProductContents from "@/Components/ViewProductComponents/ProductContents";
import ProductImages from "@/Components/ViewProductComponents/ProductImages";
import ProductReviews from "@/Components/ViewProductComponents/ProductReviews";
import RelatedProducts from "@/Components/ViewProductComponents/RelatedProducts";
import { useAuthContext } from "@/lib/AuthProvider";
import Head from "next/head";
import { useRouter } from "next/router"


export default function ViewProduct({ data }) {
   const router = useRouter();
   const product = data?.product && data?.product;
   const { vId } = router.query;

   const { authRefetch, userInfo, setMessage } = useAuthContext();

   return (
      <div className='view_product section_default'>
         <Head>
            <title>{product?.title}</title>
            <meta name="description" content={product?.bodyInfo?.metaDescription} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
         </Head>
         <div className="container">
            {/* breadcrumbs  */}
            <Breadcrumbs
               path={(Array.isArray(product?.categories)) && product?.categories}
            />

            {/* first content  */}
            <div className=" mb-5 row">
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

            <div className="row">
               <div className="col-lg-12">
                  <ProductAdditionalDetails
                     product={product}
                  />
               </div>
               <div className="col-lg-12">
                  <ProductReviews
                     product={product}
                  />
               </div>
               <div className="col-lg-12">
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
   const { pId, vId } = query;
   const { slug } = params;

   const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/product/fetch-single-product/${slug}?pId=${pId}&vId=${vId}`, {
      method: "GET",
      withCredentials: true,
      credentials: "include",
      headers: {
         Cookie: req.headers.cookie
     }
   });
   const data = await response.json();

   return {
      props: data
   }
}