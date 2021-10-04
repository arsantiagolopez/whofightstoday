import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const EventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
    },
    type: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Event = models.Event || model("Event", EventSchema, "events");

export { Event };
