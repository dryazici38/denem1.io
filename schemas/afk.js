const { Schema, model } = require("mongoose");

const schema = Schema({
  guildID: { type: String, default: "" },
  userID: { type: String, default: "" },
  reason: { type: String, default: "" },
  date: { type: Number, default: Date.now() },
  check: { type: Boolean, default: false }
});

module.exports = model("afk", schema);