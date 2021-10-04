import { Flex } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";

const Schedule = () => {
  const { data } = useSWR("/api/schedule");

  return <Flex {...styles.wrapper}></Flex>;
};

export { Schedule };

// Styles

const styles = {
  wrapper: {},
};
