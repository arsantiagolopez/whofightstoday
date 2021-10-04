import { dbConnect } from "../../../utils/dbConnect";

// Scrape once, store data in database, recycle every week.

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getFight = async (req, res) => {};

const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      return getFight(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
