import moment from "moment";
import puppeteer from "puppeteer";

/**
 * Scrape the official UFC site for upcoming events.
 * @returns an array of objects with event information.
 */
const scrapeEvents = async () => {
  const url = "https://www.ufc.com/events";

  try {
    const browser = await puppeteer.launch();
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
          const headline = node.querySelector(
            ".c-card-event--result__headline > a"
          )?.textContent;
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

          // Images
          // Find a img with src that contains fighter's uppercase last name
          const names = headline?.split(" vs ");
          const redName = names[0];
          const redLastName =
            redName?.split(" ")?.length > 1
              ? redName?.split(" ")[1]
              : redName?.split(" ")[0];
          const redLastUppercase = redLastName?.toUpperCase();
          const redImage = node
            .querySelector(`img[src*='${redLastUppercase}']`)
            ?.getAttribute("src");
          const blueName = names[1];
          const blueLastName =
            blueName?.split(" ")?.length > 1
              ? blueName?.split(" ")[1]
              : blueName?.split(" ")[0];
          const blueLastUppercase = blueLastName?.toUpperCase();
          const blueImage = node
            .querySelector(`img[src*='${blueLastUppercase}']`)
            ?.getAttribute("src");

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

    // Filter only future events
    const filteredEvents = events.filter((event) => {
      const unix = parseInt(event?.startMain) * 1000;
      const isUpcoming = moment(new Date(unix)).isAfter();
      if (isUpcoming) return event;
    });

    // Convert from unix to Date
    const upcomingEvents = filteredEvents.map((event) => {
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
