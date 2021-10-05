import moment from "moment";

/**
 * @returns commonly resused dates.
 */
const useDates = () => {
  const now = moment();
  const startOfWeek = moment(now).startOf("isoWeek");
  const endOfWeek = moment(now).endOf("isoWeek");
  return { now, startOfWeek, endOfWeek };
};

export { useDates };
