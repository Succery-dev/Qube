import Head from "next/head";

import { Navbar } from "../components";

export default function MainLayout({ children }) {
  return (
    <div>
      <Head>
        <title>Qube</title>
        <meta
          name="description"
          content="Empowering relation between Freelancers and Organizations"
        />
        <link rel="icon" href="/images/Qube.jpg" />
      </Head>
      <Navbar />
      {children}
    </div>
  );
}
