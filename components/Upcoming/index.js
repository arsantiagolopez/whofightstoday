import { Flex, Heading, Text } from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Headshot } from "../Headshot";

const Upcoming = ({ upcoming }) => {
  const [sortedEvents, setSortedEvents] = useState(null);

  // Remove duplicates and sort by date
  useEffect(() => {
    if (upcoming) {
      const unique = [
        ...new Map(upcoming.map((event) => [event["href"], event])).values(),
      ];
      unique.sort((a, b) => new Date(a.startMain) - new Date(b.startMain));
      setSortedEvents(unique);
    }
  }, [upcoming]);

  return (
    <Flex {...styles.wrapper}>
      <Heading {...styles.heading}>Upcoming</Heading>

      <Flex {...styles.list}>
        {sortedEvents?.map(({ headline, startMain, location }, index) => {
          // Get last names of fighters for headline
          const names = headline.split(" vs ");
          const redName = names[0];
          const blueName = names[1];

          const redProps = { corner: "red", name: redName };
          const blueProps = { corner: "blue", name: blueName };

          return (
            <Flex key={index} {...styles.fight}>
              <Flex {...styles.headshots}>
                <Headshot {...redProps} />
                <Headshot {...blueProps} />
              </Flex>
              <Text {...styles.headline}>{`${redName} vs ${blueName}`}</Text>
              <Text {...styles.date}>
                {moment(startMain).format("ddd. MMM. Do / h:00 A")}
              </Text>
              <Text {...styles.location}>{location}</Text>
            </Flex>
          );
        })}
      </Flex>
    </Flex>
  );
};

export { Upcoming };

// Styles

const styles = {
  wrapper: {
    position: { base: "static", md: "fixed" },
    top: { base: "auto", md: "0" },
    right: { base: "auto", md: "0" },
    paddingTop: { base: "5vh", md: "10vh" },
    paddingRight: { base: "auto", md: "5vw" },
    direction: "column",
    color: "white",
    maxHeight: { base: "none", md: "100vh" },
    width: { base: "100%", md: "25vw" },
    overflowY: "scroll",
  },
  heading: {
    zIndex: "5",
    textTransform: "uppercase",
    textAlign: { base: "center", md: "right" },
    fontFamily: "Averta",
    position: { base: "static", md: "fixed" },
    right: { base: "auto", md: "0" },
    paddingRight: { base: "auto", md: "5vw" },
    top: { base: "auto", md: "0" },
    paddingTop: { base: "0", md: "10vh" },
    background:
      "linear-gradient(180deg, rgba(1,1,20,1) 20%, rgba(1,1,20,0) 100%)",
    backdropFilter: "blur(0.5)",
    width: { base: "100%", md: "30vw" },
    height: { base: "auto", md: "20vh" },
  },
  list: {
    zIndex: "2",
    direction: "column",
    paddingTop: { base: "5vh", md: "8vh" },
    paddingBottom: { base: "0", md: "10vh" },
  },
  fight: {
    direction: "column",
    marginY: "1vh",
  },
  headshots: {
    justify: { base: "center", md: "flex-end" },
  },
  headline: {
    fontSize: { base: "1.75em", md: "md" },
    lineHeight: { base: "1.5em", md: "1.25em" },
    textAlign: { base: "center", md: "right" },
    fontFamily: "Averta",
    letterSpacing: "tighter",
    textTransform: "uppercase",
    marginTop: { base: "-1.5vh", md: "auto" },
    zIndex: { base: "999", md: "auto" },
    isTruncated: true,
  },
  date: {
    color: "gray.200",
    textAlign: { base: "center", md: "right" },
    fontSize: "10pt",
    marginTop: { base: "-1vh", md: "auto" },
  },
  location: {
    color: "gray.200",
    textAlign: { base: "center", md: "right" },
    fontSize: "10pt",
  },
};
