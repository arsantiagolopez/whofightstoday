import chromium, {
  defaultViewport,
  executablePath,
  headless,
} from "chrome-aws-lambda";
import puppeteer from "puppeteer";

const getBrowserInstance = async (args) => {
  // Running locally
  if (!executablePath) {
    return await puppeteer.launch(args);
  }

  // Running on serverless function
  return await chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport,
    executablePath: await executablePath,
    headless,
    ignoreHTTPSErrors: true,
  });
};

export { getBrowserInstance };
