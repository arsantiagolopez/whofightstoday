import { Flex } from "@chakra-ui/react";
import React from "react";
import useSWR from "swr";
import axios from "../../axios";

// Allow passing of arguments to SWR
const fetcher = (url, href) =>
  axios(url, { params: href }).then((res) => res.data);

const Card = ({ card }) => {
  const { data: fights } = useSWR(
    card ? ["/api/fights/", card?.href] : null,
    fetcher
  );

  return <Flex {...styles.wrapper}></Flex>;
};

export { Card };

// Styles

const styles = {
  wrapper: {},
};
