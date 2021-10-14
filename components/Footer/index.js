import { Flex, Text } from "@chakra-ui/react";
import React from "react";

const Footer = () => {
  return (
    <Flex {...styles.wrapper}>
      <Text {...styles.text}>Coded & designed with ❤️ by Alex.</Text>
    </Flex>
  );
};

export { Footer };

// Styles

const styles = {
  wrapper: {
    position: { base: "static", md: "fixed" },
    left: { base: "auto", md: "5vw" },
    bottom: { base: "auto", md: "7vh" },
    paddingY: { base: "5vh", md: "0" },
  },
  text: {
    color: "gray.500",
    fontSize: "10pt",
    fontStyle: "italic",
    letterSpacing: "tighter",
  },
};
