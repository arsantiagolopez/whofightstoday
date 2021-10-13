import { Flex, Heading } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

const Odds = ({ americanOdds, activeOdds, setActiveOdds }) => {
  const [decimalOdds, setDecimalOdds] = useState(null);

  // Convert from american to decimal
  const convertToDecimal = () => {
    let number = parseInt(americanOdds);
    if (number > 0) {
      number = americanOdds / 100 + 1;
      return number.toFixed(2);
    } else {
      number = 100 / (americanOdds * -1) + 1;
      return number.toFixed(2);
    }
  };

  // Toggle odds format
  const toggleOdds = () =>
    setActiveOdds(activeOdds === "american" ? "decimal" : "american");

  // Convert odds on toggle
  useEffect(() => {
    if (activeOdds !== "american") {
      setDecimalOdds(convertToDecimal());
    }
  }, [activeOdds]);

  return (
    <Flex {...styles.wrapper}>
      <Heading onClick={toggleOdds} {...styles.odds}>
        {activeOdds === "american" ? americanOdds : decimalOdds}
      </Heading>
    </Flex>
  );
};

export { Odds };

// Styles

const styles = {
  wrapper: {
    justify: "center",
    marginY: "1vh",
  },
  odds: {
    cursor: "pointer",
    color: "white",
    fontFamily: "Averta",
    fontSize: { base: "2xl", md: "2xl" },
  },
};
