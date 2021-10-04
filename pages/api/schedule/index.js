import moment from "moment";
import { Schedule } from "../../../models/Schedule";
import { scrapeSchedule } from "../../../puppeteer";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Fetch schedule once a week.
 * UFC might change fighters the day of, but main events,
 * dates and venues tend not to change.
 * @param {object} req
 * @param {object} res
 */
const checkDatabase = async () => {
  const now = moment();
  const startOfWeek = moment(now).startOf("isoWeek").toDate();
  const endOfWeek = moment(now).endOf("isoWeek").toDate();

  try {
    const schedule = await Schedule.findOne({
      updatedAt: {
        $gte: startOfWeek,
        $lt: endOfWeek,
      },
    });

    return schedule;
  } catch (err) {
    console.log(err);
  }
};

const getMonthlySchedule = async (req, res) => {
  const scheduleExists = await checkDatabase();

  if (!scheduleExists) {
    const schedule = await scrapeSchedule();

    // @todo: Continue here. Introduce logic to filter only upcoming future events
    console.log("schedule", schedule);
  }
};

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      return getMonthlySchedule(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
