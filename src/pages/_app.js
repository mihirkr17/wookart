// import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/style.css';
import Layout from '@/Components/Global/Layout';
// import Font Awesome CSS
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import AuthProvider from '@/lib/AuthProvider';
import BaseProvider from '@/lib/BaseProvider';
import CartProvider from '@/lib/CartProvider';
import { Router } from 'next/router';
import { useEffect } from 'react';
config.autoAddCss = false;
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export default function App({ Component, pageProps }) {

  useEffect(() => {
    const handleRouteChangeStart = () => NProgress.start();
    Router.events.on('routeChangeStart', handleRouteChangeStart);

    // Stop NProgress on route change complete/error
    const handleRouteChangeComplete = () => NProgress.done();
    const handleRouteChangeError = () => NProgress.done();
    Router.events.on('routeChangeComplete', handleRouteChangeComplete);
    Router.events.on('routeChangeError', handleRouteChangeError);

    // Clean up event listeners when the component is unmounted
    return () => {
      Router.events.off('routeChangeStart', handleRouteChangeStart);
      Router.events.off('routeChangeComplete', handleRouteChangeComplete);
      Router.events.off('routeChangeError', handleRouteChangeError);
    };
  }, [])


  return <BaseProvider>
    <AuthProvider>
      <CartProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CartProvider>
    </AuthProvider>
  </BaseProvider>
}
