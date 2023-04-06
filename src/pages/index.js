import Product from '@/Components/Shared/Product';
import { newCategory } from '@/CustomData/categories';
import { withOutDashboard } from '@/Functions/withOutDashboard';
import { textToTitleCase } from '@/Functions/common';
import { faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';



export function Home({ data }) {
  const router = useRouter();
  let [limit, setLimit] = useState(12);
  const [ctg, setCtg] = useState("");

  const showMoreHandler = () => {
    limit += 6;
    setLimit(limit);
    router.push("./?limit=" + limit);
  }

  return (
    <>
      <Head>
        <title>Welcome to WooKart || World best shopping site.</title>
        <meta name="description" content="WooKart shopping site" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className='section_default'>
        <div className="container">

          <div className="home_banner py-3" style={{
            backgroundColor: "whitesmoke",
            minHeight: "60vh"
          }}>
            <div className='p-3 category_main'>
              <b>Categories</b>
              <ul className='ctg'>
                {
                  newCategory && newCategory.map(c => {

                    return (
                      <li key={c?.id} style={{ backgroundColor: ctg === c?.category ? "#d1d1d1" : "" }} onMouseOver={() => setCtg(c?.category)} onMouseOut={() => setCtg("")}>
                        <Link href={`/category/${c?.category}`}>{textToTitleCase(c?.category)}</Link>
                        <ul className='sub_ctg' style={ctg === c?.category ? { display: "block" } : { display: "none" }}>
                          {
                            Array.isArray(c?.sub_category_items) && c?.sub_category_items.map((s, i) => {
                              return (
                                <li key={i}>
                                  <Link href={`/category/${c?.category}/${s?.name}`}>{textToTitleCase(s?.name)}</Link> <small>
                                    <FontAwesomeIcon icon={faArrowDown} />
                                  </small>
                                  <ul className='post_ctg'>
                                    {
                                      Array.isArray(s?.post_category_items) && s?.post_category_items.map((p, i) => {
                                        return (
                                          <li key={i}>
                                            <Link href={`/category/${c?.category}/${s?.name}/${p?.name}`}>{textToTitleCase(p?.name)}</Link>
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
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>

          <br />

          <div className="d-flex justify-content-between py-2">
            <h5 className="py-2">Just For You</h5>
          </div>
          <div className='row product_wrapper'>

            {
              data?.data?.store && data?.data?.store.map((product, index) => {
                return (

                  <Product key={index} product={product} ></Product>

                )
              })
            }

          </div>
          <div className="py-3 text-center">
            <button
              className={data?.data?.store && data?.data?.store.length < limit ? 'btn btn-sm btn-secondary' : 'btn btn-sm btn-primary'}
              disabled={data?.data?.store && data?.data?.store.length < limit ? true : false}
              onClick={showMoreHandler}>
              {
                (data?.data?.store && data?.data?.store.length < limit) ? "No available products here" : "See More"
              }
            </button>
          </div>
        </div>
      </section>
    </>
  )
}


export async function getServerSideProps(context) {
  const { limit } = context.query;

  let newLimit = limit || 12;

  const response = await fetch(`${process.env.NEXT_PUBLIC_S_BASE_URL}api/v1/product/store/${newLimit}`);
  const data = await response.json();

  return { props: { data } };
}


export default withOutDashboard(Home, [""]);