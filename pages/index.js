import { CircularProgress } from "@chakra-ui/react";
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

  console.log("* Events: ", events);

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
        {events ? (
          <Card {...cardProps} />
        ) : (
          <CircularProgress {...styles.progress} />
        )}
      </Layout>
    </>
  );
};

export default IndexPage;

// Styles

const styles = {
  progress: {
    isIndeterminate: true,
    color: "yellow.300",
    alignSelf: "center",
    paddingTop: "35vh",
    trackColor: "black",
    size: "1.5em",
  },
};
