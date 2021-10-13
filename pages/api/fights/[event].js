import { Event, Fight, Fighter } from "../../../models";
import { scrapeCard } from "../../../puppeteer";
import { dbConnect } from "../../../utils/dbConnect";
import { getDates } from "../../../utils/getDates";

/**
 * Fetch fights in database.
 * @param {string} event - event identificator.
 * @returns array of object of fights if fights in database,
 * or a false boolean if no fight found in database.
 */
const fetchInDatabase = async (event) => {
  const { startOfWeek, endOfWeek } = getDates();
  const href = `/event/${event}`;

  try {
    const eventExists = await Event.findOne({ href });

    if (!eventExists) return false;

    // If any of the fights older than a week, refetch
    let fights = await Fight.find({
      eventId: eventExists?.id,
      updatedAt: {
        $gte: startOfWeek.toDate(),
        $lt: endOfWeek.toDate(),
      },
    });

    if (!fights.length) return false;

    // Initial scrape only stores one fight (main event),
    // If only one fight stored, scrape all fights
    if (fights.length < 2) {
      const scrapedFights = await scrapeCard(event);
      fights = await handleScrapedCard({ fights: scrapedFights, href });
    }

    return fights;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Create fight if not exists, update if it does and needs to.
 * @param {object} fightProps - required props to create a fight.
 * @param {string} eventId - event ID.
 * @param {string} redFighterId - red fighter ID.
 * @param {string} blueFighterId - blue fighter ID.
 * @param {string} headline - red vs blue fighter fight identifier.
 * @param {string} weight - weight class of fight.
 * @returns an object of the newly created fight.
 */
const createOrUpdateFight = async ({
  fightProps,
  eventId,
  redFighterId,
  blueFighterId,
  headline,
  weight,
}) => {
  const names = headline.split(" vs ");
  const redFighter = names[0];
  const blueFighter = names[1];

  try {
    // Find any instances of past fights with the same eventId &
    // any of the name of the blue or red fighter
    const fights = await Fight.find({
      eventId,
      headline: {
        $regex: redFighter || blueFighter,
      },
    });

    if (!fights.length) {
      return await Fight.create({
        ...fightProps,
        eventId,
        redFighterId,
        blueFighterId,
        headline,
        weight,
      });
    }

    // Delete all instances of past related fights
    await Promise.all(
      fights.map(async ({ _id }) => await Fight.deleteMany({ _id }))
    );

    // Create single new fight
    const fight = await Fight.create({
      ...fightProps,
      eventId,
      redFighterId,
      blueFighterId,
      headline,
      weight,
    });

    return fight;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Create fighter profile if not exists, update if it does and needs to.
 * @param {string} name - full name of fighter.
 * @param {string} image - image of fighter.
 * @param {string} weight - weight class of fighter.
 * @returns an object of a fighter.
 */
const createOrUpdateFighter = async ({ name, image, weight }) => {
  let [firstName, ...lastName] = name.split(" ");
  lastName = lastName.join(" ");

  try {
    const fighter = await Fighter.findOne({ name });

    if (!fighter) {
      return await Fighter.create({
        name,
        firstName,
        lastName,
        image,
        weight,
      });
    }

    fighter.image = image;
    fighter.weight = weight;

    await fighter.save();
    return fighter;
  } catch (err) {
    console.log(err);
  }
};

/**
 *
 * @param {array} fights - fights in card.
 * @param {string} href - event href identificator.
 * @returns an array of objects of fights.
 */
const handleScrapedCard = async ({ fights, href }) => {
  let fightIds = [];

  try {
    const event = await Event.findOne({ href });

    if (!event) return false;

    await Promise.all(
      fights.map(
        async ({
          weight,
          redName,
          blueName,
          redImage,
          blueImage,
          headline,
          ...fightProps
        }) => {
          // Create or update fighter profiles
          const redFighter = await createOrUpdateFighter({
            name: redName,
            image: redImage,
            weight,
          });
          const blueFighter = await createOrUpdateFighter({
            name: blueName,
            image: blueImage,
            weight,
          });

          // Create or update fight instances
          const fight = await createOrUpdateFight({
            eventId: event?._id,
            redFighterId: redFighter?._id,
            blueFighterId: blueFighter?._id,
            headline,
            weight,
            fightProps,
          });

          // Add fight ID to fightIds array to relate to event
          fightIds.push(fight?._id);

          return fight;
        }
      )
    );

    // Relate fight back to event for future queries
    event.fights = fightIds;
    await event.save();

    return fights;
  } catch (err) {
    console.log(err);
  }
};

/**
 * Get all fights from a specific event.
 * @method GET
 * @param {object} req - Http request, including the query.
 * @param {object} res - Http response.
 * @returns an array of objects with fight info.
 */
const getFightsByEvent = async ({ query }, res) => {
  const { event } = query;
  const href = `/event/${event}`;

  const allFightsInDb = await fetchInDatabase(event);

  if (!allFightsInDb) {
    const scrapedCard = await scrapeCard(event);
    const fights = await handleScrapedCard({ fights: scrapedCard, href });
    return res.status(200).json(fights);
  }

  return res.status(200).json(allFightsInDb);
};

// Main
const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      return getFightsByEvent(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
