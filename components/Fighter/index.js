import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import { Odds } from "../Odds";

const Fighter = ({
  id,
  isActive,
  corner,
  americanOdds,
  activeOdds,
  setActiveOdds,
}) => {
  const { data: fighter } = useSWR(id ? `/api/fighters/${id}` : null);

  const { _id, firstName, lastName, name, image, weight } = fighter || {};

  const imageSrc = image
    ? image
    : corner === "red"
    ? process.env.NEXT_PUBLIC_FULL_RED
    : process.env.NEXT_PUBLIC_FULL_BLUE;

  const oddsProps = { americanOdds, activeOdds, setActiveOdds };

  return (
    <Flex {...styles.wrapper}>
      <Image
        src={imageSrc}
        alt={name}
        filter={!image && "invert(0.3)"}
        width={isActive ? "auto" : { base: "25vw", md: "9vw" }}
        height={
          isActive ? { base: "40vh", md: "60vh" } : { base: "12vh", md: "15vh" }
        }
        {...styles.image}
      />
      {isActive && <Odds {...oddsProps} />}
    </Flex>
  );
};

export { Fighter };

// Styles

const styles = {
  wrapper: {
    direction: "column",
    justify: "center",
  },
  image: {
    fit: "cover",
    align: "20% 0",
  },
};
