import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const FightSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    headline: {
      type: String,
      required: true,
    },
    redFighterId: {
      type: Schema.Types.ObjectId,
      ref: "Fighter",
      required: true,
    },
    blueFighterId: {
      type: Schema.Types.ObjectId,
      ref: "Fighter",
      required: true,
    },
    weight: {
      type: String,
    },
    redOdds: {
      type: String,
    },
    blueOdds: {
      type: String,
    },
    redRanking: {
      type: String,
    },
    blueRanking: {
      type: String,
    },
    isMainCard: {
      type: Boolean,
    },
    order: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Fight = models.Fight || model("Fight", FightSchema, "fights");

export { Fight };
