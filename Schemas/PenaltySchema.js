const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const penaltySchema = new Schema(
  {
    user: { type: String, required: true },
    title: String,
    id: { type: String, unique: true },
    department: { type: String, required: true },
    tower: { type: String, required: true },
    penalty: { type: String, required: true },
    images: [String],
    date: { date: String, time: String },
  },
  {
    timestamps: true,
    collection: "penalties",
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

mongoose.model("penalties", penaltySchema);
