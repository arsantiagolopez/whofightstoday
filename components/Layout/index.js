import { Box, Flex, Image as ChakraImage, Text } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import React from "react";

const Layout = ({ children, title, type }) => {
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
        <Flex {...styles.type}>
          {!type ? null : type === "fight night" ? (
            <Box {...styles.fightNight}>
              <Image
                src="/images/fight-night.png"
                alt={type}
                {...styles.image}
              />
            </Box>
          ) : (
            <Flex {...styles.ufc}>
              <ChakraImage
                src="/images/ufc.png"
                alt={type}
                {...styles.ufcImage}
              />
              <Text {...styles.ufcNumber}>{type?.replace("ufc ", "")}</Text>
            </Flex>
          )}
        </Flex>
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
  type: {
    position: "absolute",
    top: { base: "9vh", md: "14vh" },
  },
  fightNight: {
    width: { base: "25vw", md: "10vw" },
    filter: "invert(1)",
    marginTop: "-2vh",
  },
  ufc: {
    direction: "row",
    align: "flex-end",
  },
  ufcImage: {
    height: { base: "22px", md: "38px" },
    filter: "invert(1)",
    userSelect: "none",
  },
  ufcNumber: {
    color: "white",
    fontFamily: "Averta",
    fontSize: { base: "24pt", md: "40pt" },
    paddingLeft: "1",
    paddingTop: "auto",
    lineHeight: { base: "18px", md: "30px" },
    letterSpacing: "tighter",
  },
  image: {
    layout: "responsive",
    width: 350,
    height: 172,
  },
};
