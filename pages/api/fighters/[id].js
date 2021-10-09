import { Fighter } from "../../../models";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Get fighter object of ID.
 * @param {object} req - http request, including query.
 * @param {object} res - http response.
 * @returns a fighter object.
 */
const getFighterById = async ({ query }, res) => {
  const { id } = query;
  try {
    const fighter = await Fighter.findById(id);
    return res.status(200).json(fighter);
  } catch (err) {
    return res.status(400).json({ message: error });
  }
};

// Main
const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      return getFighterById(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
