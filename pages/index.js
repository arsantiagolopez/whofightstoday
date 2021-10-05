import moment from "moment";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Card } from "../components/Card";
import { Layout } from "../components/Layout";
import { useDates } from "../utils/useDates";

const IndexPage = () => {
  const [card, setCard] = useState(null);
  const { data: events } = useSWR("/api/events");

  const { startOfWeek, endOfWeek } = useDates();

  useEffect(() => {
    if (events) {
      // Get this week's event
      const event = events.find(({ startMain }) =>
        moment(startMain).isBetween(startOfWeek, endOfWeek)
      );
      setCard(event);
    }
  }, [events]);

  const cardProps = { card };

  return (
    <>
      <Head>
        <title>UFC Card This Week</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <Card {...cardProps} />
      </Layout>
    </>
  );
};

export default IndexPage;
