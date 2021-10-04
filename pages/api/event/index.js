import axios from "axios";
import moment from "moment";
import { Event } from "../../../models/Event";
import { dbConnect } from "../../../utils/dbConnect";

// Scrape once, store data in database, recycle every week.

// const checkIfStored

/**
 *  Check if
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getWeekEvent = async (req, res) => {
  const ufcScheduleLink =
    "https://www.sherdog.com/organizations/Ultimate-Fighting-Championship-UFC-2";

  const now = moment();
  const startOfWeek = moment(now).startOf("isoWeek").toDate();
  const endOfWeek = moment(now).endOf("isoWeek").toDate();

  // Check if stored in database
  try {
    // Find any stored events this week
    const event = await Event.find({
      date: {
        $gte: startOfWeek,
        $lt: endOfWeek,
      },
    });

    if (!event) {
    }
  } catch (err) {
    console.log(err);
  }

  const response = await axios.get(ufcScheduleLink);
};

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      return getWeekEvent(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
