import { Fight } from "../../../models";
import { scrapeCard } from "../../../puppeteer";
import { dbConnect } from "../../../utils/dbConnect";
import { useDates } from "../../../utils/useDates";

// Scrape once, store data in database, recycle every week.

const checkDatabase = async () => {
  const { startOfWeek, endOfWeek } = useDates();

  try {
    // If any of the fights older than a week, refetch
    const fights = await Fight.find({
      updatedAt: {
        $gte: startOfWeek.toDate(),
        $lt: endOfWeek.toDate(),
      },
    });

    if (!fights.length) return false;

    return fights;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Create & store fights in database.
 * @param {array} fights - array of fights.
 * @returns an array of newly added/updated fights.
 */
const createFights = async (fights) => {
  try {
    // Delete old instances of same event
    await Promise.all(
      fights.map(
        async ({ redName, blueName }) =>
          await Fight.findOneAndRemove({ redName, blueName })
      )
    );
    // Create & save new/updated fights
    return await Fight.insertMany(fights);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get all fights from a spcific card.
 * @method GET
 * @param {object} req - Http request.
 * @param {object} res - Http response.
 * @returns an array of objects with fight info.
 */
const getFights = async ({ query }, res) => {
  const { event } = query;

  const fightsInDb = await checkDatabase();

  if (!fightsInDb) {
    const scrapedFights = await scrapeCard(event);
    const fights = await createFights(scrapedFights);
    return res.status(200).json(fights);
  }

  return res.status(200).json(fightsInDb);
};

// Main
const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      return getFights(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
