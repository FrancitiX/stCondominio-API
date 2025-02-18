const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tokenSchema = new Schema(
  {
    user: String,
    token: String,
    session: Number,
    status: Boolean,
    date: { date: String, time: String },
  },
  {
    timestamps: true,
    collection: "tokens",
  }
);

tokenSchema.pre("save", function (next) {
  const dateMexico = new Date().toLocaleString("es-MX", {
    timeZone: "America/Mexico_City",
  });
  const [datePart, timePart] = dateMexico.split(", ");
  this.date = { date: datePart, time: timePart };
  next();
});

mongoose.model("token", tokenSchema);