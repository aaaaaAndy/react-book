import React from "react";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

import "./index.css";

const PRIMARY_CLASS = "button button--primary button--lg mg-8";

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description="React source code document">
      <main className="layout-main">
        <Link className={PRIMARY_CLASS} to="/docs/v16/react">
          v16.13.1
        </Link>
        <Link className={PRIMARY_CLASS} to="/docs/v17">
          v17.0.1
        </Link>
        <Link className={PRIMARY_CLASS} to="/docs/v18">
          v18
        </Link>
      </main>
    </Layout>
  );
}
