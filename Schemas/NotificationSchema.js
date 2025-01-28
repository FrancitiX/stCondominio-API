import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const notificationSchema = new Schema(
  {
    id: { type: String, unique: true},
    department: [{ type: String, required: true }],
    tower: { type: String, required: true },
    title: String,
    short: String,
    description: String,
    images: [String],
    type: { type: String, required: true },
    recipients: [
        {
          user: { type: String, required: true },
          read: { type: Boolean, default: false },
        },
      ],
    date: { date: String, time: String },
  },
  {
    timestamps: true,
    collection: "notifications",
  }
);

notificationSchema.pre("save", function (next) {
  const dateMexico = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });
  const [datePart, timePart] = dateMexico.split(", ");
  this.date = { date: datePart, time: timePart };
  next();
});

export default model("penalty", notificationSchema);