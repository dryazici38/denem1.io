const conf = require("../configs/config.json");
const { Client, Message, MessageEmbed, MessageAttachment} = require("discord.js");
const roles = require("../schemas/rolLog");
const moment = require("moment");
const ms = require('ms');
const banLimit = new Map();
const emojis = require("../configs/emoji.json")
moment.locale("tr");

module.exports = {
  conf: {
    aliases: ["rollog", "rlog"],
    name: "Rollog",
    help: "rollog <kullanıcı/ıd> Kullanıcının rol geçmişini gösterir.",
  },

  /**
   * @param { Client } client
   * @param { Message } message
   * @param { Array<String> } args
   */

  run: async (client, message, args, embed) => {
   const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.error(message, "Bir kullanıcı belirtmelisin!"), message.react(emojis.cross);
    let data = await roles.findOne({ guildID: message.guild.id, userID: member.user.id, });
    if (!data) return message.channel.send(embed.setDescription(`${member.toString()} üyesinin rol geçmişi bulunmuyor!`)), message.react(emojis.cross);
    data = data.roles.sort((a, b) => b.date - a.date).map((x) => `${x.type ? emojis.mark + " Rol verildi" : emojis.cross + " Rol alındı"}. Rol: <@&${x.role}>, Yetkili: <@${x.staff}> \nTarih: ${moment(x.date).format("LLL")} \`(${moment(x.date).fromNow()})\``).join("\n**────────────**\n");
    embed.setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 2048 }));
    for (var i = 0; i < Math.floor(data.length / 2000); i++) {
      message.channel.send(embed.setDescription(data.slice(0, 2000)));
      data = data.slice(2000);
    }
    if (data.length > 0) message.channel.send(embed.setDescription(data)), message.react(emojis.mark);
  },
};
