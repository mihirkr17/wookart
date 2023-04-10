import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/style.css';
import Layout from '@/Components/Global/Layout';
// import Font Awesome CSS
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import AuthProvider from '@/lib/AuthProvider';
import BaseProvider from '@/lib/BaseProvider';
import CartProvider from '@/lib/CartProvider';
config.autoAddCss = false;

export default function App({ Component, pageProps }) {
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
