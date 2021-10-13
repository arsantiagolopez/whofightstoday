import { Flex, Skeleton } from "@chakra-ui/react";
import React from "react";

const ListOfFightsSkeleton = () => (
  <Flex {...styles.wrapper}>
    {Array(6)
      .fill()
      .map((index) => (
        <Skeleton key={index} {...styles.skeleton} />
      ))}
  </Flex>
);

export { ListOfFightsSkeleton };

// Styles

const styles = {
  wrapper: {
    direction: "column",
    marginX: { base: "1em", md: "30vw" },
    paddingY: { base: "2em", md: "7vh" },
    paddingBottom: { base: "0", md: "5vh" },
  },
  skeleton: {
    width: "100%",
    height: { base: "12vh", md: "15vh" },
    marginY: "1vh",
    borderRadius: "0.25em",
    startColor: "black",
    endColor: "gray.800",
  },
};
