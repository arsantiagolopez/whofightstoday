import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const FightSchema = new Schema(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    homeId: {
      type: Schema.Types.ObjectId,
      ref: "Fighter",
      required: true,
    },
    awayId: {
      type: Schema.Types.ObjectId,
      ref: "Fighter",
      required: true,
    },
    weight: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Fight = models.Fight || model("Fight", FightSchema, "fights");

export { Fight };
