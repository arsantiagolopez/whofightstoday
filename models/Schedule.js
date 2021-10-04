import mongoose from "mongoose";

const { model, models, Schema } = mongoose;

const ScheduleSchema = new Schema(
  {
    month: {
      type: String,
      required: true,
    },
    event: [
      {
        type: Schema.Types.ObjectId,
        ref: "Event",
        required: true,
      },
    ],
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Schedule =
  models.Schedule || model("Schedule", ScheduleSchema, "schedules");

export { Schedule };
