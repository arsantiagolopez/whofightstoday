import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const FightSchema = new Schema(
  {
    redName: {
      type: String,
      required: true,
    },
    blueName: {
      type: String,
      required: true,
    },
    redImage: {
      type: String,
    },
    blueImage: {
      type: String,
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
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Fight = models.Fight || model("Fight", FightSchema, "fights");

export { Fight };
