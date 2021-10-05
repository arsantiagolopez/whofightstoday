import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const EventSchema = new Schema(
  {
    headline: {
      type: String,
      required: true,
    },
    startMain: {
      type: Date,
      required: true,
    },
    startPrelims: {
      type: Date,
    },
    type: {
      type: String,
    },
    venue: {
      type: String,
    },
    location: {
      type: String,
    },
    href: {
      type: String,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Event = models.Event || model("Event", EventSchema, "events");

export { Event };
