import { CircularProgress } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Card } from "../components/Card";
import { Layout } from "../components/Layout";
import { Upcoming } from "../components/Upcoming";
import { getDates } from "../utils/getDates";

const IndexPage = () => {
  const [card, setCard] = useState(null);
  const [upcoming, setUpcoming] = useState(null);
  const { data: events } = useSWR("/api/events");

  const { startOfWeek, endOfWeek } = getDates();

  useEffect(() => {
    if (events) {
      // Get this week's event
      const event = events.find(({ startMain }) =>
        moment(startMain).isBetween(startOfWeek, endOfWeek)
      );
      // Get all future events
      const futureEvents = events.filter(({ startMain }) =>
        moment(startMain).isAfter(endOfWeek)
      );
      setCard(event);
      setUpcoming(futureEvents);

      // // Testing: remove below and uncomment up top
      // setCard(events[0]);
    } else {
      setCard(null);
    }
  }, [events]);

  const cardProps = { card };
  const upcomingProps = { upcoming };

  return (
    <Layout title="UFC Card This Week" type={card?.type}>
      {events ? (
        <>
          <Card {...cardProps} />
          <Upcoming {...upcomingProps} />
        </>
      ) : (
        <CircularProgress {...styles.progress} />
      )}
    </Layout>
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
