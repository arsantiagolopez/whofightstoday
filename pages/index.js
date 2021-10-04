import Head from "next/head";
import React from "react";
import { Events } from "../components/Events";
import { Layout } from "../components/Layout";
// import useSWR from "swr";

const IndexPage = () => {
  // const { data } = useSWR("/api/event");

  return (
    <>
      <Head>
        <title>UFC Card Tonight, This Week.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Events />
      </Layout>
    </>
  );
};

export default IndexPage;
