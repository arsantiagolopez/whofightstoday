import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const FighterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    odds: {
      type: Number,
    },
    ranking: {
      type: Number,
    },
    record: {
      type: String,
    },
    country: {
      type: String,
    },
    weight: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Fighter = models.Fighter || model("Fighter", FighterSchema, "fighters");

export { Fighter };
