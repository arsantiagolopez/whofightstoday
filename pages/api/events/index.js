import moment from "moment";
import { Event } from "../../../models/Event";
import { scrapeEvents } from "../../../puppeteer";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Fetch events once a week.
 * UFC might change fighters the day of, but main events,
 * dates and venues tend not to change.
 * @returns an array of events, if fetched within the last week,
 * or a false boolean if not.
 */
const checkDatabase = async () => {
  const now = moment();
  const startOfWeek = moment(now).startOf("isoWeek").toDate();
  const endOfWeek = moment(now).endOf("isoWeek").toDate();

  try {
    const events = await Event.find({
      updatedAt: {
        $gte: startOfWeek,
        $lt: endOfWeek,
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
 * @returns
 */
const createEvents = async (events) => {
  try {
    // Delete old instances of same event
    await Promise.all(
      events.map(
        async ({ headline }) => await Event.findOne({ headline }).remove()
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
 * @param {object} req - Http request.
 * @param {object} res - Http response.
 * @returns an array of objects of events.
 */
const getUpcomingEvents = async (req, res) => {
  const eventsInDb = await checkDatabase();

  if (!eventsInDb) {
    const scrapedEvents = await scrapeEvents();
    const events = await createEvents(scrapedEvents);
    return res.status(200).json({ success: true, events });
  }

  return res.status(200).json({ success: true, events: eventsInDb });
};

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      return getUpcomingEvents(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
