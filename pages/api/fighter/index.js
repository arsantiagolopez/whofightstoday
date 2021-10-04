import axios from "axios";
import { getFullBodyImage } from "../../../puppeteer";
import { dbConnect } from "../../../utils/dbConnect";

// Scrape once, store data in database, recycle every week.

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getFighterImage = async (req, res) => {
  const imageUrl = await getFullBodyImage("Mackenzie Dern");

  console.log("imageUrl", imageUrl);

  return;
  const response = await axios.get(ufcScheduleLink);
  const html = response?.data;

  console.log(html);
};

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      return getFighterImage(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
