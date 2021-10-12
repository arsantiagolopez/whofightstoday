import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Flex,
  Image,
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

  console.log(fights);

  useEffect(() => {
    if (data) {
      // Order fights
      data.map((fight) => console.log(fight.order));

      setFights(data);
    }
  }, [data]);

  return (
    <Flex {...styles.wrapper}>
      {card && fights && (
        <Accordion defaultIndex={0} {...styles.accordion}>
          {fights.map(({ redFighterId, blueFighterId }, index) => (
            <AccordionItem key={index} {...styles.item}>
              {({ isExpanded }) => (
                <>
                  <AccordionButton {...styles.button}>
                    {!isExpanded && (
                      <Flex direction="row" justify="center" align="center">
                        <Fighter
                          id={redFighterId}
                          isActive={isExpanded}
                          corner="red"
                        />
                        <Image src="/images/vs.png" width="5vw" marginX="2vw" />
                        <Fighter
                          id={blueFighterId}
                          isActive={isExpanded}
                          corner="blue"
                        />
                      </Flex>
                    )}
                  </AccordionButton>

                  <AccordionPanel {...styles.panel}></AccordionPanel>
                </>
              )}
            </AccordionItem>
          ))}
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
  },
  button: {
    padding: "0",
    marginX: "0",
    justifyContent: "center",
  },
  panel: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
