import moment from "moment";
import { getBrowserInstance } from "./getBrowserInstance";

/**
 * Scrape the official UFC site for upcoming events.
 * @returns an array of objects with event information.
 */
const scrapeEvents = async () => {
  const url = "https://www.ufc.com/events";

  try {
    const browser = await getBrowserInstance();
    const page = await browser.newPage();

    // Set default timeout to infinite: page will load
    await page.setDefaultNavigationTimeout(0);
    // Go to URL
    await page.goto(url);
    await page.waitForSelector("[class*='result__info']");

    // Find list of events
    const events = await page.evaluate(() => {
      const fights = Array.from(
        // Parent node with children nodes that each have separate needed info
        document.querySelectorAll("article[class*='event--result']"),
        (node) => {
          const startMain = node
            .querySelector("[data-main-card-timestamp]")
            ?.getAttribute("data-main-card-timestamp");
          const startPrelims = node
            .querySelector("[data-prelims-card-timestamp]")
            ?.getAttribute("data-prelims-card-timestamp");
          const href = node
            .querySelector(".c-card-event--result__logo > a")
            ?.getAttribute("href");
          let type = node
            .querySelector(".c-card-event--result__logo > a")
            ?.getAttribute("href")
            ?.replace("/event/", "")
            ?.replaceAll("-", " ");

          // Strip extra info from type
          type = type?.includes("fight night") ? "fight night" : type;

          // Location
          const locality = node.querySelector(".locality")?.textContent;
          const area = node.querySelector(".administrative-area")?.textContent;
          const country = node.querySelector(".country")?.textContent;
          const venue = node
            .querySelector(".taxonomy-term--type-venue > div > div > h5")
            // Remove line breaks "\n" and double spaces "  "
            ?.textContent?.replace(/\n/g, "")
            ?.replaceAll("  ", "");

          // Location in format "Las Vegas, NV, United States"
          const format = "#locality#area#country";
          const location = format
            .replace(
              "#locality",
              typeof locality !== "undefined" ? `${locality}, ` : ""
            )
            .replace("#area", typeof area !== "undefined" ? `${area}, ` : "")
            .replace(
              "#country",
              typeof country !== "undefined" ? `${country}` : ""
            );

          // Headline, full names & images
          let headline = null;
          let redName = null;
          let blueName = null;
          let redImage = null;
          let blueImage = null;

          const lastNamesHeadline = node.querySelector(
            ".c-card-event--result__headline > a"
          )?.textContent;
          const names = lastNamesHeadline?.split(" vs ");

          // Only give me first last name if fighter has two
          const redLast = names[0].includes(" ")
            ? names[0].split(" ")[0]
            : names[0];
          const blueLast = names[1].includes(" ")
            ? names[1].split(" ")[0]
            : names[1];

          if (redLast !== "TBD") {
            headline = node
              .querySelector(`[data-fight-label*='${redLast}']`)
              ?.getAttribute("data-fight-label");
            const fullNames = headline?.split(" vs ");
            redName = fullNames[0];
            blueName = fullNames[1];
            redImage = node
              .querySelector(
                `[src*='${redLast.toUpperCase()}'][src*="headshot"]`
              )
              ?.getAttribute("src");
            blueImage = node
              .querySelector(
                `[src*='${blueLast.toUpperCase()}'][src*="headshot"]`
              )
              ?.getAttribute("src");
          }

          return {
            headline,
            startMain,
            startPrelims,
            venue,
            location,
            type,
            href,
            redName,
            blueName,
            redImage,
            blueImage,
          };
        }
      );

      return fights;
    });

    // Close the browser
    await browser.close();

    // Filter only future and non-null events
    const filteredEvents = events.filter((event) => {
      const { startMain, redName, blueName } = event;
      const nonNull = redName && blueName;
      const UNIX = parseInt(startMain) * 1000;
      // Testing: change isBefore to isAfter
      const isUpcoming = moment(new Date(UNIX)).isAfter();
      if (isUpcoming && nonNull) return event;
    });

    // Convert from UNIX to Date
    // Testing: remove .slice(0,2)
    const upcomingEvents = filteredEvents?.map((event) => {
      const { startMain, startPrelims } = event;
      const mainDate = new Date(parseInt(startMain) * 1000);
      const prelimsDate = new Date(parseInt(startPrelims) * 1000);
      return {
        ...event,
        startMain: mainDate,
        startPrelims: prelimsDate,
      };
    });

    return upcomingEvents;
  } catch (err) {
    console.log(err);
  }
};

export { scrapeEvents };
