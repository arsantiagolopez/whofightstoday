import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
  Image,
} from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";

const Card = ({ card }) => {
  const event = card?.href?.replace("/event/", "");
  const { data: fights } = useSWR(event ? `/api/fights/${event}` : null);

  console.log("fights", fights);
  console.log("card", card);

  return (
    <Flex {...styles.wrapper}>
      {card && fights && (
        <Accordion width="100%" defaultIndex={0}>
          <AccordionItem border="none">
            {({ isExpanded }) => (
              <>
                <AccordionButton
                  padding="0"
                  marginX="0"
                  justifyContent="center"
                >
                  {!isExpanded && (
                    <Image
                      src={card?.redImage}
                      alt={card?.redName}
                      {...styles.image}
                    />
                  )}
                </AccordionButton>
                <AccordionPanel
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Image
                    src={fights[0]?.redImage}
                    alt={fights[0]?.redName}
                    {...styles.image}
                  />

                  <Image
                    src="/vs.png"
                    width={{ base: "10vw", md: "5vw" }}
                    marginX="7vw"
                  />

                  <Image
                    src={fights[0]?.blueImage}
                    alt={fights[0]?.blueName}
                    {...styles.image}
                  />
                </AccordionPanel>
              </>
            )}
          </AccordionItem>

          <AccordionItem>
            {({ isExpanded }) => (
              <>
                <AccordionButton></AccordionButton>
                <AccordionPanel width="100%" bg="blue.500"></AccordionPanel>
              </>
            )}
          </AccordionItem>
        </Accordion>
      )}
    </Flex>
  );
};

export { Card };

// Styles

const styles = {
  wrapper: {},
  tabs: {
    width: "100%",
  },
  image: {
    width: { base: "25vw", md: "10vw" },
  },
};
