import { ChakraProvider } from "@chakra-ui/react";
import { SWRConfig } from "swr";
import axios from "../axios";

function MyApp({ Component, pageProps }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => axios(url).then((res) => res.data),
      }}
    >
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </SWRConfig>
  );
}

export default MyApp;
