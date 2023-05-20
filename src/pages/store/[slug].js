import { apiHandler } from "@/Functions/common";
import { withOutDashboard } from "@/Functions/withOutDashboard";
import { useRouter } from "next/router";
function __DynamicStore({ data }) {

   const router = useRouter();

   const { slug } = router.query;



}

export async function getServerSideProps({ query, params }) {

   const { slug } = params;

   const { success, data } = await apiHandler(`/store/${slug}`);

   return success && { props: data }
}

export default withOutDashboard(__DynamicStore, []);