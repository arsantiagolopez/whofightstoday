import { Flex } from "@chakra-ui/react";
import React from "react";

const Test = () => {
  const headline = "Mackenzie Dern vs Holly Holm";

  const names = headline.split(" vs ");
  const test = names[0];

  console.log(test);
  return <Flex {...styles.wrapper}></Flex>;
};

export default Test;

// Styles

const styles = {
  wrapper: {},
};
