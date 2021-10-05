import { Flex } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";

const Test = () => {
  const { data } = useSWR("/api/fighters");
  console.log("data", data);
  return <Flex {...styles.wrapper}></Flex>;
};

export default Test;

// Styles

const styles = {
  wrapper: {},
};
