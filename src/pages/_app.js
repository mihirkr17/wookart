import '@/styles/globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/style.css';
import Layout from '@/Components/Global/Layout';
// import Font Awesome CSS
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import AuthProvider from '@/lib/AuthProvider';
import BaseProvider from '@/lib/BaseProvider';
config.autoAddCss = false;

export default function App({ Component, pageProps }) {
  return <BaseProvider>
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  </BaseProvider>
}
