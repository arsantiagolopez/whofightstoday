import puppeteer from "puppeteer";

/**
 * Scrape the official UFC site to get full body image of fighters.
 * @param {string} fighter - Fighter's name to scrape.
 * @returns a string url of the fighter's picture.
 */
const scrapeSchedule = async () => {
  const url = "https://www.ufc.com/events";

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set default timeout to infinite: page will load
    await page.setDefaultNavigationTimeout(0);
    // Go to URL
    await page.goto(url);
    await page.waitForSelector(".c-card-event--result__info");

    // Find list of events
    const events = await page.evaluate(() => {
      const fights = Array.from(
        // Parent node with children nodes that each have separate needed info
        document.querySelectorAll(".c-card-event--result__info"),
        (node) => {
          const headline = node.querySelector(
            ".c-card-event--result__headline > a"
          ).textContent;
          const mainCardDate = node
            .querySelector("[data-main-card-timestamp]")
            .getAttribute("data-main-card-timestamp");
          const prelimsDate = node
            .querySelector("[data-prelims-card-timestamp]")
            .getAttribute("data-prelims-card-timestamp");

          // Location
          const locality = node.querySelector(".locality")?.textContent;
          const area = node.querySelector(".administrative-area")?.textContent;
          const country = node.querySelector(".country")?.textContent;

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

          return {
            headline,
            mainCardDate,
            prelimsDate,
            location,
          };
        }
      );

      return fights;
    });

    // Close the browser
    await browser.close();

    return events;
  } catch (err) {
    console.log(err);
  }
};

export { scrapeSchedule };
