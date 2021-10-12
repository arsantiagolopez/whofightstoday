import { Flex } from "@chakra-ui/react";
import React from "react";

const Test = () => {
  // const event = "ufc-fight-night-october-09-2021";
  // const { data } = useSWR(event ? `/api/fights/${event}` : null);
  // console.log("data", data);

  const last = "Ladd vs Dumont Viana";
  const names = last.split(" vs ");
  const lastUppercase = names[0].split(" ")[0];
  console.log("lastUppercase", lastUppercase);

  return <Flex {...styles.wrapper}></Flex>;
};

export default Test;

// Styles

const styles = {
  wrapper: {},
};
