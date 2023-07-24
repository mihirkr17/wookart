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
         {/* <nav className="topBar">
            <div className="container">
               <ul className="list-inline pull-left hidden-sm hidden-xs">
                  <li><span className="text-primary">Have a question? </span> Call +120 558 7885</li>
               </ul>
               <ul className="topBarNav pull-right">
                  <li className="dropdown">
                     <Link href="#" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="false"> <i className="fa fa-usd mr-5"></i>USD<i className="fa fa-angle-down ml-5"></i>
                     </Link>
                     <ul className="dropdown-menu w-100" role="menu">
                        <li><Link href="#"><i className="fa fa-eur mr-5"></i>EUR</Link>
                        </li>
                        <li className=""><Link href="#"><i className="fa fa-usd mr-5"></i>USD</Link>
                        </li>
                        <li><Link href="#"><i className="fa fa-gbp mr-5"></i>GBP</Link>
                        </li>
                     </ul>
                  </li>

                  <li className="dropdown">
                     <Link href="#" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="false"> <i className="fa fa-user mr-5"></i><span className="hidden-xs">My Account<i className="fa fa-angle-down ml-5"></i></span> </Link>
                     <ul className="dropdown-menu w-150" role="menu">
                        <li><Link href="login.html">Login</Link>
                        </li>
                        <li><Link href="register.html">Create Account</Link>
                        </li>
                        <li className="divider"></li>
                        <li><Link href="wishlist.html">Wishlist (5)</Link>
                        </li>
                        <li><Link href="cart.html">My Cart</Link>
                        </li>
                        <li><Link href="checkout.html">Checkout</Link>
                        </li>
                     </ul>
                  </li>
                  <li className="dropdown">
                     <Link href="#" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="false"> <i className="fa fa-shopping-basket mr-5"></i> <span className="hidden-xs">
                        Cart<sup className="text-primary">(3)</sup>
                        <i className="fa fa-angle-down ml-5"></i>
                     </span> </Link>
                     <ul className="dropdown-menu cart w-250" role="menu">
                        <li>
                           <div className="cart-items">
                              <ol className="items">
                                 <li>
                                    <Link href="#" className="product-image">
                                       <img src="https://lh3.googleusercontent.com/-uwagl9sPHag/WM7WQa00ynI/AAAAAAAADtA/hio87ZnTpakcchDXNrKc_wlkHEcpH6vMwCJoC/w140-h148-p-rw/profile-pic.jpg" className="img-responsive" alt="Sample Product " /> </Link>
                                    <div className="product-details">
                                       <div className="close-icon"> <Link href="#"><i className="fa fa-close"></i></Link> </div>
                                       <p className="product-name"> <Link href="#">Sumi9xm@gmail.com</Link> </p> <strong>1</strong> x <span className="price text-primary">$59.99</span> </div>

                                 </li>

                                 <li>
                                    <Link href="#" className="product-image"> <img src="https://lh3.googleusercontent.com/-Gy3KAlilHAw/WNf7a2eL5YI/AAAAAAAAD2Y/V3jUt14HiZA3HLpeOKkSaOu57efGuMw9ACL0B/w245-d-h318-n-rw/shoes_01.jpg" className="img-responsive" alt="Sample Product " /> </Link>
                                    <div className="product-details">
                                       <div className="close-icon"> <Link href="#"><i className="fa fa-close"></i></Link> </div>
                                       <p className="product-name"> <Link href="#">Lorem Ipsum dolor sit</Link> </p> <strong>1</strong> x <span className="price text-primary">$39.99</span> </div>

                                 </li>

                                 <li>
                                    <Link href="#" className="product-image">
                                       <img src="https://lh3.googleusercontent.com/-ydDc-0L0WFY/WNf7a6Awe_I/AAAAAAAAD2Y/I8IzJtYRWegkOUxCZ5SCK6vbdiiSxVsCQCL0B/w245-d-h318-n-rw/bags_07.jpg" className="img-responsive" alt="Sample Product " /> </Link>
                                    <div className="product-details">
                                       <div className="close-icon"> <Link href="#"><i className="fa fa-close"></i></Link> </div>
                                       <p className="product-name"> <Link href="#">Lorem Ipsum dolor sit</Link> </p> <strong>1</strong> x <span className="price text-primary">$29.99</span> </div>

                                 </li>

                              </ol>
                           </div>
                        </li>
                        <li>
                           <div className="cart-footer"> <Link href="#" className="pull-left"><i className="fa fa-cart-plus mr-5"></i>View
                              Cart</Link> <Link href="#" className="pull-right"><i className="fa fa-shopping-basket mr-5"></i>Checkout</Link> </div>
                        </li>
                     </ul>
                  </li>
               </ul>
            </div>
         </nav> */}

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
                                                <Link href={`/product/${product?.slug}?pId=${product._id}&sku=${product?.sku}`} style={{ fontSize: "0.7rem" }}>{product?.title}</Link>
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
                     // query: {
                     //    from: asPath
                     // }
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