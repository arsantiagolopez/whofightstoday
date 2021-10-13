import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Fighter } from "../Fighter";

const Card = ({ card }) => {
  const [fights, setFights] = useState(null);
  const [main, setMain] = useState(null);
  const [prelims, setPrelims] = useState(null);

  const event = card?.href?.replace("/event/", "");
  const { data } = useSWR(card ? `/api/fights/${event}` : null);

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

  return (
    <Flex {...styles.wrapper}>
      {card && fights && (
        <Accordion defaultIndex={0} {...styles.accordion}>
          {fights.map(
            (
              {
                redFighterId,
                blueFighterId,
                headline,
                redRanking,
                blueRanking,
              },
              index
            ) => {
              // Get last names of fighters for headline
              const names = headline.split(" vs ");
              let [_, ...redLastName] = names[0].split(" ");
              redLastName = redLastName.join(" ");
              let [__, ...blueLastName] = names[1].split(" ");
              blueLastName = blueLastName.join(" ");

              return (
                <AccordionItem key={index} {...styles.item}>
                  {({ isExpanded }) => (
                    <>
                      <AccordionButton
                        display={isExpanded ? "none" : "flex"}
                        {...styles.button}
                      >
                        {!isExpanded && (
                          <Flex {...styles.card}>
                            {/* Ranking */}
                            <Text left="2em" {...styles.ranking}>
                              {redRanking}
                            </Text>
                            {/* Red Fighter */}
                            <Fighter
                              id={redFighterId}
                              isActive={isExpanded}
                              corner="red"
                            />
                            <Flex {...styles.centerSection}>
                              <Heading {...styles.name}>{redLastName}</Heading>

                              <Image
                                src="/images/vs.png"
                                width="5vw"
                                marginX="2vw"
                                marginBottom="1vh"
                              />

                              <Heading {...styles.name}>{blueLastName}</Heading>
                            </Flex>

                            {/* Blue Fighter */}
                            <Fighter
                              id={blueFighterId}
                              isActive={isExpanded}
                              corner="blue"
                            />
                            {/* Ranking */}
                            <Text right="2em" {...styles.ranking}>
                              {blueRanking}
                            </Text>
                          </Flex>
                        )}
                      </AccordionButton>

                      <AccordionPanel {...styles.panel}>
                        <Fighter
                          id={redFighterId}
                          isActive={isExpanded}
                          corner="red"
                        />
                        <Flex
                          direction="column"
                          justify="center"
                          align="center"
                        >
                          <Flex direction="row">
                            <Heading {...styles.name}>{redLastName}</Heading>
                            <Text {...styles.panelRanking}>{redRanking}</Text>
                          </Flex>

                          <Image
                            src="/images/vs.png"
                            width="5vw"
                            marginX="2vw"
                            marginY="1"
                          />

                          <Flex direction="row">
                            <Heading {...styles.name}>{blueLastName}</Heading>
                            <Text {...styles.panelRanking}>{blueRanking}</Text>
                          </Flex>
                        </Flex>

                        <Fighter
                          id={blueFighterId}
                          isActive={isExpanded}
                          corner="blue"
                        />
                      </AccordionPanel>
                    </>
                  )}
                </AccordionItem>
              );
            }
          )}
        </Accordion>
      )}
    </Flex>
  );
};

export { Card };

// Styles

const styles = {
  wrapper: {},
  accordion: {
    width: "100%",
    marginX: { base: "1em", md: "20vw" },
  },
  button: {
    justifyContent: "center",
    marginY: "2vh",
    background: "gray.800",
    borderRadius: "0.25em",
    paddingBottom: 0,
  },
  card: {
    direction: "row",
    justify: "center",
    align: "center",
    padding: "0",
  },
  ranking: {
    color: "white",
    textTransform: "italic",
    fontFamily: "Averta",
    position: "absolute",
  },
  centerSection: {
    direction: "column",
    justify: "center",
    align: "center",
    width: "50%",
  },
  name: {
    fontFamily: "Averta",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: "tight",
    fontSize: { base: "sm", md: "3xl" },
  },
  panelRanking: {
    color: "red.400",
    fontSize: "8pt",
    marginTop: "auto",
    marginBottom: "0",
    marginLeft: "0.5",
    textTransform: "italic",
    fontFamily: "Averta",
  },
  panel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: { base: "space-between", md: "center" },
  },
  item: {
    border: "none",
  },
  tabs: {
    width: "100%",
  },
  image: {
    width: { base: "25vw", md: "10vw" },
  },
};
