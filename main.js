const { Client, Collection } = require("discord.js");
const client = (global.client = new Client({ fetchAllMembers: true }));
const settings = require("./src/configs/settings.json");
client.commands = new Collection();
client.aliases = new Collection();
client.cooldown = new Map();
require("./src/handlers/commandHandler");
require("./src/handlers/eventHandler");
require("./src/handlers/mongoHandler");
require("./src/handlers/functionHandler")(client);

client
  .login(settings.token)
  .then(() => console.log(`[START] ${client.user.tag} kullanıma hazır!`))
  .catch(() => console.log(`${client.user.tag} botu başlatılamadı!`));

client.on("ready", () => {
  client.user.setStatus("idle");
  setInterval(() => {
    const oynuyor = settings.oynuyor;
    const index = Math.floor(Math.random() * oynuyor.length);
    client.user.setActivity(`${oynuyor[index]}`, { type: "WATCHING" });
  }, 10000);

  client.channels.cache.get(settings.botVoice).join();
});
var logs = require("discord-logs");
logs(client);

client.on("guildMemberOffline", (member, oldStatus) => {
  db.set(`status_${member.id}`, Date.now());
});
client.on("guildMemberOnline", (member, newStatus) => {
  db.delete(`status_${member.id}`, newStatus);
});
