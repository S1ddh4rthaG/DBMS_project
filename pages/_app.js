import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/globals.css";

import { SessionProvider, useSession } from "next-auth/react";
import Navbar from "./components/Navbar.js";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <header>
        <Navbar />
      </header>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
