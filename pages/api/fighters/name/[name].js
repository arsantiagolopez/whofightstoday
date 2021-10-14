import { Fighter } from "../../../../models";
import { dbConnect } from "../../../../utils/dbConnect";

/**
 * Get fighter object by name.
 * @param {object} req - http request, including query.
 * @param {object} res - http response.
 * @returns a fighter object.
 */
const getFighterByName = async ({ query }, res) => {
  const { name } = query;

  try {
    const fighter = await Fighter.findOne({ name });
    return res.status(200).json(fighter);
  } catch (err) {
    return res.status(400).json({ message: err });
  }
};

// Main
const handler = async (req, res) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      return getFighterByName(req, res);
    default:
      return res
        .status(405)
        .end({ success: false, error: `Method ${method} Not Allowed` });
  }
};

export default handler;
