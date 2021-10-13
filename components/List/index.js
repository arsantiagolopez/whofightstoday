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
import React from "react";
import { Fighter } from "../Fighter";

const List = ({ fights, activeOdds, setActiveOdds }) => {
  const handleClick = ({ target }) => {
    // window.scrollTo(0, target.offsetTop - 500);
    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "end",
    });
  };

  return (
    <Accordion defaultIndex={0} {...styles.accordion}>
      {fights?.map(
        (
          {
            redFighterId,
            blueFighterId,
            headline,
            redRanking,
            blueRanking,
            redOdds,
            blueOdds,
            weight,
          },
          index
        ) => {
          // Get last names of fighters for headline
          const names = headline.split(" vs ");
          let [redFirstName, ...redLastName] = names[0].split(" ");
          redLastName = redLastName.join(" ");
          let [blueFirstName, ...blueLastName] = names[1].split(" ");
          blueLastName = blueLastName.join(" ");

          const weightClass = weight.replace(" Bout", "");

          return (
            <AccordionItem key={index} {...styles.item}>
              {({ isExpanded }) => {
                const redProps = {
                  isActive: isExpanded,
                  corner: "red",
                  americanOdds: redOdds,
                  activeOdds,
                  setActiveOdds,
                };
                const blueProps = {
                  isActive: isExpanded,
                  corner: "blue",
                  americanOdds: blueOdds,
                  activeOdds,
                  setActiveOdds,
                };

                return (
                  <>
                    {/* Button card */}
                    <AccordionButton
                      onClick={handleClick}
                      display={isExpanded ? "none" : "flex"}
                      {...styles.button}
                      marginTop={index === 0 && !isExpanded && "5vh"}
                    >
                      {!isExpanded && (
                        <Flex {...styles.card}>
                          {/* Ranking */}
                          <Text
                            left={{ base: "2em", md: "34vw" }}
                            {...styles.ranking}
                          >
                            {redRanking}
                          </Text>
                          {/* Red Fighter */}
                          <Fighter id={redFighterId} {...redProps} />

                          {/* Center info */}
                          <Flex {...styles.centerSection}>
                            <Heading
                              {...styles.name}
                              fontSize={{ base: "sm", md: "2xl" }}
                            >
                              {redLastName}
                            </Heading>
                            <Image
                              src="/images/vs.png"
                              alt="vs"
                              {...styles.vs}
                            />
                            <Heading
                              {...styles.name}
                              fontSize={{ base: "sm", md: "2xl" }}
                            >
                              {blueLastName}
                            </Heading>
                          </Flex>

                          {/* Blue Fighter */}
                          <Fighter id={blueFighterId} {...blueProps} />
                          {/* Ranking */}
                          <Text
                            right={{ base: "2em", md: "34vw" }}
                            {...styles.ranking}
                          >
                            {blueRanking}
                          </Text>
                        </Flex>
                      )}
                    </AccordionButton>

                    {/* Panel card */}
                    <AccordionPanel
                      marginTop={index === 0 && isExpanded && "3vh"}
                      {...styles.panel}
                    >
                      {/* Red Fighter */}
                      <Fighter id={redFighterId} {...redProps} />

                      {/* Center info */}
                      <Flex {...styles.centerSection}>
                        <Text {...styles.weight}>{weightClass}</Text>
                        <Flex direction="row">
                          <Heading
                            {...styles.name}
                          >{`${redFirstName} ${redLastName}`}</Heading>
                          <Text {...styles.panelRanking}>{redRanking}</Text>
                        </Flex>
                        <Image src="/images/vs.png" alt="vs" {...styles.vs} />
                        <Flex direction="row">
                          <Heading
                            {...styles.name}
                          >{`${blueFirstName} ${blueLastName}`}</Heading>
                          <Text {...styles.panelRanking}>{blueRanking}</Text>
                        </Flex>
                      </Flex>

                      {/* Blue Fighter */}
                      <Fighter id={blueFighterId} {...blueProps} />
                    </AccordionPanel>
                  </>
                );
              }}
            </AccordionItem>
          );
        }
      )}
    </Accordion>
  );
};

export { List };

// Styles

const styles = {
  accordion: {
    width: "100%",
  },
  button: {
    justifyContent: "center",
    marginY: "2vh",
    background:
      "linear-gradient(99deg, rgba(1,1,20,1) 0%, #1A202C 10%, #1A202C 90%, rgba(1,1,20,1) 100%)",
    paddingBottom: 0,
    _hover: {
      background:
        "linear-gradient(99deg, rgba(1,1,20,1) 0%, #CBD5E0 40%, #CBD5E0 60%, rgba(1,1,20,1) 100%)",
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
    marginTop: { base: "1", md: "0.5vh" },
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
    position: "relative",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingY: { base: "2", md: "-2vh" },
  },
  weight: {
    position: "absolute",
    top: { base: "0", md: "10%" },
    // maxWidth: "30%",
    fontFamily: "Arial",
    fontSize: { base: "8pt", md: "10pt" },
    color: "white",
    textAlign: "center",
    lineHeight: "1em",
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
