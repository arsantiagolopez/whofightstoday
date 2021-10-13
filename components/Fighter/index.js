import { Image } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";

const Fighter = ({ id, isActive, corner }) => {
  const { data: fighter } = useSWR(id ? `/api/fighters/${id}` : null);

  const { _id, firstName, lastName, name, image, weight } = fighter || {};

  const imageSrc = image
    ? image
    : corner === "red"
    ? process.env.NEXT_PUBLIC_FULL_RED
    : process.env.NEXT_PUBLIC_FULL_BLUE;

  return (
    <Image
      src={imageSrc}
      filter={!image && "invert(0.3)"}
      fit="cover"
      align="20% 0"
      width={isActive ? "auto" : "25vw"}
      height={isActive ? "40vh" : "12vh"}
    />
  );
};

export { Fighter };

// Styles

const styles = {
  wrapper: {},
};
