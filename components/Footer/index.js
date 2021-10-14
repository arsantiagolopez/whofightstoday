import { Flex, Text } from "@chakra-ui/react";
import React from "react";

const Footer = () => (
  <Flex {...styles.wrapper}>
    <Text {...styles.text}>
      <a href={process.env.NEXT_PUBLIC_PORTFOLIO} target="_blank">
        Coded & designed with ❤️ by Alex.
      </a>
    </Text>
  </Flex>
);

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
    cursor: "pointer",
    color: "gray.700",
    fontSize: "10pt",
    fontStyle: "italic",
    letterSpacing: "tighter",
    _hover: {
      color: "white",
      textDecoration: "underline",
    },
  },
};
