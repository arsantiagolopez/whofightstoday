import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { List } from "../List";
import { ListOfFightsSkeleton } from "../Skeletons";

const Card = ({ card }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [activeOdds, setActiveOdds] = useState("american");
  const [main, setMain] = useState(null);
  const [prelims, setPrelims] = useState(null);

  const { href, startMain, startPrelims } = card || {};

  const event = href?.replace("/event/", "");
  const { data } = useSWR(card ? `/api/fights/${event}` : null);

  const handleTabsChange = (index) => setTabIndex(index);

  useEffect(() => {
    if (data) {
      // Sort fights by order
      data.sort((a, b) => a.order - b.order);

      const mainFights = data.filter(({ isMainCard }) => isMainCard);
      const prelimFights = data.filter(({ isMainCard }) => !isMainCard);

      setMain(mainFights);
      setPrelims(prelimFights);
    }
  }, [data]);

  const listProps = { activeOdds, setActiveOdds };

  // Show loading list of fights skeleton
  if (!data) {
    return <ListOfFightsSkeleton />;
  }

  return (
    <>
      {/* Main and Prelims Card */}
      <Tabs index={tabIndex} onChange={handleTabsChange} {...styles.tabs}>
        <TabPanels>
          <TabPanel {...styles.panel}>
            {main && <List fights={main} {...listProps} />}
          </TabPanel>
          <TabPanel {...styles.panel}>
            {prelims && <List fights={prelims} {...listProps} />}
          </TabPanel>
        </TabPanels>
        <TabList {...styles.list}>
          <Tab color={tabIndex === 0 ? "white" : "gray.800"} {...styles.tab}>
            Main
          </Tab>
          <Tab color={tabIndex === 1 ? "white" : "gray.800"} {...styles.tab}>
            Prelims
          </Tab>
        </TabList>
      </Tabs>

      {/* Odds format */}
      <Flex {...styles.oddsFormat}>
        <Text
          color={activeOdds === "american" ? "white" : "gray.800"}
          onClick={() => setActiveOdds("american")}
          {...styles.tab}
          {...styles.odds}
        >
          American /
        </Text>

        <Text
          color={activeOdds === "decimal" ? "white" : "gray.800"}
          onClick={() => setActiveOdds("decimal")}
          {...styles.tab}
          {...styles.odds}
        >
          Decimal
        </Text>
      </Flex>

      {/* Start time */}
      <Flex {...styles.startTime}>
        <Text {...styles.type}>
          {tabIndex === 0 ? "Main starts" : "Prelims start"}
        </Text>
        <Text {...styles.dateMobile}>
          {moment(tabIndex === 0 ? startMain : startPrelims).format(
            "ddd. MMMM Do"
          )}
        </Text>
        <Text {...styles.dateDesktop}>
          {moment(tabIndex === 0 ? startMain : startPrelims).format(
            "ddd. MMM. D"
          )}
        </Text>
        <Text {...styles.time}>
          @ {moment(tabIndex === 0 ? startMain : startPrelims).format("h:00 A")}
        </Text>
      </Flex>
    </>
  );
};

export { Card };

// Styles

const styles = {
  tabs: {
    variant: "unstyled",
    width: "100%",
    paddingX: { base: "1em", md: "30vw" },
  },
  list: {
    position: { base: "absolute", md: "fixed" },
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    top: { base: "1em", md: "45vh" },
    left: { base: "1em", md: "5vw" },
  },
  tab: {
    fontFamily: "Averta",
    fontSize: { base: "1.2em", md: "4xl" },
    textTransform: "uppercase",
    letterSpacing: "tighter",
    lineHeight: { base: "1.5em", md: "1.25em" },
    padding: "0",
    _active: {
      color: "white",
    },
    _hover: {
      color: "white",
    },
  },
  panel: {
    padding: "0",
  },
  oddsFormat: {
    position: { base: "absolute", md: "fixed" },
    bottom: { base: "auto", md: "10vh" },
    top: { base: "1em", md: "auto" },
    left: { base: "auto", md: "5vw" },
    right: { base: "1em", md: "auto" },
    direction: "column",
  },
  odds: {
    cursor: "pointer",
    fontSize: { base: "1.2em", md: "4xl" },
    lineHeight: { base: "1.5em", md: "1.25em" },
    textAlign: { base: "right", md: "left" },
  },
  startTime: {
    direction: { base: "column", md: "column" },
    position: { base: "absolute", md: "fixed" },
    align: { base: "center", md: "flex-start" },
    justify: "center",
    width: "100%",
    top: { base: "14vh", md: "10vh" },
    left: { base: "auto", md: "5vw" },
    color: "white",
    fontFamily: "Averta",
    textAlign: "left",
    textTransform: "uppercase",
    lineHeight: { base: "1.5em", md: "2.5em" },
    letterSpacing: "tighter",
  },
  type: {
    display: { base: "none", md: "block" },
    fontSize: "4xl",
  },
  dateMobile: {
    display: { base: "block", md: "none" },
    fontSize: { base: "0.75em", md: "3xl" },
  },
  dateDesktop: {
    display: { base: "none", md: "block" },
    fontSize: { base: "0.75em", md: "3xl" },
  },
  time: {
    fontSize: { base: "0.75em", md: "2xl" },
    lineHeight: "1.2em",
    marginLeft: { base: "1.5", md: "0" },
  },
};
