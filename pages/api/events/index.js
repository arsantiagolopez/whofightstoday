import { Event, Fight, Fighter } from "../../../models";
import { scrapeEvents } from "../../../puppeteer";
import { dbConnect } from "../../../utils/dbConnect";
import { useDates } from "../../../utils/useDates";

/**
 * Clean up past events.
 */
const cleanUpEvents = async () => {
  const { startOfWeek, endOfWeek } = useDates();

  try {
    // Delete all events from last week,
    // OR events that were updated more than a week ago.
    return await Event.deleteMany({
      $or: [
        {
          startMain: {
            $lt: startOfWeek.toDate(),
          },
        },
        {
          updatedAt: {
            $lt: startOfWeek.toDate(),
          },
        },
      ],
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Fetch events in the current week.
 * UFC might change fighters the day of, but main events,
 * dates and venues tend not to change.
 * @returns an array of events if fetched within the last week,
 * or a false boolean if not.
 */
const fetchInDatabase = async () => {
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
 * Create & store event in database.
 * @param {array} event - array of events.
 * @returns an object of the newly created event.
 */
const createEvent = async (event) => {
  try {
    return await Event.create(event);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Create a fighter instance with the minium required info.
 * @param {string} name - full name of fighter.
 * @returns an object of the newly created fighter.
 */
const createFighter = async (name) => {
  let [firstName, ...lastName] = name.split(" ");
  lastName = lastName.join(" ");

  try {
    return await Fighter.create({ name, firstName, lastName });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Create a fight instance with the minium required info.
 * @param {string} headline - Red vs Blue string identifier.
 * @param {string} eventId - ID of event ref.
 * @param {string} redFighterId - ID of red fighter ref.
 * @param {string} blueFighterId - ID of blue fighter ref.
 * @returns an object of the newly created fight.
 */
const createFight = async (fight) => {
  try {
    return await Fight.create({
      ...fight,
      isMainCard: true,
    });
  } catch (err) {
    console.log(err);
  }
};

/**
 * Create events, fighter profiles & fight relations with the
 * available data scraped from the ufc.com/events/ endpoint.
 * @param {object} events - All event objects with information.
 * @returns an array of newly created/updated event objects.
 */
const handleScrapedEvents = async (events) => {
  return await Promise.all(
    events.map(async ({ redName, blueName, ...eventProps }) => {
      const { headline } = eventProps;
      // Create event if not in database
      let event = await Event.findOne({ headline });
      if (!event) {
        event = await createEvent(eventProps);
      }

      // Create fighter profiles if not in database
      let redFighter = await Fighter.findOne({ name: redName });
      let blueFighter = await Fighter.findOne({ name: blueName });
      if (!redFighter) {
        redFighter = await createFighter(redName);
      }
      if (!blueFighter) {
        blueFighter = await createFighter(blueName);
      }

      // Create fight if not in database
      const fightProps = {
        headline,
        eventId: event._id,
        redFighterId: redFighter._id,
        blueFighterId: blueFighter._id,
      };
      let fight = await Fight.findOne(fightProps);
      if (!fight) {
        fight = await createFight(fightProps);
      }

      // Relate fight back to event for future queries
      // & return updated event
      return await Event.findOneAndUpdate(
        { _id: event._id },
        { fights: [fight._id] }
      );
    })
  );
};

/**
 * Checks database once a week to update, and cache events.
 * If event last updated more than a week, refetch from UFC site.
 * @method GET
 * @param {object} req - Http request.
 * @param {object} res - Http response.
 * @returns an array of objects of events.
 */
const getEvents = async (_, res) => {
  const eventsInDb = await fetchInDatabase();

  if (!eventsInDb) {
    const scrapedEvents = await scrapeEvents();
    const events = await handleScrapedEvents(scrapedEvents);
    return res.status(200).json(events);
  }

  return res.status(200).json(eventsInDb);
};

// Main
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
