import moment from "moment";

/**
 * @returns commonly resused dates.
 */
const getDates = () => {
  const now = moment();
  const startOfWeek = moment(now).startOf("isoWeek");
  const endOfWeek = moment(now).endOf("isoWeek");
  const startOfMonth = moment(now).startOf("month");
  const endOfMonth = moment(now).endOf("month");
  return { now, startOfWeek, endOfWeek, startOfMonth, endOfMonth };
};

export { getDates };
