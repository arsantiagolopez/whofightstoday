import moment from "moment";
// import { Schedule } from "../../../models/Schedule"

const checkDatabase = (req, res) => {
  const now = moment();
  const startOfMonth = moment().startOf("month");
  const endOfMonth = moment().startOf("month");
};

const getMonthlySchedule = (req, res) => {};

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
