import { faCartShopping, faClose, faUserAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Navbar } from 'react-bootstrap';
import Link from 'next/link';
import { useAuthContext } from '@/lib/AuthProvider';
import { useRouter } from 'next/router';
import { apiHandler, deleteAuth } from '@/Functions/common';
import useMenu from '@/Hooks/useMenu';
import { useCartContext } from '@/lib/CartProvider';

const NavigationBar = () => {
   const { userInfo, role } = useAuthContext();
   const router = useRouter();
   const { asPath, pathname } = router;

   const { cartQuantity } = useCartContext();
   const { menuRef, openMenu, setOpenMenu } = useMenu();

   const [data, setData] = useState([]);

   const [searchQuery, setSearchQuery] = useState(null);

   useEffect(() => {
      const fetchData = setTimeout(() => {
         (async () => {
            if (searchQuery !== "" && searchQuery) {
               const resData = await apiHandler(`/product/search-products/${searchQuery}`, "GET", {});
               setData(resData);
            }
         })();
      }, 100);

      return () => clearTimeout(fetchData);
   }, [searchQuery]);

   return (
      <>
         <Navbar sticky='top' className='navigation_bar' expand="lg">
            <div className='container nav_container'>
               <div className="nav_brand_logo">
                  <Link className="brand_logo" href="/">WooKart</Link>
                  {
                     (pathname !== '/register' && pathname !== '/login') &&

                     <div className="search_box">

                        <div className='search_form'>
                           <input type="search"
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder='Search for products, brands and more'
                              name="s_query"
                              value={searchQuery || ""}
                           />
                           <button onClick={() => setSearchQuery(null)}>
                              <FontAwesomeIcon icon={faClose} />
                           </button>

                           {(searchQuery) &&
                              <div className={`search_result active`}>
                                 <div className='card_default card_description'>
                                    {
                                       (data && data.length > 0) ? data.map((product, index) => {
                                          return (
                                             <div className="d-flex flex-row align-items-center justify-content-start mb-3" key={index}>
                                                <img src={product?.image && product?.image} style={{ width: "25px", height: "25px", marginRight: "0.8rem", marginBottom: "0.4rem" }} alt="" />
                                                <Link href={`/product/${product?.slug}?pId=${product._id}&vId=${product?._vrid}`} style={{ fontSize: "0.7rem" }}>{product?.title}</Link>
                                             </div>
                                          )
                                       }) : <b>No Product Found...</b>
                                    }
                                 </div>

                              </div>
                           }
                        </div>
                     </div>
                  }
               </div>

               <div className="nav_right_items">
                  <div className="nv_items">
                     <Link className="nav_link cart_link" href='/my-cart'>
                        <FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon>
                        {<div className="bg-info cart_badge">{cartQuantity || 0}</div>}
                     </Link>
                  </div>

                  {
                     ((role === 'BUYER')) &&
                     <div className="account_box nv_items" ref={menuRef}>
                        <span onClick={() => setOpenMenu(e => !e)}>
                           <FontAwesomeIcon icon={faUserAlt}></FontAwesomeIcon>

                        </span>
                        <div className={`account_field ${openMenu ? "active" : ""}`}>
                           <small><b>{userInfo?.fullName}</b></small>
                           <Link className="drp_item" href="/user/my-account">My Account</Link>
                           <Link className='drp_item' href='/user/orders-management'>My Order</Link>
                           <br />
                           <button style={{ color: "red" }} className='drp_item' onClick={() => deleteAuth()}>Logout Now</button>
                        </div>
                     </div>
                  }

                  {!role && (!pathname.startsWith("/login") && !pathname.startsWith("/register")) && <Link className='nv_items nav_link' href={{
                     pathname: `/login`,
                     query: {
                        from: asPath
                     }
                  }}>Login</Link>}

               </div>

            </div>

            {/* {
               (pathname !== '/register' && pathname !== '/login' && !pathname.startsWith('/dashboard')) && <CategoryHeader />
            } */}

         </Navbar>


      </>

   );
};

export default NavigationBar;