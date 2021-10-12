import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";

const Fighter = ({ id, isActive }) => {
  const { data: fighter } = useSWR(id ? `/api/fighters/${id}` : null);

  const { _id, firstName, lastName, name, image, weight } = fighter || {};

  return (
    <Flex {...styles.wrapper}>
      <Image src={image} width="10vw" />
    </Flex>
  );
};

export { Fighter };

// Styles

const styles = {
  wrapper: {},
};
