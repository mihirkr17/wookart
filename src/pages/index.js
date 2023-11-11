import Product from '@/Components/Shared/Product';
import { categories } from '@/CustomData/categories';
import { withOutDashboard } from '@/Functions/withOutDashboard';
import { textToTitleCase } from '@/Functions/common';
import { faArrowDown, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import useMenu from '@/Hooks/useMenu';



export function Home({ data }) {
  const router = useRouter();
  let [limit, setLimit] = useState(12);
  const [subCtg, setSubCtg] = useState("");
  const { menuRef, openMenu, setOpenMenu } = useMenu();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const showMoreHandler = () => {
    limit += 6;
    setLimit(limit);
    router.push("./?limit=" + limit);
  }
  console.log(data);

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

              <ul className='ctg' ref={menuRef}>
                {
                  categories && categories.map(c => {

                    return (
                      <li key={c?.id} style={openMenu === c?.value ? { backgroundColor: "#d1d1d1" } : { backgroundColor: "unset" }}>
                        <Link href={`/category/${c?.value}`}>{c?.title}</Link>
                        <small className='listToggler' onClick={() => setOpenMenu(e => (e === c?.value ? "" : c?.value))}>
                          <FontAwesomeIcon icon={openMenu !== c?.value ? faPlus : faMinus} />
                        </small>
                        {(openMenu === c?.value) && <ul className='sub_ctg' >
                          {
                            Array.isArray(c?.children) && c?.children.map((s, i) => {
                              return (
                                <li key={i} className='sub_ctg_list' style={{ zIndex: 9999 }}>
                                  <Link href={`/category/${c?.value}/${s?.value}`}>{s?.title}</Link>
                                  <small className='listToggler' onClick={() => setSubCtg(e => (e === s?.value ? "" : s?.value))}>
                                    <FontAwesomeIcon icon={subCtg !== s?.value ? faPlus : faMinus} />
                                  </small>
                                  {
                                    subCtg === s?.value && <ul className='post_ctg_ul'>
                                      {
                                        Array.isArray(s?.children) && s?.children.map((p, i) => {
                                          return (
                                            <li key={i} style={{ background: "aquamarine", padding: "2px 10px", margin: "4px 0" }}>
                                              <Link href={`/category/${c?.value}/${s?.value}/${p?.value}`}>{p?.title}</Link>
                                            </li>
                                          )
                                        })
                                      }
                                    </ul>
                                  }

                                </li>
                              )
                            })
                          }
                        </ul>}
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