const { Schema, model } = require("mongoose");

let schema = Schema({
	guildID: { type: String, default: "" },
	userID: { type: String, default: "" },
    adminID: { type: String, default: "" },
    Role: { type: String, default: "" },
    Type: { type: String, default: "" },
    Date: Number,
})
module.exports = model("rollog", schema)