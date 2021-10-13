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
              let [redFirstName, ...redLastName] = names[0].split(" ");
              redLastName = redLastName.join(" ");
              let [blueFirstName, ...blueLastName] = names[1].split(" ");
              blueLastName = blueLastName.join(" ");

              return (
                <AccordionItem key={index} {...styles.item}>
                  {({ isExpanded }) => (
                    <>
                      {/* Button card */}
                      <AccordionButton
                        display={isExpanded ? "none" : "flex"}
                        {...styles.button}
                        marginTop={index === 0 && !isExpanded && "5vh"}
                      >
                        {!isExpanded && (
                          <Flex {...styles.card}>
                            {/* Ranking */}
                            <Text
                              left={{ base: "2em", md: "32vw" }}
                              {...styles.ranking}
                            >
                              {redRanking}
                            </Text>
                            {/* Red Fighter */}
                            <Fighter
                              id={redFighterId}
                              isActive={isExpanded}
                              corner="red"
                            />

                            {/* Center info */}
                            <Flex {...styles.centerSection}>
                              <Heading
                                {...styles.name}
                                fontSize={{ base: "sm", md: "2xl" }}
                              >
                                {redLastName}
                              </Heading>
                              <Image src="/images/vs.png" {...styles.vs} />
                              <Heading
                                {...styles.name}
                                fontSize={{ base: "sm", md: "2xl" }}
                              >
                                {blueLastName}
                              </Heading>
                            </Flex>

                            {/* Blue Fighter */}
                            <Fighter
                              id={blueFighterId}
                              isActive={isExpanded}
                              corner="blue"
                            />
                            {/* Ranking */}
                            <Text
                              right={{ base: "2em", md: "32vw" }}
                              {...styles.ranking}
                            >
                              {blueRanking}
                            </Text>
                          </Flex>
                        )}
                      </AccordionButton>

                      {/* Panel card */}
                      <AccordionPanel {...styles.panel}>
                        {/* Red Fighter */}
                        <Fighter
                          id={redFighterId}
                          isActive={isExpanded}
                          corner="red"
                        />

                        {/* Center info */}
                        <Flex {...styles.centerSection}>
                          <Flex direction="row">
                            <Heading
                              {...styles.name}
                            >{`${redFirstName} ${redLastName}`}</Heading>
                            <Text {...styles.panelRanking}>{redRanking}</Text>
                          </Flex>

                          <Image src="/images/vs.png" {...styles.vs} />

                          <Flex direction="row">
                            <Heading
                              {...styles.name}
                            >{`${blueFirstName} ${blueLastName}`}</Heading>
                            <Text {...styles.panelRanking}>{blueRanking}</Text>
                          </Flex>
                        </Flex>

                        {/* Blue Fighter */}
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
    marginX: { base: "1em", md: "30vw" },
  },
  button: {
    justifyContent: "center",
    marginY: "2vh",
    background:
      "linear-gradient(99deg, #000000 0%, #1A202C 10%, #1A202C 90%, #000000 100%)",
    paddingBottom: 0,
    _hover: {
      background:
        "linear-gradient(99deg, #000000 0%, #CBD5E0 40%, #CBD5E0 60%, #000000 100%)",
    },
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
    fontSize: { base: "1rem", md: "1.5rem" },
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
    textAlign: "center",
  },
  vs: {
    width: { base: "5vw", md: "2vw" },
    marginX: "2vw",
    marginBottom: "1vh",
    marginTop: { base: "0", md: "0.5vh" },
  },
  panelRanking: {
    color: "red.400",
    fontSize: { base: "8pt", md: "12pt" },
    marginTop: "auto",
    marginBottom: "0",
    marginLeft: "0.5",
    fontFamily: "Averta",
  },
  panel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: { base: "space-between", md: "space-between" },
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
