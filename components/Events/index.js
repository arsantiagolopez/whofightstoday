import { Flex } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";

const Events = () => {
  const { data } = useSWR("/api/events");

  return <Flex {...styles.wrapper}></Flex>;
};

export { Events };

// Styles

const styles = {
  wrapper: {},
};
