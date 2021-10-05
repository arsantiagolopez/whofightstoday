import puppeteer from "puppeteer";

/**
 * Fallback function in case fighter is missing a picture.
 * Scrape the official UFC site to get full body image of fighters.
 * @param {string} fighter - Fighter's name to scrape.
 * @returns a string url of the fighter's picture.
 */
const scrapeFighterImages = async (fighter) => {
  const slugName = fighter.toLowerCase().replace(" ", "-");
  const url = `https://www.ufc.com/athlete/${slugName}`;

  const names = fighter.split(" ");
  const lastName = names.length > 1 ? names[1] : names[0];

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set default timeout to infinite: page will load
    await page.setDefaultNavigationTimeout(0);
    // Go to URL
    await page.goto(url);
    // Image with src containing upper is essential
    await page.waitForSelector("img[src*='full_body']");
    // Find upper and headshot pictures
    const images = await page.evaluate((lastName) => {
      const upper = document
        .querySelector(
          `img[src*='${lastName.toUpperCase()}'][src*="full_body"]`
        )
        ?.getAttribute("src");
      const headshot = document
        .querySelector(`img[src*='${lastName.toUpperCase()}'][src*="headshot"]`)
        ?.getAttribute("src");

      return {
        upper,
        headshot,
      };
    }, lastName);
    // Close the browser
    await browser.close();

    return images;
  } catch (err) {
    console.log(err);
  }
};

export { scrapeFighterImages };
