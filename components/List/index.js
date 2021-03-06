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
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Fighter } from "../Fighter";

const List = ({ fights, activeOdds, setActiveOdds, startMain }) => {
  const [bouts, setBouts] = useState(null);

  // Scroll card into view
  const handleClick = ({ target }) => {
    // window.scrollTo(0, target.offsetTop - 500);
    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "end",
    });
  };

  // Remove duplicate or invalid fights from fights array
  useEffect(() => {
    if (fights) {
      const updated = fights.filter(({ weight }) => weight);
      setBouts(updated);
    }
  }, [fights]);

  return (
    <Accordion defaultIndex={0} {...styles.accordion}>
      {bouts?.map(
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
            order,
          },
          index
        ) => {
          // Get last names of fighters for headline
          const names = headline.split(" vs ");
          let [redFirstName, ...redLastName] = names[0].includes(" ")
            ? names[0].split(" ")
            : names[0];
          redLastName = redLastName.join(" ");
          let [blueFirstName, ...blueLastName] = names[1].includes(" ")
            ? names[1].split(" ")
            : names[1];
          blueLastName = blueLastName.join(" ");

          const weightClass = weight?.replace(" Bout", "");

          // UFC Main Cards usually last 3 hours
          // with fight slots divided by 30 minutes each
          // Start from the main which is most important.
          const minutesFromMainStart = 165; // 165 minutes = 2:45 from start
          // Last fight of main card has order value 1, second to last has order 2, etc...
          // Each fight slot should take about 30 minutes.
          const minutesToSubtract = minutesFromMainStart - order * 30;
          const approxStartFightTime = moment(startMain)
            .add(minutesToSubtract, "minutes")
            .toDate();
          const formattedApproxStart =
            moment(approxStartFightTime).format("h:mm A");

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
                            <Heading {...styles.name} {...styles.buttonName}>
                              {redLastName}
                            </Heading>
                            <Image {...styles.vs} />
                            <Heading {...styles.name} {...styles.buttonName}>
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
                        <Flex>
                          <Heading {...styles.name}>
                            {`${redFirstName} ${redLastName}`}
                            <Text {...styles.panelRanking}>{redRanking}</Text>
                          </Heading>
                        </Flex>
                        <Image {...styles.vs} />
                        <Flex>
                          <Heading {...styles.name}>
                            {`${blueFirstName} ${blueLastName}`}
                            <Text {...styles.panelRanking}>{blueRanking}</Text>
                          </Heading>
                        </Flex>
                        <Text {...styles.approxStart}>
                          Expected {formattedApproxStart}
                        </Text>
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
    paddingTop: { base: "5vh", md: "3vh" },
    paddingBottom: { base: "2vh", md: "5vh" },
  },
  item: {
    border: "none",
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
  buttonName: {
    fontSize: { base: "sm", md: "2xl" },
  },
  vs: {
    src: "/images/vs.png",
    alt: "vs",
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
    display: "inline",
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
    top: { base: "34%", md: "30%" },
    fontFamily: "Arial",
    fontSize: { base: "8pt", md: "10pt" },
    fontWeight: "700",
    letterSpacing: "tighter",
    color: "white",
    textAlign: "center",
    lineHeight: "1em",
  },
  approxStart: {
    position: "absolute",
    bottom: { base: "34%", md: "30%" },
    fontFamily: "Arial",
    fontSize: { base: "8pt", md: "10pt" },
    fontWeight: "700",
    letterSpacing: "tighter",
    color: "white",
    textAlign: "center",
    lineHeight: "1em",
    fontStyle: "italic",
  },
};
