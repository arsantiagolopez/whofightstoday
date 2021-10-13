import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { List } from "../List";
import { ListOfFightsSkeleton } from "../Skeletons";

const Card = ({ card }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [fights, setFights] = useState(null);
  const [main, setMain] = useState(null);
  const [prelims, setPrelims] = useState(null);

  const event = card?.href?.replace("/event/", "");
  const { data } = useSWR(card ? `/api/fights/${event}` : null);

  const handleTabsChange = (index) => {
    setTabIndex(index);
  };

  useEffect(() => {
    if (data) {
      // Sort fights by order
      data.sort((a, b) => a.order - b.order);

      const mainFights = data.filter(({ isMainCard }) => isMainCard);
      const prelimFights = data.filter(({ isMainCard }) => !isMainCard);

      setMain(mainFights);
      setPrelims(prelimFights);
      setFights(data);
    }
  }, [data]);

  // Show loading list of fights skeleton
  if (!data) {
    return <ListOfFightsSkeleton />;
  }

  return (
    <Tabs index={tabIndex} onChange={handleTabsChange} {...styles.tabs}>
      <TabPanels>
        <TabPanel {...styles.panel}>{main && <List fights={main} />}</TabPanel>
        <TabPanel {...styles.panel}>
          {prelims && <List fights={prelims} />}
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
    position: { base: "static", md: "fixed" },
    left: { base: "auto", md: "5vw" },
    top: "40vh",
    flexDirection: { base: "row", md: "column" },
    justifyContent: { base: "center", md: "flex-start" },
    alignItems: "flex-start",
  },
  tab: {
    fontFamily: "Averta",
    fontSize: { base: "2xl", md: "4xl" },
    textTransform: "uppercase",
    letterSpacing: "tighter",
    lineHeight: "1em",
    _active: {
      color: "white",
    },
    _hover: {
      color: "white",
    },
  },
  panels: {},
  panel: {
    padding: "0",
  },
};
