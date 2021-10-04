import Head from "next/head";
import React from "react";
import { Layout } from "../components/Layout";
import { Schedule } from "../components/Schedule";
// import useSWR from "swr";

const IndexPage = () => {
  // const { data } = useSWR("/api/event");

  return (
    <>
      <Head>
        <title>UFC Card tonight, this week.</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Schedule />
      </Layout>
    </>
  );
};

export default IndexPage;
