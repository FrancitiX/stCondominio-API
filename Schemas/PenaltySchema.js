import { Schema as _Schema, model } from "mongoose";
const Schema = _Schema;

const penaltySchema = new Schema(
  {
    user: { type: String, required: true },
    name: String,
    department: { type: String, required: true },
    tower: { type: String, required: true },
    penalty: { type: String, required: true },
    date: { date: String, time: String },
  },
  {
    timestamps: true,
  },
  {
    collection: "penaltys",
  }
);

penaltySchema.pre("save", function (next) {
  const dateMexico = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });
  const [datePart, timePart] = dateMexico.split(", ");
  this.date = { date: datePart, time: timePart };
  next();
});

export default model("penalty", penaltySchema);
