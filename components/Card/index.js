import { Flex } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";

const Card = ({ card }) => {
  const event = card?.href?.replace("/event/", "");
  const { data: fights } = useSWR(event ? `/api/fights/${event}` : null);

  return <Flex {...styles.wrapper}></Flex>;
};

export { Card };

// Styles

const styles = {
  wrapper: {},
};
