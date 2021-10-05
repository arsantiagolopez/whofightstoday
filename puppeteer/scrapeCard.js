import puppeteer from "puppeteer";

/**
 * Scrape the official UFC site for a specific card.
 * @param {string} href - URL for card that includes all the fight info.
 * @returns an array of objects with fights and info.
 */
const scrapeCard = async (href) => {
  const url = `https://ufc.com${href}`;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set default timeout to infinite: page will load
    await page.setDefaultNavigationTimeout(0);
    // Go to URL
    await page.goto(url);
    await page.waitForSelector(".c-listing-fight");

    // Find list of events
    const card = await page.evaluate(() => {
      const fights = Array.from(
        // Parent node with children nodes that each have separate needed info
        document.querySelectorAll("[class*='fight__content']"),
        (node) => {
          const weight = node.querySelector(
            "[class*='fight__class']"
          )?.textContent;

          // Names
          const redName = node
            .querySelector("[class*='fight__detail-corner-name']")
            ?.textContent?.replace(/\n/g, "")
            ?.replaceAll("  ", "");
          const blueName = node
            .querySelectorAll("[class*='fight__detail-corner-name']")[1]
            ?.textContent?.replace(/\n/g, "")
            ?.replaceAll("  ", "");

          // Odds
          const redOdds = node.querySelector(
            "[class*='fight__odds-amount']"
          )?.textContent;
          const blueOdds = node.querySelectorAll(
            "[class*='fight__odds-amount']"
          )[1]?.textContent;

          // Ranking
          const redRanking = node
            .querySelector("[class*='red-corner-rank']")
            ?.textContent?.replace(/\n/g, "")
            ?.replaceAll("  ", "");
          const blueRanking = node
            .querySelector("[class*='blue-corner-rank']")
            ?.textContent?.replace(/\n/g, "")
            ?.replaceAll("  ", "");

          // Images
          // Find a img with src that contains fighter's uppercase last name
          const redLastUppercase = redName.split(" ")[1]?.toUpperCase();
          const redImage = node
            .querySelector(`img[src*='${redLastUppercase}']`)
            ?.getAttribute("src");
          const blueLastUppercase = blueName.split(" ")[1]?.toUpperCase();
          const blueImage = node
            .querySelector(`img[src*='${blueLastUppercase}']`)
            ?.getAttribute("src");

          // Main card and Prelim tabs both have main or prelim on their id prop
          let isMainCard = node.closest("details[open]")?.getAttribute("id");
          isMainCard = isMainCard.includes("prelims") ? false : true;

          return {
            weight,
            redName,
            blueName,
            redOdds,
            blueOdds,
            redRanking,
            blueRanking,
            redImage,
            blueImage,
            isMainCard,
          };
        }
      );

      return fights;
    });

    // Close the browser
    await browser.close();

    return card;
  } catch (err) {
    console.log(err);
  }
};

export { scrapeCard };
