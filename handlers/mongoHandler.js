const mongoose = require("mongoose");
const settings = require("../configs/settings.json");

mongoose.connect(settings.mongoUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("[Database] Mongo veri tabanına bağlanıldı!");
});

mongoose.connection.on("error", () => {
  console.error("[Database] Mongo veri tabanına bağlanılamadı!");
});
