import { Flex, Heading, Text } from "@chakra-ui/react";
import moment from "moment";
import React from "react";
import { Headshot } from "../Headshot";

const Upcoming = ({ upcoming }) => {
  return (
    <Flex {...styles.wrapper}>
      <Heading {...styles.heading}>Upcoming</Heading>

      <Flex {...styles.list}>
        {upcoming?.map(({ headline, startMain, location, fights }, index) => {
          // Get last names of fighters for headline
          const names = headline.split(" vs ");
          let [redFirstName, ...redLastName] = names[0].split(" ");
          redLastName = redLastName.join(" ");
          let [blueFirstName, ...blueLastName] = names[1].split(" ");
          blueLastName = blueLastName.join(" ");

          const redProps = { corner: "red", name: names[0] };
          const blueProps = { corner: "blue", name: names[1] };

          return (
            <Flex key={index} {...styles.fight}>
              <Flex {...styles.headshots}>
                <Headshot {...redProps} />
                <Headshot {...blueProps} />
              </Flex>
              <Text
                {...styles.headline}
              >{`${redLastName} vs ${blueLastName}`}</Text>
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
    width: { base: "100%", md: "25vw" },
    height: { base: "auto", md: "20vh" },
  },
  list: {
    zIndex: "2",
    direction: "column",
    paddingTop: { base: "5vh", md: "8vh" },
    paddingBottom: { base: "5vh", md: "10vh" },
  },
  fight: {
    direction: "column",
    marginY: "1vh",
    cursor: "pointer",
  },
  headshots: {
    justify: { base: "center", md: "flex-end" },
  },
  headline: {
    fontSize: { base: "2xl", md: "md" },
    lineHeight: { base: "1.5em", md: "1.25em" },
    textAlign: { base: "center", md: "right" },
    fontFamily: "Averta",
    letterSpacing: "tighter",
    textTransform: "uppercase",
    marginTop: { base: "-1.2vh", md: "auto" },
    zIndex: { base: "999", md: "auto" },
  },
  date: {
    color: "white",
    textAlign: { base: "center", md: "right" },
    fontSize: "10pt",
  },
  location: {
    color: "white",
    textAlign: { base: "center", md: "right" },
    fontSize: "10pt",
  },
};
