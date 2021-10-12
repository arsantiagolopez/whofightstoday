import { Box, Flex } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import React from "react";

const Layout = ({ children, title }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="preload"
          href="/fonts/averta/averta-black-italic.otf"
          as="font"
          crossOrigin=""
        />
      </Head>
      <Flex {...styles.wrapper}>
        <Box {...styles.logo}>
          <Image src="/images/logo.png" alt="Fight" {...styles.image} />
        </Box>
        <Flex {...styles.content}>{children}</Flex>
      </Flex>
    </>
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
