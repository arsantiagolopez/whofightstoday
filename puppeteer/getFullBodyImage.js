import puppeteer from "puppeteer";

/**
 * Scrape the official UFC site to get full body image of fighters.
 * @param {string} fighter - Fighter's name to scrape.
 * @returns a string url of the fighter's picture.
 */
const getFullBodyImage = async (fighter) => {
  const slugName = fighter.toLowerCase().replace(" ", "-");
  const url = `https://www.ufc.com/athlete/${slugName}`;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set default timeout to infinite: page will load
    await page.setDefaultNavigationTimeout(0);
    // Go to URL
    await page.goto(url);
    await page.waitForSelector(".c-bio__image");
    // Find full body picture
    // img node inside div with class ".c-bio__image"
    const imageUrl = await page.evaluate(() => {
      const node = document.querySelector(".c-bio__image > img");
      return node.src;
    });
    // Close the browser
    await browser.close();

    return imageUrl;
  } catch (err) {
    console.log(err);
  }
};

export { getFullBodyImage };
