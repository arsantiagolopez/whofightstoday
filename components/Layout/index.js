import { Box, Flex } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";

const Layout = ({ children }) => {
  return (
    <Flex {...styles.wrapper}>
      <Box {...styles.logo}>
        <Image src="/logo.png" alt="Fight" {...styles.image} />
      </Box>
      <Flex {...styles.content}>{children}</Flex>
    </Flex>
  );
};

export { Layout };

// Styles

const styles = {
  wrapper: {
    direction: "column",
    align: "center",
    width: "100%",
    minHeight: "100vh",
    paddingY: { base: "2vh", md: "5vh" },
    bg: "rgba(1,1,20,1)",
  },
  content: {
    direction: "column",
    width: "100%",
  },
  logo: {
    width: { base: "40vw", md: "15vw" },
  },
  image: {
    layout: "responsive",
    width: 350,
    height: 172,
  },
};
