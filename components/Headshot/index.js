import { Image } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";

const Headshot = ({ name, corner }) => {
  const { data: fighter } = useSWR(name ? `/api/fighters/name/${name}` : null);

  const { name: fighterName, image } = fighter || {};

  const imageSrc = image ? image : process.env.NEXT_PUBLIC_HEADSHOT;

  return (
    <Image
      src={imageSrc}
      alt={fighterName}
      marginRight={
        corner === "red"
          ? { base: "-10vw", md: "-1.5vw" }
          : { base: "0", md: "-2" }
      }
      zIndex={corner === "red" ? "2" : "1"}
      {...styles.image}
    />
  );
};

export { Headshot };

// Styles

const styles = {
  wrapper: {},
  image: {
    width: { base: "35vw", md: "4.5vw" },
  },
};
