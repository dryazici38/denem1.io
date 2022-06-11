const conf = require("../configs/config.json");
const emojis = require("../configs/emoji.json")
const { Client, Message, MessageEmbed, MessageAttachment} = require("discord.js");
const moment = require("moment");
const ms = require('ms');
const banLimit = new Map();
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["rolkontrol", "rkontrol"],
    name: "Rolkontrol",
    help: "rolkontrol Rol yönet, kanal yönet izinleri açık rolleri gösterir.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`${message.author}, Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`)), message.react(emojis.cross)
        let yt = message.guild.roles.cache.filter(s => s.permissions.has("ADMINISTRATOR"))
        let rolyt = message.guild.roles.cache.filter(s => s.permissions.has("MANAGE_ROLES"))
        let knlyt = message.guild.roles.cache.filter(s => s.permissions.has("MANAGE_CHANNELS"))

        message.channel.send(embed.setDescription(`
Sunucuda Yönetici olan roller; **${yt.size}**

${yt.map(s => `${message.guild.roles.cache.get(s.id)}`)}
──────────────────────────────────
Sunucuda Rol yönet olan roller; **${rolyt.size}**

${rolyt.map(s => `${message.guild.roles.cache.get(s.id)}`)}
──────────────────────────────────
Sunucuda Kanal yönet olan roller; **${knlyt.size}**

${knlyt.map(s => `${message.guild.roles.cache.get(s.id)}`)}
`)), message.react(emojis.mark)
 }
};
