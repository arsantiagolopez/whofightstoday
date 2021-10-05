import { Event } from "../../../models/Event";
import { scrapeEvents } from "../../../puppeteer";
import { dbConnect } from "../../../utils/dbConnect";
import { useDates } from "../../../utils/useDates";

/**
 * Fetch events once a week.
 * UFC might change fighters the day of, but main events,
 * dates and venues tend not to change.
 * @returns an array of events, if fetched within the last week,
 * or a false boolean if not.
 */
const checkDatabase = async () => {
  const { startOfWeek, endOfWeek } = useDates();

  try {
    const events = await Event.find({
      updatedAt: {
        $gte: startOfWeek.toDate(),
        $lt: endOfWeek.toDate(),
      },
    });

    if (!events.length) return false;

    return events;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Create & store events in database.
 * @param {array} events - array of events.
 * @returns an array of newly added/updated events.
 */
const createEvents = async (events) => {
  try {
    // Delete old instances of same event
    await Promise.all(
      events.map(
        async ({ headline }) => await Event.findOneAndRemove({ headline })
      )
    );
    // Create & save new/updated events
    return await Event.insertMany(events);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Checks database once a week to update, and cache events.
 * If event last updated more than a week, refetch from UFC site.
 * @method GET
 * @param {object} req - Http request.
 * @param {object} res - Http response.
 * @returns an array of objects of events.
 */
const getEvents = async (req, res) => {
  const eventsInDb = await checkDatabase();

  if (!eventsInDb) {
    const scrapedEvents = await scrapeEvents();
    const events = await createEvents(scrapedEvents);
    return res.status(200).json(events);
  }

  return res.status(200).json(eventsInDb);
};

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      return getEvents(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
