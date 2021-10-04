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
    await page.waitForSelector(".l-container");
    // Find list of events
    const events = await page.evaluate(() => {
      const headlines = Array.from(
        // Parent node with children nodes that each have separate needed info
        document.querySelectorAll(
          ".l-listing__item > article > .c-card-event--result__info"
        ),
        (node) => {
          const headline = node.querySelector(
            ".c-card-event--result__headline > a"
          ).textContent;
          const mainCardDate = node
            .querySelector(".c-card-event--result__date")
            .getAttribute("data-main-card-timestamp");
          const prelimsDate = node
            .querySelector(".c-card-event--result__date")
            .getAttribute("data-prelims-card-timestamp");

          return {
            headline,
            mainCardDate,
            prelimsDate,
          };
        }
      );

      return headlines;
    });

    // Close the browser
    await browser.close();

    return events;
  } catch (err) {
    console.log(err);
  }
};

export { scrapeSchedule };
