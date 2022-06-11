const conf = require("../configs/config.json");
const moment = require("moment");
moment.locale("tr");
const roles = require("../schemas/roles");
const emojis = require("../configs/emoji.json")
module.exports = {
  conf: {
    aliases: ["rolsüz", "rolsüzver"],
    name: "Rolsüz",
    help: "rolsüz Permi olmayan kullanıcılara kayıtsız permi verir.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(embed.setDescription(`${message.author}, Bu komutu kullanmak için yeterli yetkiye sahip değilsin!`)), message.react(emojis.cross)
    await message.channel.send(embed.setDescription(`**${message.guild.members.cache.filter(s => s.roles.cache.size <= 1).size}** Adet kullanıcıya kayıtsız rolü verildi.`)), message.react(emojis.mark)
    message.guild.members.cache.filter(s => s.roles.cache.size <= 1).forEach(s => s.roles.add(conf.registration.unregRoles).catch(e => {}))
  },
};